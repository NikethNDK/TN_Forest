/**
 * About Service
 * 
 * Handles all Firestore operations for mission and vision content
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { MissionVision } from '../../types';

const ABOUT_COLLECTION = 'about';
const MISSION_VISION_DOC_ID = 'missionVision';

/**
 * Get mission and vision (one-time fetch)
 */
export const getMissionVision = async (): Promise<MissionVision | null> => {
  try {
    const docRef = doc(db, ABOUT_COLLECTION, MISSION_VISION_DOC_ID);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    return {
      mission: data.mission || '',
      vision: data.vision || '',
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy
    };
  } catch (error) {
    console.error('Error fetching mission/vision:', error);
    throw new Error('Failed to fetch mission and vision');
  }
};

/**
 * Subscribe to real-time updates of mission and vision
 * Returns an unsubscribe function
 */
export const subscribeToMissionVision = (
  callback: (data: MissionVision | null) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const docRef = doc(db, ABOUT_COLLECTION, MISSION_VISION_DOC_ID);
    
    return onSnapshot(
      docRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          callback(null);
          return;
        }
        
        const data = docSnapshot.data();
        callback({
          mission: data.mission || '',
          vision: data.vision || '',
          updatedAt: data.updatedAt,
          updatedBy: data.updatedBy
        });
      },
      (error) => {
        console.error('Error in mission/vision subscription:', error);
        if (onError) {
          onError(new Error('Failed to subscribe to mission/vision updates'));
        }
      }
    );
  } catch (error) {
    console.error('Error setting up mission/vision subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to set up subscription'));
    }
    // Return a no-op unsubscribe function
    return () => {};
  }
};

/**
 * Update mission and vision
 * Creates document if it doesn't exist
 */
export const updateMissionVision = async (
  mission: string,
  vision: string
): Promise<void> => {
  try {
    const docRef = doc(db, ABOUT_COLLECTION, MISSION_VISION_DOC_ID);
    const docSnapshot = await getDoc(docRef);
    
    const updateData: any = {
      mission: mission, // Preserve all formatting exactly
      vision: vision, // Preserve all formatting exactly
      updatedAt: Timestamp.now()
    };
    
    if (docSnapshot.exists()) {
      // Update existing document
      await updateDoc(docRef, updateData);
    } else {
      // Create new document
      await setDoc(docRef, updateData);
    }
  } catch (error) {
    console.error('Error updating mission/vision:', error);
    throw new Error('Failed to update mission and vision');
  }
};

