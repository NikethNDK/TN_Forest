/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_API_KEY: string;
  readonly VITE_FIREBASE_FUNCTION_URL?: string;
  /** Backend API base URL for EcoStore/Shop admin (Django TN_Forest_Shop) */
  readonly VITE_SHOP_API_URL?: string;
  /** When "true", Checkout uses Razorpay Standard Checkout instead of manual UPI */
  readonly VITE_RAZORPAY_CHECKOUT_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
