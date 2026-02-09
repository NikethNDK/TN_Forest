/**
 * Genetic Resource Service
 *
 * Handles all Firestore operations for genetic resources.
 * Genetic resources are stored as subcollections under research centers.
 */

import {
  collection,
  doc,
  getDocs,
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
import { getAllDivisions } from './divisionService';
import { getResearchCenters } from './researchCenterService';
import type { GeneticResource } from '../../types';

/** Aggregated structure for genetic resources by division and center */
export interface DivisionCenterResources {
  divisionId: string;
  divisionName: string;
  divisionSlug: string;
  centers: {
    centerId: string;
    centerName: string;
    resources: GeneticResource[];
  }[];
}

const DIVISIONS_COLLECTION = 'divisions';
const RESEARCH_CENTERS_SUBCOLLECTION = 'researchCenters';
const GENETIC_RESOURCES_SUBCOLLECTION = 'geneticResources';

const FIRESTORE_ERROR_CODES = {
  NOT_FOUND: 'not-found',
  PERMISSION_DENIED: 'permission-denied',
  FAILED_PRECONDITION: 'failed-precondition',
  UNAVAILABLE: 'unavailable'
} as const;

interface FirestoreGeneticResourceData {
  name?: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  createdAt?: any;
  updatedAt?: any;
}

const transformDocumentToGeneticResource = (
  docId: string,
  data: FirestoreGeneticResourceData
): GeneticResource => {
  return {
    id: docId,
    name: data.name || '',
    pdfUrl: data.pdfUrl || '',
    pdfPublicId: data.pdfPublicId || undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

const isSafeError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const firestoreError = error as FirestoreError;
  return (
    firestoreError.code === FIRESTORE_ERROR_CODES.NOT_FOUND ||
    firestoreError.code === FIRESTORE_ERROR_CODES.PERMISSION_DENIED
  );
};

/**
 * Get genetic resources for a single research center (one-off fetch)
 */
export const getGeneticResources = async (
  divisionId: string,
  centerId: string
): Promise<GeneticResource[]> => {
  try {
    const resourcesRef = collection(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      GENETIC_RESOURCES_SUBCOLLECTION
    );
    let querySnapshot;
    try {
      const q = query(resourcesRef, orderBy('createdAt', 'desc'));
      querySnapshot = await getDocs(q);
    } catch {
      querySnapshot = await getDocs(resourcesRef);
    }
    const resources: GeneticResource[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as FirestoreGeneticResourceData;
      resources.push(transformDocumentToGeneticResource(docSnapshot.id, data));
    });
    return resources;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error fetching genetic resources:', {
      divisionId,
      centerId,
      code: firestoreError.code,
      message: firestoreError.message
    });
    if (isSafeError(error)) {
      return [];
    }
    throw new Error(`Failed to fetch genetic resources: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Subscribe to real-time updates of genetic resources for a research center
 */
export const subscribeToGeneticResources = (
  divisionId: string,
  centerId: string,
  callback: (resources: GeneticResource[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  let unsubscribe: Unsubscribe | null = null;

  try {
    const resourcesRef = collection(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      GENETIC_RESOURCES_SUBCOLLECTION
    );
    const q = query(resourcesRef, orderBy('createdAt', 'desc'));

    unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const resources: GeneticResource[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data() as FirestoreGeneticResourceData;
          resources.push(transformDocumentToGeneticResource(docSnapshot.id, data));
        });
        callback(resources);
      },
      (error) => {
        const firestoreError = error as FirestoreError;
        console.error('Error in genetic resources subscription:', {
          divisionId,
          centerId,
          code: firestoreError.code,
          message: firestoreError.message
        });
        if (isSafeError(error)) {
          callback([]);
          return;
        }
        if (onError) {
          onError(new Error(`Failed to subscribe to genetic resources: ${firestoreError.message || 'Unknown error'}`));
        }
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error setting up genetic resources subscription:', firestoreError);
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(firestoreError.message)));
    }
    return () => {};
  }
};

/**
 * Add a new genetic resource
 */
export const addGeneticResource = async (
  divisionId: string,
  centerId: string,
  resource: { name: string; pdfUrl: string; pdfPublicId?: string }
): Promise<string> => {
  try {
    const resourcesRef = collection(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      GENETIC_RESOURCES_SUBCOLLECTION
    );
    const docRef = await addDoc(resourcesRef, {
      name: resource.name.trim(),
      pdfUrl: resource.pdfUrl.trim(),
      pdfPublicId: resource.pdfPublicId?.trim() || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error adding genetic resource:', { divisionId, centerId, code: firestoreError.code, message: firestoreError.message });
    throw new Error(`Failed to add genetic resource: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Update a genetic resource
 */
export const updateGeneticResource = async (
  divisionId: string,
  centerId: string,
  resourceId: string,
  updates: { name?: string; pdfUrl?: string; pdfPublicId?: string }
): Promise<void> => {
  try {
    const resourceRef = doc(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      GENETIC_RESOURCES_SUBCOLLECTION,
      resourceId
    );
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now()
    };
    if (updates.name !== undefined) updateData.name = updates.name.trim();
    if (updates.pdfUrl !== undefined) updateData.pdfUrl = updates.pdfUrl.trim();
    if (updates.pdfPublicId !== undefined) updateData.pdfPublicId = updates.pdfPublicId?.trim() || '';
    await updateDoc(resourceRef, updateData);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error updating genetic resource:', { divisionId, centerId, resourceId, code: firestoreError.code });
    throw new Error(`Failed to update genetic resource: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Delete a genetic resource and its PDF from storage if present
 */
export const deleteGeneticResource = async (
  divisionId: string,
  centerId: string,
  resourceId: string,
  pdfUrl?: string,
  pdfPublicId?: string
): Promise<void> => {
  try {
    const resourceRef = doc(
      db,
      DIVISIONS_COLLECTION,
      divisionId,
      RESEARCH_CENTERS_SUBCOLLECTION,
      centerId,
      GENETIC_RESOURCES_SUBCOLLECTION,
      resourceId
    );

    if (pdfUrl) {
      try {
        await deleteFileFromStorage(pdfUrl, pdfPublicId);
      } catch (storageError) {
        console.warn('Failed to delete PDF from storage:', storageError);
      }
    }

    await deleteDoc(resourceRef);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error deleting genetic resource:', { divisionId, centerId, resourceId, code: firestoreError.code });
    throw new Error(`Failed to delete genetic resource: ${firestoreError.message || 'Unknown error'}`);
  }
};

/**
 * Fetch all genetic resources across all divisions and research centers
 */
export const fetchAllGeneticResources = async (): Promise<DivisionCenterResources[]> => {
  const divisions = await getAllDivisions();
  const result: DivisionCenterResources[] = [];

  for (const division of divisions) {
    const divisionId = (division.id as string) || '';
    const centers = await getResearchCenters(divisionId);
    const centerResources: DivisionCenterResources['centers'] = [];

    for (const center of centers) {
      const centerId = (center.id as string) || '';
      const resources = await getGeneticResources(divisionId, centerId);
      centerResources.push({
        centerId,
        centerName: center.name || '',
        resources
      });
    }

    result.push({
      divisionId,
      divisionName: division.name || '',
      divisionSlug: division.slug || '',
      centers: centerResources
    });
  }

  return result;
};
