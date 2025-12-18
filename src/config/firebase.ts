import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Validate that all required environment variables are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    'Missing Firebase configuration. Please check your .env file.\n' +
    'Required variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.'
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
// Explicitly set region for Functions to match emulator
export const functions = getFunctions(app, 'us-central1');

// Connect to emulators in development mode
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

if (isDevelopment && useEmulator) {
  // Connect to Functions Emulator only (required for Cloudinary uploads)
  // Note: Auth and Firestore will use production, which is fine for this use case
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error: any) {
    // Emulators already connected - this is fine
    if (!error?.message?.includes('already been initialized')) {
      console.warn('Firebase Emulator connection:', error);
    }
  }
}

// Cloud Function reference for generating upload signatures
export const generateUploadSignature = httpsCallable<{
  fileType: string;
  fileSize: number;
  folder?: string;
  publicId?: string;
}, {
  signature: string;
  timestamp: number;
  folder?: string;
  publicId?: string;
}>(functions, 'generateUploadSignature');

// Cloud Function reference for deleting images
export const deleteCloudinaryImage = httpsCallable<{
  publicId: string;
}, {
  success: boolean;
  message?: string;
}>(functions, 'deleteCloudinaryImage');

export default app;