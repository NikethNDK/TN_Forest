/**
 * Type Definitions
 * 
 * This file contains all shared TypeScript interfaces and types
 * used throughout the application.
 */

// Coordinates type
export interface Coordinates {
  lat: number;
  lng: number;
}

// Experiment type
export interface Experiment {
  id?: string | number; // Firestore document ID (string) or legacy numeric ID
  title: string;
  year: number;
  pdfPath?: string; // Legacy field, use pdfUrl instead
  description?: string;
  imagePath?: string; // Legacy field, use imageUrl instead
  type?: 'current' | 'completed';
  pdfUrl?: string;
  pdfPublicId?: string; // Cloudinary public ID for deletion
  imageUrl?: string;
  imagePublicId?: string; // Cloudinary public ID for deletion
  startDate?: string;
  endDate?: string;
  status?: string;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Research Center type
// Custom Field type for research centers
export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface ResearchCenter {
  id?: string | number; // Firestore document ID (string) or legacy numeric ID
  name: string;
  location?: string;
  area?: string; // Deprecated: use customFields instead, kept for backward compatibility
  district?: string; // Deprecated: use customFields instead, kept for backward compatibility
  range?: string; // Deprecated: use customFields instead, kept for backward compatibility
  description?: string;
  experiments?: Experiment[]; // Optional, may be in subcollection
  coordinates?: Coordinates;
  phone?: string;
  email?: string;
  imageUrl?: string;
  imagePublicId?: string; // Cloudinary public ID for deletion
  customFields?: CustomField[]; // Array of custom key-value fields
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Division type
export interface Division {
  id?: string | number; // Firestore document ID (string) or legacy numeric ID
  name: string;
  slug: string;
  description?: string;
  researchCenters?: ResearchCenter[]; // Optional, may be in subcollection
  tollFreeNumber?: string;
  contentBlocks?: Array<{ id: string; heading: string; text: string; image?: string }>;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Shop Product type
export interface ShopProduct {
  id?: string; // Firestore document ID
  name: string;
  description: string;
  price: number;
  category: 'Seeds' | 'Bio Fertilizers';
  stock: number; // Quantity available (0 = out of stock)
  unit: string; // "packets", "kg", "liters", etc.
  imageUrl?: string; // Cloudinary URL
  imagePublicId?: string; // Cloudinary public ID for deletion
  imageIcon?: string; // Emoji fallback
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Cart Item type (extends ShopProduct with quantity)
export interface CartItem extends ShopProduct {
  id: string; // Required for cart items (Firestore document ID)
  quantity: number;
}

// Contact Form type
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API Response types (placeholders for future backend integration)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Contact Info type
export interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string[];
  type: 'address' | 'phone' | 'email';
}

// Research Center Contact type (for backward compatibility)
export interface ResearchCenterContact {
  name: string;
  location: string;
  phone: string;
  email: string;
}

// Contact Location type
export interface ContactLocation {
  id: string;  // Firestore document ID
  name: string;
  location: string;
  phone?: string;
  email?: string;
  showInFooter: boolean;
  order: number;
  createdAt?: any;  // Firestore Timestamp
  updatedAt?: any;  // Firestore Timestamp
}

// News Item type
export interface NewsItem {
  id?: string;  // Firestore document ID
  date: string;
  title: string;
  excerpt: string;
  link?: string;  // Optional link/URL
  createdAt?: any;  // Firestore Timestamp
  updatedAt?: any;  // Firestore Timestamp
  order?: number;  // For sorting
}

// Event type
export interface Event {
  id?: string;  // Firestore document ID
  date: string;
  title: string;
  excerpt: string;
  link?: string;  // Optional link/URL
  createdAt?: any;  // Firestore Timestamp
  updatedAt?: any;  // Firestore Timestamp
  order?: number;  // For sorting
}

// Image Carousel Item type
export interface ImageCarouselItem {
  url: string;
  caption: string;
}

// Important Link type
export interface ImportantLink {
  title: string;
  url: string;
  icon: string;
}

// Faculty Member type
export interface FacultyMember {
  id: string;  // Firestore document ID
  name: string;
  position: string;
  order: number;
  imageUrl?: string;  // Optional Cloudinary URL
  imagePublicId?: string;  // Optional Cloudinary public ID for deletion
  createdAt?: any;  // Firestore Timestamp
  updatedAt?: any;  // Firestore Timestamp
}

// Mission Vision type
export interface MissionVision {
  mission: string;
  vision: string;
  updatedAt?: any;  // Firestore Timestamp
  updatedBy?: string;
}

// Publication type
export interface Publication {
  id?: string; // Firestore document ID
  title: string;
  year: number;
  category: string;
  journal?: string;
  description?: string;
  pdfUrl?: string;
  pdfPublicId?: string; // Cloudinary public ID for deletion
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  order?: number; // For sorting
}

// Slider Image type
export interface SliderImage {
  id?: string; // Firestore document ID
  url: string; // Cloudinary secure URL
  publicId: string; // Cloudinary public ID for deletion
  order: number; // Display order
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Gallery Image type
export interface GalleryImage {
  id?: string; // Firestore document ID
  url: string; // Cloudinary secure URL
  publicId: string; // Cloudinary public ID for deletion
  title?: string; // Optional title/caption for the image
  order: number; // Display order
  scope?: 'global' | 'division'; // Scope of the image: global or division-specific
  divisionSlug?: string; // Division slug if scope is 'division'
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Pickup Location type for Shop
export interface PickupLocation {
  name: string;
  address: string;
  distance: string;
}

// Fertilizer Order Form type
export interface FertilizerOrderFormData {
  name: string;
  email: string;
  phone: string;
  selectedFertilizer: string;
  quantity: string;
  transportation: string;
  address: string;
}

// Checkout Delivery Details type
export interface CheckoutDeliveryDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

// Checkout Order type (for storing in Firebase)
export interface CheckoutOrder {
  id?: string;
  items: CartItem[];
  totalAmount: number;
  deliveryDetails: CheckoutDeliveryDetails;
  transactionId: string;
  status: 'pending' | 'accepted' | 'declined' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: any;
  updatedAt?: any;
}
