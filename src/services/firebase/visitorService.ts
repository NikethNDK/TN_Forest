/**
 * Visitor Service
 * 
 * Handles visitor count tracking using Firestore
 */

import {
  doc,
  getDoc,
  setDoc,
  increment,
  onSnapshot,
  Unsubscribe,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const VISITOR_COUNT_DOC = 'stats/visitorCount';

/**
 * Increment visitor count atomically
 * This is safe to call multiple times - Firestore handles concurrency
 */
export async function incrementVisitorCount(): Promise<number> {
  try {
    const statsRef = doc(db, VISITOR_COUNT_DOC);
    
    // Use Firestore increment (atomic operation - safe for concurrent calls)
    await setDoc(
      statsRef,
      {
        count: increment(1),
        lastUpdated: serverTimestamp()
      },
      { merge: true }
    );
    
    // Get the updated count
    const snapshot = await getDoc(statsRef);
    const count = snapshot.data()?.count || 0;
    
    return count;
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    throw error;
  }
}

/**
 * Get current visitor count
 */
export async function getVisitorCount(): Promise<number> {
  try {
    const statsRef = doc(db, VISITOR_COUNT_DOC);
    const snapshot = await getDoc(statsRef);
    const count = snapshot.data()?.count || 0;
    return count;
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return 0;
  }
}

/**
 * Subscribe to real-time visitor count updates
 * @param callback - Function called when count updates
 * @param onError - Optional error handler
 * @returns Unsubscribe function
 */
export function subscribeToVisitorCount(
  callback: (count: number) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const statsRef = doc(db, VISITOR_COUNT_DOC);
  
  // Use onSnapshot for real-time updates
  const unsubscribe = onSnapshot(
    statsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const count = snapshot.data()?.count || 0;
        callback(count);
      } else {
        // Document doesn't exist yet, initialize with 0
        callback(0);
      }
    },
    (error) => {
      console.error('Error subscribing to visitor count:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  );
  
  return unsubscribe;
}

