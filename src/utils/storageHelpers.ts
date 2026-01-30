/**
 * Storage Helpers
 * 
 * Utility functions for handling file URLs from different storage providers
 * (Cloudinary and Firebase Storage)
 */

/**
 * Check if a URL is from Cloudinary
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
};

/**
 * Check if a URL is from Firebase Storage
 */
export const isFirebaseStorageUrl = (url: string): boolean => {
  return url.includes('firebasestorage.googleapis.com') || 
         url.includes('storage.googleapis.com');
};

/**
 * Detect the storage provider from a URL
 */
export const getStorageProvider = (url: string): 'cloudinary' | 'firebase' | 'unknown' => {
  if (isCloudinaryUrl(url)) return 'cloudinary';
  if (isFirebaseStorageUrl(url)) return 'firebase';
  return 'unknown';
};

/**
 * Extract the file path from a Firebase Storage URL
 * This is needed for deletion operations
 * 
 * Firebase Storage URLs look like:
 * https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[encoded-path]?alt=media&token=[token]
 */
export const extractFirebaseStoragePath = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    
    // Handle firebasestorage.googleapis.com URLs
    if (urlObj.hostname === 'firebasestorage.googleapis.com') {
      const pathMatch = urlObj.pathname.match(/\/v0\/b\/[^/]+\/o\/(.+)/);
      if (pathMatch) {
        // Decode the URL-encoded path
        return decodeURIComponent(pathMatch[1]);
      }
    }
    
    // Handle storage.googleapis.com URLs
    if (urlObj.hostname === 'storage.googleapis.com') {
      const pathMatch = urlObj.pathname.match(/\/[^/]+\/(.+)/);
      if (pathMatch) {
        return decodeURIComponent(pathMatch[1]);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to extract Firebase Storage path:', error);
    return null;
  }
};

/**
 * Extract Cloudinary public ID from a URL
 * 
 * Cloudinary URLs look like:
 * https://res.cloudinary.com/[cloud-name]/image/upload/[transformations]/[folder]/[public-id].[extension]
 * or
 * https://res.cloudinary.com/[cloud-name]/raw/upload/[folder]/[public-id].[extension]
 */
export const extractCloudinaryPublicId = (url: string): string | null => {
  try {
    // Match the path after /upload/ and remove the file extension
    const match = url.match(/\/(?:image|raw|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (match) {
      return match[1];
    }
    return null;
  } catch (error) {
    console.error('Failed to extract Cloudinary public ID:', error);
    return null;
  }
};

/**
 * Generate a unique filename with timestamp and random string
 * Sanitizes the original filename to prevent path traversal attacks
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  // Extract the file extension
  const lastDot = originalFilename.lastIndexOf('.');
  const extension = lastDot !== -1 ? originalFilename.slice(lastDot) : '';
  const nameWithoutExt = lastDot !== -1 ? originalFilename.slice(0, lastDot) : originalFilename;
  
  // Sanitize the filename: remove special characters, spaces, and path separators
  const sanitizedName = nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, '_')  // Replace special chars with underscore
    .replace(/_{2,}/g, '_')            // Replace multiple underscores with single
    .replace(/^_|_$/g, '')             // Remove leading/trailing underscores
    .slice(0, 50);                     // Limit length
  
  // Generate timestamp and random string
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  
  return `${sanitizedName}_${timestamp}_${randomStr}${extension.toLowerCase()}`;
};

/**
 * Get the appropriate folder path for different content types
 */
export const getStorageFolder = (
  contentType: 'images' | 'pdfs' | 'gallery' | 'slider' | 'publications' | 'experiments' | 'products',
  subFolder?: string
): string => {
  const baseFolders: Record<string, string> = {
    images: 'tn-forest/images',
    pdfs: 'tn-forest/documents',
    gallery: 'tn-forest/gallery',
    slider: 'tn-forest/slider',
    publications: 'tn-forest/publications',
    experiments: 'tn-forest/documents/experiments',
    products: 'tn-forest/products',
  };
  
  const baseFolder = baseFolders[contentType] || 'tn-forest/uploads';
  return subFolder ? `${baseFolder}/${subFolder}` : baseFolder;
};

/**
 * Check if a file type is allowed for upload
 */
export const isAllowedFileType = (
  file: File,
  allowedTypes: 'images' | 'pdfs' | 'both'
): boolean => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const pdfTypes = ['application/pdf'];
  
  switch (allowedTypes) {
    case 'images':
      return imageTypes.includes(file.type);
    case 'pdfs':
      return pdfTypes.includes(file.type);
    case 'both':
      return imageTypes.includes(file.type) || pdfTypes.includes(file.type);
    default:
      return false;
  }
};

/**
 * Format bytes to human-readable size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
