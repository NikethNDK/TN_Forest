/**
 * File Upload Service
 * 
 * Handles secure file uploads to Cloudinary using Firebase Cloud Functions
 * for signature generation. This ensures the API secret is never exposed
 * to the client.
 * 
 * Supports both signed (via Firebase Functions) and unsigned (direct) uploads
 * based on the VITE_USE_UNSIGNED_UPLOAD environment variable.
 */

import { generateUploadSignature } from '../../config/firebase';
import { cloudinaryConfig, CLOUDINARY_UPLOAD_URL } from '../../config/cloudinary';
import { getIdToken } from '../firebase/authService';
import { compressImage, shouldCompress, formatFileSize, CompressionResult } from '../imageCompressionService';

// Feature flag: Use unsigned uploads (direct to Cloudinary) when true
const USE_UNSIGNED_UPLOAD = import.meta.env.VITE_USE_UNSIGNED_UPLOAD === 'true';
const UNSIGNED_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET as string;

export interface UploadResult {
  success: boolean;
  path?: string; // Cloudinary secure URL
  publicId?: string; // Cloudinary public ID for future reference
  error?: string;
  // Compression info (for images)
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
}

export interface UploadProgressInfo {
  phase: 'compressing' | 'uploading';
  progress: number; // 0-100
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_PDF_TYPES = ['application/pdf'];

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP images.' };
  }
  // if (file.size > MAX_FILE_SIZE) {
  //   return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
  // }
  return { valid: true };
};

export const validatePDFFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_PDF_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload PDF files only.' };
  }
  // if (file.size > MAX_FILE_SIZE) {
  //   return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
  // }
  return { valid: true };
};

/**
 * Helper: Upload file to Cloudinary via XHR with progress tracking
 */
const uploadToCloudinary = (
  uploadUrl: string,
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.error?.message || 'Failed to upload file to Cloudinary.'));
        } catch {
          reject(new Error('Failed to upload file to Cloudinary.'));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
    };

    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  });
};

/**
 * Helper: Prepare FormData for signed upload
 */
const prepareSignedFormData = (
  file: File,
  signature: string,
  timestamp: number,
  folder?: string
): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', cloudinaryConfig.apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  
  if (folder) {
    formData.append('folder', folder);
  }
  
  return formData;
};

/**
 * Helper: Prepare FormData for unsigned upload
 */
const prepareUnsignedFormData = (
  file: File,
  folder?: string
): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (UNSIGNED_UPLOAD_PRESET) {
    formData.append('upload_preset', UNSIGNED_UPLOAD_PRESET);
  }
  
  if (folder) {
    formData.append('folder', folder);
  }
  
  return formData;
};

/**
 * Helper: Generate Cloudinary signature for API calls
 * TEMPORARY: Used for direct deletion when Firebase Functions are disabled
 * Uses SHA-1 hashing as required by Cloudinary
 */
