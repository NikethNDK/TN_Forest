/**
 * File Upload Service
 * 
 * Handles secure file uploads to Cloudinary using Firebase Cloud Functions
 * for signature generation. This ensures the API secret is never exposed
 * to the client.
 */

import { generateUploadSignature } from '../../config/firebase';
import { cloudinaryConfig, CLOUDINARY_UPLOAD_URL } from '../../config/cloudinary';
import { getIdToken } from '../firebase/authService';

export interface UploadResult {
  success: boolean;
  path?: string; // Cloudinary secure URL
  publicId?: string; // Cloudinary public ID for future reference
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_PDF_TYPES = ['application/pdf'];

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP images.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
  }
  return { valid: true };
};

export const validatePDFFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_PDF_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload PDF files only.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
  }
  return { valid: true };
};

/**
 * Upload image file to Cloudinary with secure signature
 */
export const uploadImageFile = async (
  file: File,
  directory: string = 'tn-forest/images',
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    
    if (folder) {
      formData.append('folder', folder);
    }

    // Step 4: Upload file to Cloudinary
    try {
      const uploadData = await new Promise<any>((resolve, reject) => {
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

        xhr.open('POST', CLOUDINARY_UPLOAD_URL);
        xhr.send(formData);
      });

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
 * Upload PDF file to Cloudinary with secure signature
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
    // Note: For PDFs, we use the raw upload endpoint
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/raw/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    
    if (folder) {
      formData.append('folder', folder);
    }

    // Step 4: Upload file to Cloudinary
    try {
      const uploadData = await new Promise<any>((resolve, reject) => {
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
 * Uses Firebase Cloud Function for secure deletion
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<{ success: boolean; error?: string }> => {
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

