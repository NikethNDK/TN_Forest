/**
 * Faculty Service
 * 
 * Handles all Firestore operations for faculty members
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
  writeBatch,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { FacultyMember } from '../../types';

const FACULTY_COLLECTION = 'faculty';

/**
 * Get all faculty members, ordered by order field
 */
export const getAllFaculty = async (): Promise<FacultyMember[]> => {
  try {
    const facultyRef = collection(db, FACULTY_COLLECTION);
    const q = query(facultyRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const faculty: FacultyMember[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      faculty.push({
        id: docSnapshot.id,
        name: data.name,
        position: data.position,
        order: data.order,
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    return faculty;
  } catch (error) {
    console.error('Error fetching faculty:', error);
    throw new Error('Failed to fetch faculty members');
  }
};

/**
 * Get a single faculty member by ID
 */
export const getFacultyById = async (id: string): Promise<FacultyMember | null> => {
  try {
    const facultyRef = doc(db, FACULTY_COLLECTION, id);
    const docSnapshot = await getDoc(facultyRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      name: data.name,
      position: data.position,
      order: data.order,
      imageUrl: data.imageUrl,
      imagePublicId: data.imagePublicId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  } catch (error) {
    console.error('Error fetching faculty member:', error);
    throw new Error('Failed to fetch faculty member');
  }
};

/**
 * Add a new faculty member
 * Automatically assigns the highest order + 1
 */
export const addFacultyMember = async (member: { 
  name: string; 
  position: string; 
  imageUrl?: string; 
  imagePublicId?: string;
}): Promise<string> => {
  try {
    // Get current max order
    const allFaculty = await getAllFaculty();
    const maxOrder = allFaculty.length > 0 
      ? Math.max(...allFaculty.map(f => f.order)) 
      : -1;
    
    const facultyRef = collection(db, FACULTY_COLLECTION);
    const newMember: Record<string, any> = {
      name: member.name.trim(),
      position: member.position.trim(),
      order: maxOrder + 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add optional image fields if provided
    if (member.imageUrl) {
      newMember.imageUrl = member.imageUrl;
    }
    if (member.imagePublicId) {
      newMember.imagePublicId = member.imagePublicId;
    }
    
    const docRef = await addDoc(facultyRef, newMember);
    return docRef.id;
  } catch (error) {
    console.error('Error adding faculty member:', error);
    throw new Error('Failed to add faculty member');
  }
};

/**
 * Update a faculty member
 */
export const updateFacultyMember = async (
  id: string,
  updates: Partial<Pick<FacultyMember, 'name' | 'position' | 'imageUrl' | 'imagePublicId'>>
): Promise<void> => {
  try {
    const facultyRef = doc(db, FACULTY_COLLECTION, id);
    const updateData: any = {
      updatedAt: Timestamp.now()
    };
    
    if (updates.name !== undefined) {
      updateData.name = updates.name.trim();
    }
    if (updates.position !== undefined) {
      updateData.position = updates.position.trim();
    }
    if (updates.imageUrl !== undefined) {
      updateData.imageUrl = updates.imageUrl || null;
    }
    if (updates.imagePublicId !== undefined) {
      updateData.imagePublicId = updates.imagePublicId || null;
    }
    
    await updateDoc(facultyRef, updateData);
  } catch (error) {
    console.error('Error updating faculty member:', error);
    throw new Error('Failed to update faculty member');
  }
};

/**
 * Delete a faculty member
 */
export const deleteFacultyMember = async (id: string): Promise<void> => {
  try {
    const facultyRef = doc(db, FACULTY_COLLECTION, id);
    await deleteDoc(facultyRef);
    
    // Reorder remaining members to fill gaps
    const allFaculty = await getAllFaculty();
    const batch = writeBatch(db);
    
    allFaculty.forEach((member, index) => {
      if (member.id !== id) {
        const memberRef = doc(db, FACULTY_COLLECTION, member.id);
        batch.update(memberRef, { order: index });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting faculty member:', error);
    throw new Error('Failed to delete faculty member');
  }
};

/**
 * Swap the order of two faculty members (for move up/down)
 */
export const swapFacultyOrder = async (id1: string, id2: string): Promise<void> => {
  try {
    const member1 = await getFacultyById(id1);
    const member2 = await getFacultyById(id2);
    
    if (!member1 || !member2) {
      throw new Error('One or both faculty members not found');
    }
    
    const batch = writeBatch(db);
    const member1Ref = doc(db, FACULTY_COLLECTION, id1);
    const member2Ref = doc(db, FACULTY_COLLECTION, id2);
    
    batch.update(member1Ref, {
      order: member2.order,
      updatedAt: Timestamp.now()
    });
    batch.update(member2Ref, {
      order: member1.order,
      updatedAt: Timestamp.now()
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error swapping faculty order:', error);
    throw new Error('Failed to reorder faculty members');
  }
};

/**
 * Update the order of a faculty member
 */
export const reorderFacultyMember = async (id: string, newOrder: number): Promise<void> => {
  try {
    const facultyRef = doc(db, FACULTY_COLLECTION, id);
    await updateDoc(facultyRef, {
      order: newOrder,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error reordering faculty member:', error);
    throw new Error('Failed to reorder faculty member');
  }
};

/**
 * Subscribe to real-time updates of faculty members
 * Returns an unsubscribe function
 */
export const subscribeToFaculty = (
  callback: (faculty: FacultyMember[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const facultyRef = collection(db, FACULTY_COLLECTION);
    const q = query(facultyRef, orderBy('order', 'asc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const faculty: FacultyMember[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          faculty.push({
            id: docSnapshot.id,
            name: data.name,
            position: data.position,
            order: data.order,
            imageUrl: data.imageUrl,
            imagePublicId: data.imagePublicId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });
        callback(faculty);
      },
      (error) => {
        console.error('Error in faculty subscription:', error);
        if (onError) {
          onError(new Error('Failed to subscribe to faculty updates'));
        }
      }
    );
  } catch (error) {
    console.error('Error setting up faculty subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to set up subscription'));
    }
    // Return a no-op unsubscribe function
    return () => {};
  }
};

