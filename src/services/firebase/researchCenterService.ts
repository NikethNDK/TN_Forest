/**
 * Research Center Service
 * 
 * Handles all Firestore operations for research centers
 * Research centers are stored as subcollections under divisions
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
  Unsubscribe,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { ResearchCenter, Coordinates, CustomField } from '../../types';

const DIVISIONS_COLLECTION = 'divisions';
const RESEARCH_CENTERS_SUBCOLLECTION = 'researchCenters';

/**
 * Firestore error codes
 */
const FIRESTORE_ERROR_CODES = {
  NOT_FOUND: 'not-found',
  PERMISSION_DENIED: 'permission-denied',
  FAILED_PRECONDITION: 'failed-precondition',
  UNAVAILABLE: 'unavailable'
} as const;

/**
 * Type for Firestore document data
 */
interface FirestoreResearchCenterData {
  name?: string;
  location?: string;
  description?: string;
  coordinates?: Coordinates;
  area?: string; // Legacy field, kept for backward compatibility
  district?: string; // Legacy field, kept for backward compatibility
  range?: string; // Legacy field, kept for backward compatibility
  phone?: string;
  email?: string;
  imageUrl?: string;
  imagePublicId?: string;
  customFields?: CustomField[]; // Array of custom key-value fields
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Transforms Firestore document data to ResearchCenter type
 */
const transformDocumentToResearchCenter = (
  docId: string,
  data: FirestoreResearchCenterData
): ResearchCenter => {
  return {
    id: docId,
    name: data.name || '',
    location: data.location || '',
    description: data.description || undefined,
    coordinates: data.coordinates || undefined,
    area: data.area || undefined, // Legacy field, kept for backward compatibility
    district: data.district || undefined, // Legacy field, kept for backward compatibility
    range: data.range || undefined, // Legacy field, kept for backward compatibility
    phone: data.phone || undefined,
    email: data.email || undefined,
    imageUrl: data.imageUrl || undefined,
    imagePublicId: data.imagePublicId || undefined,
    customFields: data.customFields || undefined, // Array of custom fields
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    experiments: [] // Experiments are in a separate subcollection
  };
};

/**
 * Checks if an error is a "safe" error that should return empty array
 */
const isSafeError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const firestoreError = error as FirestoreError;
  return (
    firestoreError.code === FIRESTORE_ERROR_CODES.NOT_FOUND ||
    firestoreError.code === FIRESTORE_ERROR_CODES.PERMISSION_DENIED
  );
};

/**
 * Get all research centers for a division
 */