const generateCloudinarySignature = async (
  params: Record<string, any>,
  apiSecret: string
): Promise<string> => {
  // Sort parameters and create signature string
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  // Create signature string: sorted_params + api_secret
  const signatureString = sortedParams + apiSecret;
  
  // Use Web Crypto API for SHA-1 hashing (browser-compatible)
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

/**
 * Upload image file to Cloudinary with automatic compression
 * Supports both signed (Firebase Functions) and unsigned (direct) uploads
 * 
 * @param file - The image file to upload
 * @param directory - Cloudinary folder path
 * @param onProgress - Simple progress callback (0-100) - legacy support
 * @param onProgressWithPhase - Detailed progress callback with phase info
 */
export const uploadImageFile = async (
  file: File,
  directory: string = 'tn-forest/images',
  onProgress?: (progress: number) => void,
  onProgressWithPhase?: (info: UploadProgressInfo) => void
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Step 1: Compress image if needed
  let fileToUpload = file;
  let compressionResult: CompressionResult | null = null;

  if (shouldCompress(file)) {
    try {
      // Notify compression phase started
      onProgressWithPhase?.({ phase: 'compressing', progress: 0 });
      
      compressionResult = await compressImage(
        file,
        {
          maxSizeMB: 2,
          maxWidthOrHeight: 2048,
          quality: 0.8,
          useWebWorker: true,
        },
        (progress) => {
          onProgressWithPhase?.({ phase: 'compressing', progress });
          // For legacy callback, compression is 0-50% of total progress
          onProgress?.(Math.round(progress * 0.5));
        }
      );
      
      fileToUpload = compressionResult.compressedFile;
      
      console.log(
        `Image compressed: ${formatFileSize(compressionResult.originalSize)} → ${formatFileSize(compressionResult.compressedSize)} (${compressionResult.compressionRatio}% reduction)`
      );
    } catch (error) {
      console.warn('Compression failed, uploading original file:', error);
      // Continue with original file if compression fails
    }
  }

  // Step 2: Upload to Cloudinary
  const handleUploadProgress = (progress: number) => {
    onProgressWithPhase?.({ phase: 'uploading', progress });
    // For legacy callback, upload is 50-100% of total progress
    if (compressionResult) {
      onProgress?.(50 + Math.round(progress * 0.5));
    } else {
      onProgress?.(progress);
    }
  };

  // Unsigned upload path
  if (USE_UNSIGNED_UPLOAD) {
    if (!UNSIGNED_UPLOAD_PRESET) {
      return {
        success: false,
        error: 'Unsigned upload preset not configured. Please set VITE_CLOUDINARY_UNSIGNED_PRESET.'
      };
    }

    try {
      const formData = prepareUnsignedFormData(fileToUpload, directory);
      const uploadData = await uploadToCloudinary(CLOUDINARY_UPLOAD_URL, formData, handleUploadProgress);

      return {
        success: true,
        path: uploadData.secure_url,
        publicId: uploadData.public_id,
        originalSize: compressionResult?.originalSize,
        compressedSize: compressionResult?.compressedSize,
        compressionRatio: compressionResult?.compressionRatio,
      };
    } catch (uploadError: any) {
      return {
        success: false,
        error: uploadError.message || 'Failed to upload file to Cloudinary.'
      };
    }
  }

  // Signed upload path (default)
  try {
    // Step 1: Get authentication token
    const authToken = await getIdToken();
    if (!authToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload files.'
      };
    }

    // Step 2: Request upload signature from Firebase Cloud Function
    const signatureResponse = await generateUploadSignature({
      fileType: file.type,
      fileSize: file.size,
      folder: directory,
    });

    const { signature, timestamp, folder } = signatureResponse.data;

    if (!signature || !timestamp) {
      return {
        success: false,
        error: 'Failed to generate upload signature. Please try again.'
      };
    }

    // Step 3: Prepare FormData for Cloudinary upload
    const formData = prepareSignedFormData(fileToUpload, signature, timestamp, folder);

    // Step 4: Upload file to Cloudinary
    try {
      const uploadData = await uploadToCloudinary(CLOUDINARY_UPLOAD_URL, formData, handleUploadProgress);

      // Step 5: Return secure URL with compression info
      return {
        success: true,
        path: uploadData.secure_url, // Cloudinary secure URL
        publicId: uploadData.public_id, // For future reference/updates
        originalSize: compressionResult?.originalSize,
        compressedSize: compressionResult?.compressedSize,
        compressionRatio: compressionResult?.compressionRatio,
      };
    } catch (uploadError: any) {
      // Handle upload-specific errors
      return {
        success: false,
        error: uploadError.message || 'Failed to upload file to Cloudinary.'
      };
    }
  } catch (error: any) {
    // Handle Firebase Functions errors
    if (error.code === 'unauthenticated') {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload files.'
      };
    }
    if (error.code === 'permission-denied') {
      return {
        success: false,
        error: 'Permission denied. Admin access required to upload files.'
      };
    }
    if (error.code === 'invalid-argument') {
      return {
        success: false,
        error: error.message || 'Invalid file. Please check file type and size.'
      };
    }
    if (error.code === 'functions/internal') {
      // Include the full error message for internal errors to help debug
      return {
        success: false,
        error: error.message || error.details || 'Cloudinary configuration error. Please check server logs.'
      };
    }

    return {
      success: false,
      error: error.message || error.details || 'Failed to upload file. Please try again.'
    };
  }
};

/**
 * Upload PDF file to Cloudinary
 * Supports both signed (Firebase Functions) and unsigned (direct) uploads
 */
