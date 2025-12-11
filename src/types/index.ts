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
  id: number;
  title: string;
  year: number;
  pdfPath?: string;
  description?: string;
  imagePath?: string;
  type?: 'current' | 'completed';
  pdfUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// Research Center type
export interface ResearchCenter {
  id: number;
  name: string;
  location: string;
  area?: string;
  district?: string;
  range?: string;
  description?: string;
  experiments: Experiment[];
  coordinates?: Coordinates;
  phone?: string;
  email?: string;
}

// Division type
export interface Division {
  id: number;
  name: string;
  slug: string;
  description?: string;
  researchCenters?: ResearchCenter[];
}

// Shop Product type
export interface ShopProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  description: string;
  category: string;
  inStock: boolean;
  imageIcon?: string;
  stock?: string | number;
}

// Cart Item type (extends ShopProduct with quantity)
export interface CartItem extends ShopProduct {
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
  id: number;
  title: string;
  year: number;
  category: string;
  journal?: string;
  description?: string;
  pdfUrl?: string;
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
  order: number; // Display order
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

