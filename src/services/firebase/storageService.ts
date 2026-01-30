/**
 * Firebase Storage Service
 * 
 * Handles file uploads and deletions to Firebase Storage.
 * Used for new uploads while Cloudinary handles legacy files.
 */

import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  UploadTaskSnapshot 
} from 'firebase/storage';
import { storage } from '../../config/firebase';
import { 
  generateUniqueFilename, 
  extractFirebaseStoragePath,
  isFirebaseStorageUrl,
  isCloudinaryUrl 
} from '../../utils/storageHelpers';
import { deleteImageFromCloudinary } from '../admin/fileUploadService';

export interface FirebaseUploadResult {
  success: boolean;
  downloadUrl?: string;
  storagePath?: string;  // Full path in Firebase Storage for deletion
  error?: string;
  // Compression info (passed through from caller)
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for images (after compression)

/**
 * Upload a file to Firebase Storage
 * 
 * @param file - The file to upload
 * @param folder - The folder path in storage (e.g., 'tn-forest/images')
 * @param onProgress - Optional callback for upload progress
 * @returns Upload result with download URL and storage path
 */
export const uploadToFirebaseStorage = async (
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<FirebaseUploadResult> => {
  try {
    // Generate unique filename to prevent collisions and sanitize
    const uniqueFilename = generateUniqueFilename(file.name);
    const storagePath = `${folder}/${uniqueFilename}`;
    
    // Create storage reference
    const storageRef = ref(storage, storagePath);
    
    // Start upload with resumable upload for progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });
    
    // Return a promise that resolves when upload completes
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          // Track progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgress?.({
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress,
          });
        },
        (error) => {
          // Handle upload errors
          console.error('Firebase Storage upload error:', error);
          
          let errorMessage = 'Failed to upload file.';
          switch (error.code) {
            case 'storage/unauthorized':
              errorMessage = 'Permission denied. Please ensure you are logged in as admin.';
              break;
            case 'storage/canceled':
              errorMessage = 'Upload was cancelled.';
              break;
            case 'storage/quota-exceeded':
              errorMessage = 'Storage quota exceeded.';
              break;
            case 'storage/invalid-checksum':
              errorMessage = 'File upload failed. Please try again.';
              break;
            default:
              errorMessage = error.message || 'Failed to upload file.';
          }
          
          resolve({
            success: false,
            error: errorMessage,
          });
        },
        async () => {
          // Upload completed successfully - get download URL
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              success: true,
              downloadUrl,
              storagePath,
            });
          } catch (urlError: any) {
            console.error('Failed to get download URL:', urlError);
            resolve({
              success: false,
              error: 'File uploaded but failed to get download URL.',
            });
          }
        }
      );
    });
  } catch (error: any) {
    console.error('Firebase Storage upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file.',
    };
  }
};

/**
 * Upload an image file to Firebase Storage with size validation
 * 
 * @param file - The image file to upload (should be pre-compressed)
 * @param folder - The folder path in storage
 * @param onProgress - Optional callback for upload progress
 * @returns Upload result
 */
export const uploadImageToFirebaseStorage = async (
  file: File,
  folder: string = 'tn-forest/images',
  onProgress?: (progress: UploadProgress) => void
): Promise<FirebaseUploadResult> => {
  // Check image size after compression
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      success: false,
      error: `Image size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of 10MB after compression.`,
    };
  }
  
  return uploadToFirebaseStorage(file, folder, onProgress);
};

/**
 * Upload a PDF file to Firebase Storage (no size limit)
 * 
 * @param file - The PDF file to upload
 * @param folder - The folder path in storage
 * @param onProgress - Optional callback for upload progress
 * @returns Upload result
 */
export const uploadPdfToFirebaseStorage = async (
  file: File,
  folder: string = 'tn-forest/documents',
  onProgress?: (progress: UploadProgress) => void
): Promise<FirebaseUploadResult> => {
  return uploadToFirebaseStorage(file, folder, onProgress);
};

/**
 * Delete a file from Firebase Storage
 * 
 * @param storagePath - The full path in storage (e.g., 'tn-forest/images/file.jpg')
 *                      OR a download URL from which the path will be extracted
 * @returns Delete result
 */
export const deleteFromFirebaseStorage = async (
  storagePathOrUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    let storagePath = storagePathOrUrl;
    
    // If it's a URL, extract the path
    if (storagePathOrUrl.startsWith('http')) {
      const extractedPath = extractFirebaseStoragePath(storagePathOrUrl);
      if (!extractedPath) {
        return {
          success: false,
          error: 'Could not extract storage path from URL.',
        };
      }
      storagePath = extractedPath;
    }
    
    // Create reference and delete
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    return { success: true };
  } catch (error: any) {
    console.error('Firebase Storage delete error:', error);
    
    // If file doesn't exist, consider it a success (already deleted)
    if (error.code === 'storage/object-not-found') {
      return { success: true };
    }
    
    let errorMessage = 'Failed to delete file.';
    switch (error.code) {
      case 'storage/unauthorized':
        errorMessage = 'Permission denied. Please ensure you are logged in as admin.';
        break;
      default:
        errorMessage = error.message || 'Failed to delete file.';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Delete a file from the appropriate storage provider based on URL
 * Automatically detects if URL is from Cloudinary or Firebase Storage
 * 
 * @param url - The file URL
 * @param publicId - Optional Cloudinary public ID (required for Cloudinary URLs if not extractable)
 * @returns Delete result
 */
export const deleteFileFromStorage = async (
  url: string,
  publicId?: string
): Promise<{ success: boolean; error?: string }> => {
  // Handle Firebase Storage URLs
  if (isFirebaseStorageUrl(url)) {
    return deleteFromFirebaseStorage(url);
  }
  
  // Handle Cloudinary URLs
  if (isCloudinaryUrl(url)) {
    if (!publicId) {
      return {
        success: false,
        error: 'Public ID required for Cloudinary deletion.',
      };
    }
    return deleteImageFromCloudinary(publicId);
  }
  
  // Unknown storage provider
  return {
    success: false,
    error: 'Unknown storage provider. Cannot delete file.',
  };
};