export const getResearchCenters = async (divisionId: string): Promise<ResearchCenter[]> => {
  try {
    const centersRef = collection(db, DIVISIONS_COLLECTION, divisionId, RESEARCH_CENTERS_SUBCOLLECTION);
    const q = query(centersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const centers: ResearchCenter[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as FirestoreResearchCenterData;
      centers.push(transformDocumentToResearchCenter(docSnapshot.id, data));
    });
    
    return centers;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error fetching research centers:', {
      divisionId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (isSafeError(error)) {
      return [];
    }
    
    throw new Error(`Failed to fetch research centers: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Get a single research center by ID
 */
export const getResearchCenter = async (
  divisionId: string,
  centerId: string
): Promise<ResearchCenter | null> => {
  try {
    const centerRef = doc(db, DIVISIONS_COLLECTION, divisionId, RESEARCH_CENTERS_SUBCOLLECTION, centerId);
    const docSnapshot = await getDoc(centerRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data() as FirestoreResearchCenterData;
    return transformDocumentToResearchCenter(docSnapshot.id, data);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error fetching research center:', {
      divisionId,
      centerId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (firestoreError.code === FIRESTORE_ERROR_CODES.NOT_FOUND) {
      return null;
    }
    
    throw new Error(`Failed to fetch research center: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Add a new research center
 */
export const addResearchCenter = async (
  divisionId: string,
  center: Omit<ResearchCenter, 'id' | 'createdAt' | 'updatedAt' | 'experiments'>
): Promise<string> => {
  try {
    const centersRef = collection(db, DIVISIONS_COLLECTION, divisionId, RESEARCH_CENTERS_SUBCOLLECTION);
    const newCenter: Record<string, unknown> = {
      name: center.name.trim(),
      location: center.location.trim(),
      description: center.description?.trim() || '',
      coordinates: center.coordinates || null,
      area: center.area?.trim() || '',
      district: center.district?.trim() || '',
      range: center.range?.trim() || '',
      phone: center.phone?.trim() || '',
      email: center.email?.trim() || '',
      imageUrl: center.imageUrl?.trim() || '',
      imagePublicId: center.imagePublicId?.trim() || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add customFields if they exist
    if (center.customFields && center.customFields.length > 0) {
      newCenter.customFields = center.customFields;
    }
    
    const docRef = await addDoc(centersRef, newCenter);
    return docRef.id;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error adding research center:', {
      divisionId,
      code: firestoreError.code,
      message: firestoreError.message,
      center: center.name
    });
    throw new Error(`Failed to add research center: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Update a research center
 */
export const updateResearchCenter = async (
  divisionId: string,
  centerId: string,
  updates: Partial<Omit<ResearchCenter, 'id' | 'createdAt' | 'updatedAt' | 'experiments'>>
): Promise<void> => {
  try {
    const centerRef = doc(db, DIVISIONS_COLLECTION, divisionId, RESEARCH_CENTERS_SUBCOLLECTION, centerId);
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now()
    };
    
    if (updates.name !== undefined) {
      updateData.name = updates.name.trim();
    }
    if (updates.location !== undefined) {
      updateData.location = updates.location.trim();
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description.trim() || '';
    }
    if (updates.coordinates !== undefined) {
      updateData.coordinates = updates.coordinates || null;
    }
    if (updates.area !== undefined) {
      updateData.area = updates.area.trim() || '';
    }
    if (updates.district !== undefined) {
      updateData.district = updates.district.trim() || '';
    }
    if (updates.range !== undefined) {
      updateData.range = updates.range.trim() || '';
    }
    if (updates.phone !== undefined) {
      updateData.phone = updates.phone.trim() || '';
    }
    if (updates.email !== undefined) {
      updateData.email = updates.email.trim() || '';
    }
    if (updates.imageUrl !== undefined) {
      updateData.imageUrl = updates.imageUrl.trim() || '';
    }
    if (updates.imagePublicId !== undefined) {
      updateData.imagePublicId = updates.imagePublicId.trim() || '';
    }
    if (updates.customFields !== undefined) {
      // Store customFields array, or set to empty array if none provided
      updateData.customFields = updates.customFields.length > 0 ? updates.customFields : [];
    }
    
    await updateDoc(centerRef, updateData);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error updating research center:', {
      divisionId,
      centerId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    throw new Error(`Failed to update research center: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Delete a research center
 * Automatically detects storage provider from image URL and deletes accordingly
 */
export const deleteResearchCenter = async (
  divisionId: string,
  centerId: string,
  imagePublicId?: string,
  imageUrl?: string
): Promise<void> => {
  try {
    const centerRef = doc(db, DIVISIONS_COLLECTION, divisionId, RESEARCH_CENTERS_SUBCOLLECTION, centerId);
    
    // Get center to get URL if not provided
    let imageUrlToDelete = imageUrl;
    if (!imageUrlToDelete && imagePublicId) {
      const center = await getResearchCenter(divisionId, centerId);
      imageUrlToDelete = center?.imageUrl;
    }
    
    // Delete image from storage if URL is available
    if (imageUrlToDelete) {
      try {
        const { deleteFileFromStorage } = await import('./storageService');
        await deleteFileFromStorage(imageUrlToDelete, imagePublicId);
      } catch (imageError) {
        console.warn('Failed to delete image from storage:', imageError);
        // Continue with document deletion even if image deletion fails
      }
    }
    
    await deleteDoc(centerRef);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error deleting research center:', {
      divisionId,
      centerId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    throw new Error(`Failed to delete research center: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Subscribe to real-time updates of research centers for a division
 * Returns an unsubscribe function
 */
export const subscribeToResearchCenters = (
  divisionId: string,
  callback: (centers: ResearchCenter[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const centersRef = collection(db, DIVISIONS_COLLECTION, divisionId, RESEARCH_CENTERS_SUBCOLLECTION);
    const q = query(centersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const centers: ResearchCenter[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data() as FirestoreResearchCenterData;
          centers.push(transformDocumentToResearchCenter(docSnapshot.id, data));
        });
        
        callback(centers);
      },
      (error) => {
        const firestoreError = error as FirestoreError;
        console.error('Error in research centers subscription:', {
          divisionId,
          code: firestoreError.code,
          message: firestoreError.message
        });
        
        if (isSafeError(error)) {
          console.info('Research centers subscription: collection is empty or not accessible. Returning empty array.');
          callback([]);
          return;
        }
        
        if (onError) {
          onError(new Error(`Failed to subscribe to research centers: ${firestoreError.message || 'Unknown error'}`));
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error setting up research centers subscription:', {
      divisionId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (onError) {
      onError(error instanceof Error ? error : new Error(`Failed to set up subscription: ${firestoreError.message || 'Unknown error'}`));
    }
    
    return () => {};
  }
};

