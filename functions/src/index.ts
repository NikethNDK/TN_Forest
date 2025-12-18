/**
 * Firebase Cloud Functions
 * 
 * This file contains server-side functions for secure operations,
 * including Cloudinary upload signature generation.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
admin.initializeApp();

// Configure Cloudinary
// In production: uses functions.config() (set via firebase functions:config:set)
// In emulator: can use .runtimeconfig.json or environment variables
function getCloudinaryConfig() {
  let config: any = null;
  
  // Try functions.config() first (works in production and emulator if .runtimeconfig.json is loaded)
  try {
    const functionsConfig = functions.config();
    config = functionsConfig?.cloudinary;
    if (config?.api_secret) {
      return config;
    }
  } catch (error: any) {
    // Config not available, try fallback
  }

  // Fallback 1: Try reading .runtimeconfig.json directly (for emulator)
  const possiblePaths = [
    path.join(__dirname, '../.runtimeconfig.json'),
    path.join(process.cwd(), '.runtimeconfig.json'),
    path.join(process.cwd(), 'functions/.runtimeconfig.json'),
  ];
  
  for (const runtimeConfigPath of possiblePaths) {
    try {
      if (fs.existsSync(runtimeConfigPath)) {
        const runtimeConfig = JSON.parse(fs.readFileSync(runtimeConfigPath, 'utf8'));
        if (runtimeConfig?.cloudinary?.api_secret) {
          return runtimeConfig.cloudinary;
        }
      }
    } catch (error: any) {
      // Silently try next path
    }
  }

  // Fallback 2: Try environment variables (for emulator/local dev)
  const envConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  };
  
  if (envConfig.api_secret) {
    return envConfig;
  }

  return null;
}

const cloudinaryConfig = getCloudinaryConfig();

if (cloudinaryConfig?.api_secret) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret,
  });
} else {
  console.warn('Cloudinary configuration not found. Upload signatures will fail.');
}

/**
 * Interface for upload signature request
 */
interface UploadSignatureRequest {
  fileType: string;
  fileSize: number;
  folder?: string;
  publicId?: string;
}

/**
 * Interface for upload signature response
 */
interface UploadSignatureResponse {
  signature: string;
  timestamp: number;
  folder?: string;
  publicId?: string;
}

/**
 * Validates file type and size
 */
function validateFile(fileType: string, fileSize: number): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ALLOWED_PDF_TYPES = ['application/pdf'];
  const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES];

  if (!ALLOWED_TYPES.includes(fileType)) {
    return {
      valid: false,
      error: 'Invalid file type. Only images (JPG, PNG, WebP) and PDFs are allowed.',
    };
  }

  if (fileSize > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Verifies that the user is authenticated and is an admin
 */
async function verifyAdmin(uid: string): Promise<void> {
  try {
    // Check Firestore for admin status (matches frontend checkAdminStatus logic)
    const adminDoc = await admin.firestore().collection('admins').doc(uid).get();
    
    if (!adminDoc.exists || adminDoc.data()?.role !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Admin access required. You do not have permission to upload files.'
      );
    }
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      'permission-denied',
      'Failed to verify admin status.'
    );
  }
}

/**
 * Cloud Function: Generate Cloudinary Upload Signature
 * 
 * This function generates a secure signature for uploading files to Cloudinary.
 * It verifies the user is authenticated and is an admin before generating the signature.
 * 
 * @param data - Upload request data (fileType, fileSize, folder, publicId)
 * @param context - Firebase Functions context (contains auth info)
 * @returns Upload signature and timestamp
 */
export const generateUploadSignature = functions.https.onCall(
  async (data: UploadSignatureRequest, context): Promise<UploadSignatureResponse> => {
    // Verify authentication - onCall functions automatically verify Firebase Auth
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required. Please log in.'
      );
    }

    // Verify admin status
    await verifyAdmin(context.auth.uid);

    // Validate request data
    if (!data.fileType || !data.fileSize) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: fileType and fileSize are required.'
      );
    }

    // Validate file
    const validation = validateFile(data.fileType, data.fileSize);
    if (!validation.valid) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        validation.error || 'File validation failed. Please check file type and size.'
      );
    }

    // Check Cloudinary configuration
    if (!cloudinaryConfig?.api_secret) {
      // Try to reload config at runtime (in case it wasn't loaded at module init)
      const runtimeConfig = getCloudinaryConfig();
      if (runtimeConfig?.api_secret) {
        cloudinary.config({
          cloud_name: runtimeConfig.cloud_name,
          api_key: runtimeConfig.api_key,
          api_secret: runtimeConfig.api_secret,
        });
      } else {
        throw new functions.https.HttpsError(
          'internal',
          'Cloudinary configuration is missing. Please contact the administrator.'
        );
      }
    }

    try {
      // Generate timestamp (required for signature)
      const timestamp = Math.round(Date.now() / 1000);

      // Prepare parameters for signature generation
      const params: Record<string, any> = {
        timestamp,
      };

      // Add folder if provided
      if (data.folder) {
        params.folder = data.folder;
      }

      // Add public_id if provided (for overwriting existing files)
      if (data.publicId) {
        params.public_id = data.publicId;
      }

      // Generate signature using Cloudinary SDK
      const signature = cloudinary.utils.api_sign_request(
        params,
        cloudinaryConfig.api_secret
      );

      return {
        signature,
        timestamp,
        folder: data.folder,
        publicId: data.publicId,
      };
    } catch (error) {
      console.error('Error generating upload signature:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to generate upload signature. Please try again.'
      );
    }
  }
);

/**
 * Interface for delete image request
 */
interface DeleteImageRequest {
  publicId: string;
}

/**
 * Interface for delete image response
 */
interface DeleteImageResponse {
  success: boolean;
  message?: string;
}

/**
 * Cloud Function: Delete Cloudinary Image
 * 
 * This function deletes an image from Cloudinary.
 * It verifies the user is authenticated and is an admin before deleting.
 * 
 * @param data - Delete request data (publicId)
 * @param context - Firebase Functions context (contains auth info)
 * @returns Delete result
 */
export const deleteCloudinaryImage = functions.https.onCall(
  async (data: DeleteImageRequest, context): Promise<DeleteImageResponse> => {
    // Verify authentication - onCall functions automatically verify Firebase Auth
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required. Please log in.'
      );
    }

    // Verify admin status
    await verifyAdmin(context.auth.uid);

    // Validate request data
    if (!data.publicId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required field: publicId is required.'
      );
    }

    // Check Cloudinary configuration
    if (!cloudinaryConfig?.api_secret) {
      throw new functions.https.HttpsError(
        'internal',
        'Cloudinary configuration is missing. Please contact the administrator.'
      );
    }

    try {
      // Delete image from Cloudinary
      const result = await cloudinary.uploader.destroy(data.publicId);
      
      if (result.result === 'ok' || result.result === 'not found') {
        return {
          success: true,
          message: result.result === 'not found' 
            ? 'Image not found in Cloudinary (may have been already deleted)'
            : 'Image deleted successfully'
        };
      } else {
        throw new functions.https.HttpsError(
          'internal',
          `Failed to delete image: ${result.result}`
        );
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to delete image from Cloudinary. Please try again.'
      );
    }
  }
);

