/**
 * Publications Service
 * 
 * Handles all Firestore operations for publications
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
  Query,
  Timestamp,
  onSnapshot,
  Unsubscribe,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Publication } from '../../types';

const PUBLICATIONS_COLLECTION = 'publications';

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
 * Builds a query for publications with fallback for index issues
 * Tries compound query first, falls back to simple query if index doesn't exist
 */
const buildPublicationsQuery = (publicationsRef: ReturnType<typeof collection>): Query => {
  try {
    // Preferred: compound query ordered by year, then createdAt
    return query(
      publicationsRef,
      orderBy('year', 'desc'),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    // If index doesn't exist, use simple query
    // This can happen during initial setup before composite index is created
    const firestoreError = error as FirestoreError;
    if (firestoreError.code === FIRESTORE_ERROR_CODES.FAILED_PRECONDITION) {
      console.warn(
        'Composite index not found for publications. ' +
        'Using simple query. Create index in Firebase Console if needed.'
      );
      return query(publicationsRef, orderBy('createdAt', 'desc'));
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Type for Firestore document data
 */
interface FirestorePublicationData {
  title?: string;
  year?: number;
  category?: string;
  journal?: string;
  description?: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  createdAt?: any;
  updatedAt?: any;
  order?: number;
}

/**
 * Transforms Firestore document data to Publication type
 */
const transformDocumentToPublication = (
  docId: string,
  data: FirestorePublicationData
): Publication => {
  return {
    id: docId,
    title: data.title || '',
    year: data.year || new Date().getFullYear(),
    category: data.category || '',
    journal: data.journal || undefined,
    description: data.description || undefined,
    pdfUrl: data.pdfUrl || undefined,
    pdfPublicId: data.pdfPublicId || undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    order: data.order
  };
};

/**
 * Sorts publications by year (descending), then by order/createdAt (descending)
 * Used as fallback when simple query is used instead of compound query
 */
const sortPublications = (publications: Publication[]): Publication[] => {
  return [...publications].sort((a, b) => {
    // Primary sort: year descending
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    // Secondary sort: order (if available), then createdAt
    const aOrder = a.order ?? (a.createdAt?.toMillis?.() ?? 0);
    const bOrder = b.order ?? (b.createdAt?.toMillis?.() ?? 0);
    return bOrder - aOrder;
  });
};

/**
 * Checks if an error is a "safe" error that should return empty array
 * (e.g., empty collection, permission issues that are expected)
 * Note: failed-precondition (index errors) are handled separately
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
 * Get all publications, ordered by year descending, then createdAt descending
 * Returns empty array if collection doesn't exist or is empty (not an error)
 */
export const getAllPublications = async (): Promise<Publication[]> => {
  const publicationsRef = collection(db, PUBLICATIONS_COLLECTION);
  
  // Try compound query first
  try {
    const q = buildPublicationsQuery(publicationsRef);
    const querySnapshot = await getDocs(q);
    
    const publications: Publication[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as FirestorePublicationData;
      publications.push(transformDocumentToPublication(docSnapshot.id, data));
    });
    
    // Check if we used compound query by examining query string
    const queryString = q.toString();
    const hasCompoundOrder = queryString.includes('year') && queryString.includes('createdAt');
    
    // If we used simple query (fallback), sort manually
    if (!hasCompoundOrder && publications.length > 0) {
      return sortPublications(publications);
    }
    
    return publications;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    
    // Handle index error by retrying with simple query
    if (firestoreError.code === FIRESTORE_ERROR_CODES.FAILED_PRECONDITION) {
      console.warn(
        'Composite index not found for publications. ' +
        'Using simple query. Create index in Firebase Console for better performance.'
      );
      
      try {
        // Retry with simple query
        const simpleQuery = query(publicationsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(simpleQuery);
        
        const publications: Publication[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          publications.push(transformDocumentToPublication(docSnapshot.id, data));
        });
        
        // Sort manually by year, then createdAt
        return sortPublications(publications);
      } catch (fallbackError) {
        const fallbackFirestoreError = fallbackError as FirestoreError;
        console.error('Error fetching publications with fallback query:', {
          code: fallbackFirestoreError.code,
          message: fallbackFirestoreError.message
        });
        
        // If fallback also fails with safe error, return empty array
        if (isSafeError(fallbackError)) {
          return [];
        }
        
        throw new Error(`Failed to fetch publications: ${fallbackFirestoreError.message || 'Unknown error'}`);
      }
    }
    
    // Log error for debugging
    console.error('Error fetching publications:', {
      code: firestoreError.code,
      message: firestoreError.message,
      error
    });
    
    // Return empty array for safe errors (empty collection, etc.)
    if (isSafeError(error)) {
      console.info('Publications collection is empty or not accessible. Returning empty array.');
      return [];
    }
    
    // Re-throw unexpected errors
    throw new Error(`Failed to fetch publications: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Get a single publication by ID
 */
export const getPublicationById = async (id: string): Promise<Publication | null> => {
  try {
    const publicationRef = doc(db, PUBLICATIONS_COLLECTION, id);
    const docSnapshot = await getDoc(publicationRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data() as FirestorePublicationData;
    return transformDocumentToPublication(docSnapshot.id, data);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error fetching publication:', {
      id,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    // Return null for not found, throw for other errors
    if (firestoreError.code === FIRESTORE_ERROR_CODES.NOT_FOUND) {
      return null;
    }
    
    throw new Error(`Failed to fetch publication: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Add a new publication
 */
export const addPublication = async (
  publication: Omit<Publication, 'id' | 'createdAt' | 'updatedAt' | 'order'>
): Promise<string> => {
  try {
    const publicationsRef = collection(db, PUBLICATIONS_COLLECTION);
    const newPublication = {
      title: publication.title.trim(),
      year: publication.year,
      category: publication.category.trim(),
      journal: publication.journal?.trim() || '',
      description: publication.description?.trim() || '',
      pdfUrl: publication.pdfUrl?.trim() || '',
      pdfPublicId: publication.pdfPublicId?.trim() || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      order: Date.now() // Use timestamp for ordering
    };
    
    const docRef = await addDoc(publicationsRef, newPublication);
    return docRef.id;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error adding publication:', {
      code: firestoreError.code,
      message: firestoreError.message,
      publication: publication.title
    });
    throw new Error(`Failed to add publication: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Update a publication
 */
export const updatePublication = async (
  id: string,
  updates: Partial<Pick<Publication, 'title' | 'year' | 'category' | 'journal' | 'description' | 'pdfUrl' | 'pdfPublicId'>>
): Promise<void> => {
  try {
    const publicationRef = doc(db, PUBLICATIONS_COLLECTION, id);
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now()
    };
    
    if (updates.title !== undefined) {
      updateData.title = updates.title.trim();
    }
    if (updates.year !== undefined) {
      updateData.year = updates.year;
    }
    if (updates.category !== undefined) {
      updateData.category = updates.category.trim();
    }
    if (updates.journal !== undefined) {
      updateData.journal = updates.journal.trim() || '';
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description.trim() || '';
    }
    if (updates.pdfUrl !== undefined) {
      updateData.pdfUrl = updates.pdfUrl.trim() || '';
    }
    if (updates.pdfPublicId !== undefined) {
      updateData.pdfPublicId = updates.pdfPublicId.trim() || '';
    }
    
    await updateDoc(publicationRef, updateData);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error updating publication:', {
      id,
      code: firestoreError.code,
      message: firestoreError.message
    });
    throw new Error(`Failed to update publication: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Delete a publication
 */
export const deletePublication = async (id: string): Promise<void> => {
  try {
    const publicationRef = doc(db, PUBLICATIONS_COLLECTION, id);
    await deleteDoc(publicationRef);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error deleting publication:', {
      id,
      code: firestoreError.code,
      message: firestoreError.message
    });
    throw new Error(`Failed to delete publication: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Subscribe to real-time updates of publications
 * Returns an unsubscribe function
 * 
 * @param callback - Function called with publications array on updates
 * @param onError - Optional error handler (only called for unexpected errors)
 * @returns Unsubscribe function
 */
export const subscribeToPublications = (
  callback: (publications: Publication[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  let unsubscribe: Unsubscribe | null = null;
  let useSimpleQuery = false;

  const setupSubscription = (useFallback = false) => {
    try {
      const publicationsRef = collection(db, PUBLICATIONS_COLLECTION);
      
      // Build query - use simple query if fallback is requested
      let q: Query;
      if (useFallback) {
        q = query(publicationsRef, orderBy('createdAt', 'desc'));
        useSimpleQuery = true;
      } else {
        try {
          q = buildPublicationsQuery(publicationsRef);
          // Check if query string indicates compound query
          const queryString = q.toString();
          useSimpleQuery = !(queryString.includes('year') && queryString.includes('createdAt'));
        } catch (queryError) {
          // If query building fails, use fallback
          console.warn('Failed to build compound query, using fallback');
          q = query(publicationsRef, orderBy('createdAt', 'desc'));
          useSimpleQuery = true;
        }
      }
      
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const publications: Publication[] = [];
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            publications.push(transformDocumentToPublication(docSnapshot.id, data));
          });
          
          // If we used a simple query, sort manually
          const sortedPublications = useSimpleQuery && publications.length > 0
            ? sortPublications(publications)
            : publications;
          
          callback(sortedPublications);
        },
        (error) => {
          const firestoreError = error as FirestoreError;
          
          // Handle index error by retrying with simple query
          if (firestoreError.code === FIRESTORE_ERROR_CODES.FAILED_PRECONDITION && !useFallback) {
            console.warn(
              'Composite index not found. Retrying with simple query. ' +
              'Create the index in Firebase Console for better performance.'
            );
            // Unsubscribe from current query and retry with simple query
            if (unsubscribe) {
              unsubscribe();
            }
            setupSubscription(true); // Retry with fallback
            return;
          }
          
          console.error('Error in publications subscription:', {
            code: firestoreError.code,
            message: firestoreError.message
          });
          
          // For safe errors (empty collection, etc.), return empty array
          if (isSafeError(error)) {
            console.info('Publications subscription: collection is empty or not accessible. Returning empty array.');
            callback([]);
            return;
          }
          
          // Only call onError for unexpected errors
          if (onError) {
            onError(new Error(`Failed to subscribe to publications: ${firestoreError.message || 'Unknown error'}`));
          }
        }
      );
      
      return unsubscribe;
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error('Error setting up publications subscription:', {
        code: firestoreError.code,
        message: firestoreError.message
      });
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(`Failed to set up subscription: ${firestoreError.message || 'Unknown error'}`));
      }
      
      // Return a no-op unsubscribe function
      return () => {};
    }
  };

  // Start with compound query, will fallback if needed
  unsubscribe = setupSubscription(false);
  
  // Return unsubscribe function
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

