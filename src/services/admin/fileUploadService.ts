/**
 * File Upload Service
 * 
 * Handles secure file uploads to Firebase Storage.
 * Legacy support for Cloudinary deletions is maintained for existing files.
 * 
 * NEW UPLOADS: Go to Firebase Storage
 * DELETIONS: Supports both Firebase Storage and Cloudinary (based on URL)
 */

import { cloudinaryConfig } from '../../config/cloudinary';
import { getIdToken } from '../firebase/authService';
import { compressImage, shouldCompress, formatFileSize, CompressionResult } from '../imageCompressionService';
import { 
  uploadImageToFirebaseStorage, 
  uploadPdfToFirebaseStorage,
  UploadProgress 
} from '../firebase/storageService';

// Feature flag for Cloudinary deletion method (keep for legacy file deletion)
const USE_UNSIGNED_UPLOAD = import.meta.env.VITE_USE_UNSIGNED_UPLOAD === 'true';

export interface UploadResult {
  success: boolean;
  path?: string; // Download URL (Firebase Storage or Cloudinary)
  publicId?: string; // Cloudinary public ID (legacy) or Firebase Storage path
  storagePath?: string; // Firebase Storage full path for deletion
  storageProvider?: 'firebase' | 'cloudinary'; // Which storage was used
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
 * Upload image file to Firebase Storage with automatic compression
 * 
 * @param file - The image file to upload
 * @param directory - Storage folder path
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

  // Check if compressed image exceeds 10MB limit
  if (fileToUpload.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `Image size (${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of 10MB after compression.`
    };
  }

  // Step 2: Upload to Firebase Storage
  try {
    // Verify authentication
    const authToken = await getIdToken();
    if (!authToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload files.'
      };
    }

    // Upload to Firebase Storage with progress tracking
    const result = await uploadImageToFirebaseStorage(
      fileToUpload,
      directory,
      (progress: UploadProgress) => {
        onProgressWithPhase?.({ phase: 'uploading', progress: progress.progress });
        // For legacy callback, upload is 50-100% of total progress
        if (compressionResult) {
          onProgress?.(50 + Math.round(progress.progress * 0.5));
        } else {
          onProgress?.(progress.progress);
        }
      }
    );

    if (result.success) {
      return {
        success: true,
        path: result.downloadUrl,
        publicId: result.storagePath, // Use storagePath as publicId for backward compatibility
        storagePath: result.storagePath,
        storageProvider: 'firebase',
        originalSize: compressionResult?.originalSize,
        compressedSize: compressionResult?.compressedSize,
        compressionRatio: compressionResult?.compressionRatio,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to upload file.'
      };
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file. Please try again.'
    };
  }
};

/**
 * Upload PDF file to Firebase Storage
 * No size limit for PDFs
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

  try {
    // Verify authentication
    const authToken = await getIdToken();
    if (!authToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload files.'
      };
    }

    // Upload to Firebase Storage with progress tracking
    const result = await uploadPdfToFirebaseStorage(
      file,
      directory,
      (progress: UploadProgress) => {
        onProgress?.(progress.progress);
      }
    );

    if (result.success) {
      return {
        success: true,
        path: result.downloadUrl,
        publicId: result.storagePath, // Use storagePath as publicId for backward compatibility
        storagePath: result.storagePath,
        storageProvider: 'firebase',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to upload file.'
      };
    }
  } catch (error: any) {
    console.error('PDF upload error:', error);
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

