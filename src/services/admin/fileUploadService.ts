/**
 * File Upload Service
 * 
 * Handles file uploads to the public directory.
 * In a production environment, this would upload to a cloud storage service.
 */

export interface UploadResult {
  success: boolean;
  path?: string;
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

export const uploadImageFile = async (file: File, directory: string = 'images'): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // In a real application, this would upload to a server/cloud storage
    // For now, we'll create a local file path reference
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `/${directory}/${fileName}`;
    
    // Create a FileReader to get the file as a data URL for preview
    // In production, you would send this to your backend API
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    return {
      success: true,
      path: filePath
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
};

export const uploadPDFFile = async (file: File, directory: string = 'publications'): Promise<UploadResult> => {
  const validation = validatePDFFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `/${directory}/${fileName}`;
    
    return {
      success: true,
      path: filePath
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
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

