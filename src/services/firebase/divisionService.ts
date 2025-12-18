/**
 * Division Service
 * 
 * Handles all Firestore operations for divisions
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  onSnapshot,
  Unsubscribe,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Division } from '../../types';

const DIVISIONS_COLLECTION = 'divisions';

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
interface FirestoreDivisionData {
  name?: string;
  slug?: string;
  description?: string;
  tollFreeNumber?: string;
  contentBlocks?: Array<{ id: string; heading: string; text: string; image?: string }>;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Transforms Firestore document data to Division type
 */
const transformDocumentToDivision = (
  docId: string,
  data: FirestoreDivisionData
): Division => {
  return {
    id: docId,
    name: data.name || '',
    slug: data.slug || '',
    description: data.description || undefined,
    tollFreeNumber: data.tollFreeNumber || undefined,
    contentBlocks: data.contentBlocks || undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
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
 * Get all divisions
 */
export const getAllDivisions = async (): Promise<Division[]> => {
  try {
    const divisionsRef = collection(db, DIVISIONS_COLLECTION);
    const querySnapshot = await getDocs(divisionsRef);
    
    const divisions: Division[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as FirestoreDivisionData;
      divisions.push(transformDocumentToDivision(docSnapshot.id, data));
    });
    
    return divisions;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error fetching divisions:', {
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (isSafeError(error)) {
      return [];
    }
    
    throw new Error(`Failed to fetch divisions: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Get a single division by slug
 */
export const getDivision = async (slug: string): Promise<Division | null> => {
  try {
    const divisionsRef = collection(db, DIVISIONS_COLLECTION);
    const q = query(divisionsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const docSnapshot = querySnapshot.docs[0];
    const data = docSnapshot.data() as FirestoreDivisionData;
    return transformDocumentToDivision(docSnapshot.id, data);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error fetching division:', {
      slug,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (firestoreError.code === FIRESTORE_ERROR_CODES.NOT_FOUND) {
      return null;
    }
    
    throw new Error(`Failed to fetch division: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Get a single division by ID
 */
export const getDivisionById = async (id: string): Promise<Division | null> => {
  try {
    const divisionRef = doc(db, DIVISIONS_COLLECTION, id);
    const docSnapshot = await getDoc(divisionRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data() as FirestoreDivisionData;
    return transformDocumentToDivision(docSnapshot.id, data);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error fetching division:', {
      id,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (firestoreError.code === FIRESTORE_ERROR_CODES.NOT_FOUND) {
      return null;
    }
    
    throw new Error(`Failed to fetch division: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Add a new division
 */
export const addDivision = async (
  division: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const divisionsRef = collection(db, DIVISIONS_COLLECTION);
    const newDivision = {
      name: division.name.trim(),
      slug: division.slug.trim(),
      description: division.description?.trim() || '',
      tollFreeNumber: division.tollFreeNumber?.trim() || '',
      contentBlocks: division.contentBlocks || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(divisionsRef, newDivision);
    return docRef.id;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error adding division:', {
      code: firestoreError.code,
      message: firestoreError.message,
      division: division.name
    });
    throw new Error(`Failed to add division: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Update a division
 */
export const updateDivision = async (
  id: string,
  updates: Partial<Pick<Division, 'name' | 'slug' | 'description' | 'tollFreeNumber' | 'contentBlocks'>>
): Promise<void> => {
  try {
    const divisionRef = doc(db, DIVISIONS_COLLECTION, id);
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now()
    };
    
    if (updates.name !== undefined) {
      updateData.name = updates.name.trim();
    }
    if (updates.slug !== undefined) {
      updateData.slug = updates.slug.trim();
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description.trim() || '';
    }
    if (updates.tollFreeNumber !== undefined) {
      updateData.tollFreeNumber = updates.tollFreeNumber.trim() || '';
    }
    if (updates.contentBlocks !== undefined) {
      updateData.contentBlocks = updates.contentBlocks;
    }
    
    await updateDoc(divisionRef, updateData);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error updating division:', {
      id,
      code: firestoreError.code,
      message: firestoreError.message
    });
    throw new Error(`Failed to update division: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Update division description
 */
export const updateDivisionDescription = async (
  id: string,
  description: string
): Promise<void> => {
  await updateDivision(id, { description });
};

/**
 * Update toll-free number
 */
export const updateTollFreeNumber = async (
  id: string,
  number: string
): Promise<void> => {
  await updateDivision(id, { tollFreeNumber: number });
};

/**
 * Update content blocks
 */
export const updateContentBlocks = async (
  id: string,
  blocks: Array<{ id: string; heading: string; text: string; image?: string }>
): Promise<void> => {
  await updateDivision(id, { contentBlocks: blocks });
};

/**
 * Subscribe to real-time updates of divisions
 * Returns an unsubscribe function
 */
export const subscribeToDivisions = (
  callback: (divisions: Division[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const divisionsRef = collection(db, DIVISIONS_COLLECTION);
    
    const unsubscribe = onSnapshot(
      divisionsRef,
      (querySnapshot) => {
        const divisions: Division[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data() as FirestoreDivisionData;
          divisions.push(transformDocumentToDivision(docSnapshot.id, data));
        });
        
        callback(divisions);
      },
      (error) => {
        const firestoreError = error as FirestoreError;
        console.error('Error in divisions subscription:', {
          code: firestoreError.code,
          message: firestoreError.message
        });
        
        if (isSafeError(error)) {
          console.info('Divisions subscription: collection is empty or not accessible. Returning empty array.');
          callback([]);
          return;
        }
        
        if (onError) {
          onError(new Error(`Failed to subscribe to divisions: ${firestoreError.message || 'Unknown error'}`));
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error setting up divisions subscription:', {
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (onError) {
      onError(error instanceof Error ? error : new Error(`Failed to set up subscription: ${firestoreError.message || 'Unknown error'}`));
    }
    
    return () => {};
  }
};

/**
 * Subscribe to real-time updates of a single division by slug
 */
export const subscribeToDivision = (
  slug: string,
  callback: (division: Division | null) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const divisionsRef = collection(db, DIVISIONS_COLLECTION);
    const q = query(divisionsRef, where('slug', '==', slug));
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          callback(null);
          return;
        }
        
        const docSnapshot = querySnapshot.docs[0];
        const data = docSnapshot.data() as FirestoreDivisionData;
        callback(transformDocumentToDivision(docSnapshot.id, data));
      },
      (error) => {
        const firestoreError = error as FirestoreError;
        console.error('Error in division subscription:', {
          slug,
          code: firestoreError.code,
          message: firestoreError.message
        });
        
        if (isSafeError(error)) {
          callback(null);
          return;
        }
        
        if (onError) {
          onError(new Error(`Failed to subscribe to division: ${firestoreError.message || 'Unknown error'}`));
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error setting up division subscription:', {
      slug,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (onError) {
      onError(error instanceof Error ? error : new Error(`Failed to set up subscription: ${firestoreError.message || 'Unknown error'}`));
    }
    
    return () => {};
  }
};

