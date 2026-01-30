/**
 * Experiment Service
 * 
 * Handles all Firestore operations for experiments
 * Experiments are stored as subcollections under research centers
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
import { deleteFileFromStorage } from './storageService';
import type { Experiment } from '../../types';

const DIVISIONS_COLLECTION = 'divisions';
const RESEARCH_CENTERS_SUBCOLLECTION = 'researchCenters';
const EXPERIMENTS_SUBCOLLECTION = 'experiments';

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
interface FirestoreExperimentData {
  title?: string;
  year?: number;
  description?: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  imageUrl?: string;
  imagePublicId?: string;
  pdfPath?: string; // Legacy field
  imagePath?: string; // Legacy field
  type?: 'current' | 'completed';
  startDate?: string;
  endDate?: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Transforms Firestore document data to Experiment type
 */
const transformDocumentToExperiment = (
  docId: string,
  data: FirestoreExperimentData
): Experiment => {
  return {
    id: docId,
    title: data.title || '',
    year: data.year || new Date().getFullYear(),
    description: data.description || undefined,
    pdfUrl: data.pdfUrl || data.pdfPath || undefined, // Support legacy pdfPath
    pdfPublicId: data.pdfPublicId || undefined,
    imageUrl: data.imageUrl || data.imagePath || undefined, // Support legacy imagePath
    imagePublicId: data.imagePublicId || undefined,
    type: data.type || undefined,
    startDate: data.startDate || undefined,
    endDate: data.endDate || undefined,
    status: data.status || undefined,
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
 * Get all experiments for a research center
 */
export const getExperiments = async (
  divisionId: string,
  centerId: string
): Promise<Experiment[]> => {
  try {
    const experimentsRef = collection(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      EXPERIMENTS_SUBCOLLECTION
    );
    const q = query(experimentsRef, orderBy('year', 'desc'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const experiments: Experiment[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as FirestoreExperimentData;
      experiments.push(transformDocumentToExperiment(docSnapshot.id, data));
    });
    
    return experiments;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    
    // If compound query fails, try simple query
    if (firestoreError.code === FIRESTORE_ERROR_CODES.FAILED_PRECONDITION) {
      try {
        const experimentsRef = collection(
          db,
          DIVISIONS_COLLECTION,
          divisionId,
          RESEARCH_CENTERS_SUBCOLLECTION,
          centerId,
          EXPERIMENTS_SUBCOLLECTION
        );
        const simpleQuery = query(experimentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(simpleQuery);
        
        const experiments: Experiment[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data() as FirestoreExperimentData;
          experiments.push(transformDocumentToExperiment(docSnapshot.id, data));
        });
        
        // Sort manually by year, then createdAt
        return experiments.sort((a, b) => {
          if (b.year !== a.year) {
            return b.year - a.year;
          }
          const aOrder = a.createdAt?.toMillis?.() ?? 0;
          const bOrder = b.createdAt?.toMillis?.() ?? 0;
          return bOrder - aOrder;
        });
      } catch (fallbackError) {
        console.error('Error fetching experiments with fallback query:', fallbackError);
        if (isSafeError(fallbackError)) {
          return [];
        }
        throw new Error(`Failed to fetch experiments: ${(fallbackError as FirestoreError).message || 'Unknown error'}`);
      }
    }
    
    console.error('Error fetching experiments:', {
      divisionId,
      centerId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (isSafeError(error)) {
      return [];
    }
    
    throw new Error(`Failed to fetch experiments: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Get a single experiment by ID
 */
export const getExperiment = async (
  divisionId: string,
  centerId: string,
  experimentId: string
): Promise<Experiment | null> => {
  try {
    const experimentRef = doc(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      EXPERIMENTS_SUBCOLLECTION,
      experimentId
    );
    const docSnapshot = await getDoc(experimentRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data() as FirestoreExperimentData;
    return transformDocumentToExperiment(docSnapshot.id, data);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error fetching experiment:', {
      divisionId,
      centerId,
      experimentId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    
    if (firestoreError.code === FIRESTORE_ERROR_CODES.NOT_FOUND) {
      return null;
    }
    
    throw new Error(`Failed to fetch experiment: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Add a new experiment
 */
export const addExperiment = async (
  divisionId: string,
  centerId: string,
  experiment: Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const experimentsRef = collection(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      EXPERIMENTS_SUBCOLLECTION
    );
    const trimmedPdfUrl = experiment.pdfUrl?.trim();
    const newExperiment: Record<string, unknown> = {
      title: experiment.title.trim(),
      year: experiment.year || new Date().getFullYear(),
      description: experiment.description?.trim() || '',
      pdfPublicId: experiment.pdfPublicId?.trim() || '',
      imageUrl: experiment.imageUrl?.trim() || '',
      imagePublicId: experiment.imagePublicId?.trim() || '',
      startDate: experiment.startDate || '',
      endDate: experiment.endDate || '',
      status: experiment.status || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Only add optional fields if they have values (Firestore doesn't accept undefined)
    if (trimmedPdfUrl) {
      newExperiment.pdfUrl = trimmedPdfUrl;
    }
    if (experiment.type) {
      newExperiment.type = experiment.type;
    }
    
    const docRef = await addDoc(experimentsRef, newExperiment);
    return docRef.id;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error adding experiment:', {
      divisionId,
      centerId,
      code: firestoreError.code,
      message: firestoreError.message,
      experiment: experiment.title
    });
    throw new Error(`Failed to add experiment: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Update an experiment
 */
export const updateExperiment = async (
  divisionId: string,
  centerId: string,
  experimentId: string,
  updates: Partial<Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const experimentRef = doc(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      EXPERIMENTS_SUBCOLLECTION,
      experimentId
    );
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now()
    };
    
    if (updates.title !== undefined) {
      updateData.title = updates.title.trim();
    }
    if (updates.year !== undefined) {
      updateData.year = updates.year;
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description.trim() || '';
    }
    if (updates.pdfUrl !== undefined) {
      const trimmedPdfUrl = updates.pdfUrl.trim();
      // Only set pdfUrl if it has a value, use empty string to clear it
      updateData.pdfUrl = trimmedPdfUrl || '';
    }
    if (updates.pdfPublicId !== undefined) {
      updateData.pdfPublicId = updates.pdfPublicId.trim() || '';
    }
    if (updates.imageUrl !== undefined) {
      updateData.imageUrl = updates.imageUrl.trim() || '';
    }
    if (updates.imagePublicId !== undefined) {
      updateData.imagePublicId = updates.imagePublicId.trim() || '';
    }
    if (updates.type !== undefined) {
      updateData.type = updates.type;
    }
    if (updates.startDate !== undefined) {
      updateData.startDate = updates.startDate;
    }
    if (updates.endDate !== undefined) {
      updateData.endDate = updates.endDate;
    }
    if (updates.status !== undefined) {
      updateData.status = updates.status;
    }
    
    await updateDoc(experimentRef, updateData);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error updating experiment:', {
      divisionId,
      centerId,
      experimentId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    throw new Error(`Failed to update experiment: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Delete an experiment
 * Automatically detects storage provider from URLs and deletes files accordingly
 */
export const deleteExperiment = async (
  divisionId: string,
  centerId: string,
  experimentId: string,
  pdfPublicId?: string,
  imagePublicId?: string,
  pdfUrl?: string,
  imageUrl?: string
): Promise<void> => {
  try {
    const experimentRef = doc(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      EXPERIMENTS_SUBCOLLECTION,
      experimentId
    );
    
    // Get experiment to get URLs if not provided
    let experiment: Experiment | null = null;
    if (!pdfUrl || !imageUrl) {
      experiment = await getExperiment(divisionId, centerId, experimentId);
    }
    
    // Delete PDF from storage if URL is available
    const pdfUrlToDelete = pdfUrl || experiment?.pdfUrl;
    if (pdfUrlToDelete) {
      try {
        await deleteFileFromStorage(pdfUrlToDelete, pdfPublicId);
      } catch (pdfError) {
        console.warn('Failed to delete PDF from storage:', pdfError);
        // Continue with document deletion even if PDF deletion fails
      }
    }
    
    // Delete image from storage if URL is available
    const imageUrlToDelete = imageUrl || experiment?.imageUrl;
    if (imageUrlToDelete) {
      try {
        await deleteFileFromStorage(imageUrlToDelete, imagePublicId);
      } catch (imageError) {
        console.warn('Failed to delete image from storage:', imageError);
        // Continue with document deletion even if image deletion fails
      }
    }
    
    await deleteDoc(experimentRef);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error deleting experiment:', {
      divisionId,
      centerId,
      experimentId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    throw new Error(`Failed to delete experiment: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Subscribe to real-time updates of experiments for a research center
 * Returns an unsubscribe function
 */
export const subscribeToExperiments = (
  divisionId: string,
  centerId: string,
  callback: (experiments: Experiment[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  let unsubscribe: Unsubscribe | null = null;
  let useSimpleQuery = false;

  const setupSubscription = (useFallback = false) => {
    try {
      const experimentsRef = collection(
        db,
        DIVISIONS_COLLECTION,
        divisionId,
        RESEARCH_CENTERS_SUBCOLLECTION,
        centerId,
        EXPERIMENTS_SUBCOLLECTION
      );
      
      let q;
      if (useFallback) {
        q = query(experimentsRef, orderBy('createdAt', 'desc'));
        useSimpleQuery = true;
      } else {
        try {
          q = query(experimentsRef, orderBy('year', 'desc'), orderBy('createdAt', 'desc'));
          useSimpleQuery = false;
        } catch (queryError) {
          console.warn('Failed to build compound query, using fallback');
          q = query(experimentsRef, orderBy('createdAt', 'desc'));
          useSimpleQuery = true;
        }
      }
      
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const experiments: Experiment[] = [];
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data() as FirestoreExperimentData;
            experiments.push(transformDocumentToExperiment(docSnapshot.id, data));
          });
          
          // If we used a simple query, sort manually
          if (useSimpleQuery && experiments.length > 0) {
            experiments.sort((a, b) => {
              if (b.year !== a.year) {
                return b.year - a.year;
              }
              const aOrder = a.createdAt?.toMillis?.() ?? 0;
              const bOrder = b.createdAt?.toMillis?.() ?? 0;
              return bOrder - aOrder;
            });
          }
          
          callback(experiments);
        },
        (error) => {
          const firestoreError = error as FirestoreError;
          
          // Handle index error by retrying with simple query
          if (firestoreError.code === FIRESTORE_ERROR_CODES.FAILED_PRECONDITION && !useFallback) {
            console.warn(
              'Composite index not found. Retrying with simple query. ' +
              'Create the index in Firebase Console for better performance.'
            );
            if (unsubscribe) {
              unsubscribe();
            }
            setupSubscription(true); // Retry with fallback
            return;
          }
          
          console.error('Error in experiments subscription:', {
            divisionId,
            centerId,
            code: firestoreError.code,
            message: firestoreError.message
          });
          
          if (isSafeError(error)) {
            console.info('Experiments subscription: collection is empty or not accessible. Returning empty array.');
            callback([]);
            return;
          }
          
          if (onError) {
            onError(new Error(`Failed to subscribe to experiments: ${firestoreError.message || 'Unknown error'}`));
          }
        }
      );
      
      return unsubscribe;
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error('Error setting up experiments subscription:', {
        divisionId,
        centerId,
        code: firestoreError.code,
        message: firestoreError.message
      });
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(`Failed to set up subscription: ${firestoreError.message || 'Unknown error'}`));
      }
      
      return () => {};
    }
  };

  unsubscribe = setupSubscription(false);
  
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

