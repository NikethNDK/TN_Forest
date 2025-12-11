/**
 * Cloudinary Configuration
 * 
 * This file contains the Cloudinary configuration for client-side uploads.
 * The API secret is NOT stored here - it's handled by Firebase Cloud Functions.
 */

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY as string,
  // API Secret is handled server-side via Firebase Cloud Functions
};

// Validate configuration
if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey) {
  console.warn(
    'Cloudinary configuration is incomplete. Please check your .env file.\n' +
    'Required variables: VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY'
  );
}

// Cloudinary upload endpoint
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

// Firebase Cloud Function endpoint for generating signatures
// This will be set after deploying the function
export const FIREBASE_FUNCTION_URL = import.meta.env.VITE_FIREBASE_FUNCTION_URL || 
  `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/generateUploadSignature`;

export default cloudinaryConfig;