export const uploadPDFFile = async (
  file: File,
  directory: string = 'tn-forest/documents',
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const validation = validatePDFFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Note: For PDFs, we use the raw upload endpoint
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/raw/upload`;

  // Unsigned upload path
  if (USE_UNSIGNED_UPLOAD) {
    if (!UNSIGNED_UPLOAD_PRESET) {
      return {
        success: false,
        error: 'Unsigned upload preset not configured. Please set VITE_CLOUDINARY_UNSIGNED_PRESET.'
      };
    }

    try {
      const formData = prepareUnsignedFormData(file, directory);
      const uploadData = await uploadToCloudinary(uploadUrl, formData, onProgress);

      return {
        success: true,
        path: uploadData.secure_url,
        publicId: uploadData.public_id,
      };
    } catch (uploadError: any) {
      return {
        success: false,
        error: uploadError.message || 'Failed to upload file to Cloudinary.'
      };
    }
  }

  // Signed upload path (default)
  try {
    // Step 1: Get authentication token
    const authToken = await getIdToken();
    if (!authToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload files.'
      };
    }

    // Step 2: Request upload signature from Firebase Cloud Function
    const signatureResponse = await generateUploadSignature({
      fileType: file.type,
      fileSize: file.size,
      folder: directory,
    });

    const { signature, timestamp, folder } = signatureResponse.data;

    if (!signature || !timestamp) {
      return {
        success: false,
        error: 'Failed to generate upload signature. Please try again.'
      };
    }

    // Step 3: Prepare FormData for Cloudinary upload
    const formData = prepareSignedFormData(file, signature, timestamp, folder);

    // Step 4: Upload file to Cloudinary
    try {
      const uploadData = await uploadToCloudinary(uploadUrl, formData, onProgress);

      // Step 5: Return secure URL
      return {
        success: true,
        path: uploadData.secure_url, // Cloudinary secure URL
        publicId: uploadData.public_id, // For future reference/updates
      };
    } catch (uploadError: any) {
      // Handle upload-specific errors
      return {
        success: false,
        error: uploadError.message || 'Failed to upload file to Cloudinary.'
      };
    }
  } catch (error: any) {
    // Handle Firebase Functions errors
    if (error.code === 'unauthenticated') {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload files.'
      };
    }
    if (error.code === 'permission-denied') {
      return {
        success: false,
        error: 'Permission denied. Admin access required to upload files.'
      };
    }
    if (error.code === 'invalid-argument') {
      return {
        success: false,
        error: error.message || 'Invalid file. Please check file type and size.'
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to upload file. Please try again.'
    };
  }
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to create preview'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Delete image from Cloudinary
 * Supports both Firebase Cloud Function (secure) and direct API (temporary)
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<{ success: boolean; error?: string }> => {
  // Temporary: Direct Cloudinary Admin API path (when Firebase Functions disabled)
  if (USE_UNSIGNED_UPLOAD) {
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET as string;
    
    if (!apiSecret) {
      return {
        success: false,
        error: 'Cloudinary API secret not configured. Please set VITE_CLOUDINARY_API_SECRET in .env'
      };
    }

    try {
      // Generate signature for deletion
      const timestamp = Math.round(Date.now() / 1000);
      const params: Record<string, any> = {
        public_id: publicId,
        timestamp,
      };

      // Generate signature using Cloudinary's algorithm
      const signature = await generateCloudinarySignature(params, apiSecret);

      // Call Cloudinary Admin API
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', cloudinaryConfig.apiKey);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (result.result === 'ok' || result.result === 'not found') {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error?.message || 'Failed to delete image from Cloudinary.'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete image. Please try again.'
      };
    }
  }

  // Firebase Functions path (default - secure)
  try {
    // Get authentication token
    const authToken = await getIdToken();
    if (!authToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in to delete files.'
      };
    }

    // Call Firebase Cloud Function to delete image
    const { deleteCloudinaryImage } = await import('../../config/firebase');
    const deleteResponse = await deleteCloudinaryImage({ publicId });

    if (deleteResponse.data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: deleteResponse.data.message || 'Failed to delete image from Cloudinary.'
      };
    }
  } catch (error: any) {
    // Handle Firebase Functions errors
    if (error.code === 'unauthenticated') {
      return {
        success: false,
        error: 'Authentication required. Please log in to delete files.'
      };
    }
    if (error.code === 'permission-denied') {
      return {
        success: false,
        error: 'Permission denied. Admin access required to delete files.'
      };
    }
    if (error.code === 'invalid-argument') {
      return {
        success: false,
        error: error.message || 'Invalid public ID provided.'
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to delete image. Please try again.'
    };
  }
};

