/**
 * Contact Service
 * 
 * Handles all Firestore operations for contact locations
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
  where,
  Timestamp,
  writeBatch,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { ContactLocation } from '../../types';

const CONTACT_LOCATIONS_COLLECTION = 'contactLocations';

/**
 * Get all contact locations, ordered by order field
 */
export const getAllContactLocations = async (): Promise<ContactLocation[]> => {
  try {
    const locationsRef = collection(db, CONTACT_LOCATIONS_COLLECTION);
    const q = query(locationsRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const locations: ContactLocation[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      locations.push({
        id: docSnapshot.id,
        name: data.name,
        location: data.location,
        phone: data.phone || '',
        email: data.email || '',
        showInFooter: data.showInFooter || false,
        order: data.order,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    return locations;
  } catch (error) {
    console.error('Error fetching contact locations:', error);
    throw new Error('Failed to fetch contact locations');
  }
};

/**
 * Get a single contact location by ID
 */
export const getContactLocationById = async (id: string): Promise<ContactLocation | null> => {
  try {
    const locationRef = doc(db, CONTACT_LOCATIONS_COLLECTION, id);
    const docSnapshot = await getDoc(locationRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      name: data.name,
      location: data.location,
      phone: data.phone || '',
      email: data.email || '',
      showInFooter: data.showInFooter || false,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  } catch (error) {
    console.error('Error fetching contact location:', error);
    throw new Error('Failed to fetch contact location');
  }
};

/**
 * Get the location that is set to show in footer
 */
export const getFooterLocation = async (): Promise<ContactLocation | null> => {
  try {
    const locationsRef = collection(db, CONTACT_LOCATIONS_COLLECTION);
    const q = query(locationsRef, where('showInFooter', '==', true));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Should only be one, but take the first if multiple exist
    const docSnapshot = querySnapshot.docs[0];
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      name: data.name,
      location: data.location,
      phone: data.phone || '',
      email: data.email || '',
      showInFooter: true,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  } catch (error) {
    console.error('Error fetching footer location:', error);
    throw new Error('Failed to fetch footer location');
  }
};

/**
 * Subscribe to real-time updates of all contact locations
 * Returns an unsubscribe function
 */
export const subscribeToContactLocations = (
  callback: (locations: ContactLocation[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const locationsRef = collection(db, CONTACT_LOCATIONS_COLLECTION);
    const q = query(locationsRef, orderBy('order', 'asc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const locations: ContactLocation[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          locations.push({
            id: docSnapshot.id,
            name: data.name,
            location: data.location,
            phone: data.phone || '',
            email: data.email || '',
            showInFooter: data.showInFooter || false,
            order: data.order,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });
        callback(locations);
      },
      (error) => {
        console.error('Error in contact locations subscription:', error);
        if (onError) {
          onError(new Error('Failed to subscribe to contact locations updates'));
        }
      }
    );
  } catch (error) {
    console.error('Error setting up contact locations subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to set up subscription'));
    }
    return () => {};
  }
};

/**
 * Subscribe to real-time updates of footer location only
 * Returns an unsubscribe function
 */
export const subscribeToFooterLocation = (
  callback: (location: ContactLocation | null) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const locationsRef = collection(db, CONTACT_LOCATIONS_COLLECTION);
    const q = query(locationsRef, where('showInFooter', '==', true));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          callback(null);
          return;
        }
        
        // Should only be one, but take the first if multiple exist
        const docSnapshot = querySnapshot.docs[0];
        const data = docSnapshot.data();
        callback({
          id: docSnapshot.id,
          name: data.name,
          location: data.location,
          phone: data.phone || '',
          email: data.email || '',
          showInFooter: true,
          order: data.order,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      },
      (error) => {
        console.error('Error in footer location subscription:', error);
        if (onError) {
          onError(new Error('Failed to subscribe to footer location updates'));
        }
      }
    );
  } catch (error) {
    console.error('Error setting up footer location subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to set up subscription'));
    }
    return () => {};
  }
};

/**
 * Add a new contact location
 * Automatically assigns the highest order + 1
 */
export const addContactLocation = async (
  location: Omit<ContactLocation, 'id' | 'order' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    // Get current max order
    const allLocations = await getAllContactLocations();
    const maxOrder = allLocations.length > 0 
      ? Math.max(...allLocations.map(l => l.order)) 
      : -1;
    
    const locationsRef = collection(db, CONTACT_LOCATIONS_COLLECTION);
    const newLocation = {
      name: location.name.trim(),
      location: location.location.trim(),
      phone: location.phone?.trim() || '',
      email: location.email?.trim() || '',
      showInFooter: false, // Never set to true on add - must use setFooterLocation
      order: maxOrder + 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(locationsRef, newLocation);
    return docRef.id;
  } catch (error) {
    console.error('Error adding contact location:', error);
    throw new Error('Failed to add contact location');
  }
};

/**
 * Update a contact location
 * Does not handle showInFooter changes - use setFooterLocation for that
 */
export const updateContactLocation = async (
  id: string,
  updates: Partial<Pick<ContactLocation, 'name' | 'location' | 'phone' | 'email' | 'order'>>
): Promise<void> => {
  try {
    const locationRef = doc(db, CONTACT_LOCATIONS_COLLECTION, id);
    const updateData: any = {
      updatedAt: Timestamp.now()
    };
    
    if (updates.name !== undefined) {
      updateData.name = updates.name.trim();
    }
    if (updates.location !== undefined) {
      updateData.location = updates.location.trim();
    }
    if (updates.phone !== undefined) {
      updateData.phone = updates.phone.trim();
    }
    if (updates.email !== undefined) {
      updateData.email = updates.email.trim();
    }
    if (updates.order !== undefined) {
      updateData.order = updates.order;
    }
    
    await updateDoc(locationRef, updateData);
  } catch (error) {
    console.error('Error updating contact location:', error);
    throw new Error('Failed to update contact location');
  }
};

/**
 * Delete a contact location
 * If it was the footer location, footer will become empty
 */
export const deleteContactLocation = async (id: string): Promise<void> => {
  try {
    const locationRef = doc(db, CONTACT_LOCATIONS_COLLECTION, id);
    await deleteDoc(locationRef);
    
    // Reorder remaining locations to fill gaps
    const allLocations = await getAllContactLocations();
    const batch = writeBatch(db);
    
    allLocations.forEach((location, index) => {
      if (location.id !== id) {
        const locRef = doc(db, CONTACT_LOCATIONS_COLLECTION, location.id);
        batch.update(locRef, { order: index });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting contact location:', error);
    throw new Error('Failed to delete contact location');
  }
};

/**
 * Set a location to show in footer
 * If another location already has showInFooter = true, it will be unset (if confirmOverride = true)
 * Returns true if override was needed, false otherwise
 */
export const setFooterLocation = async (
  id: string,
  confirmOverride: boolean = false
): Promise<boolean> => {
  try {
    // Check if another location already has showInFooter = true
    const currentFooterLocation = await getFooterLocation();
    
    if (currentFooterLocation && currentFooterLocation.id !== id) {
      if (!confirmOverride) {
        throw new Error('Another location is already set for footer. Override required.');
      }
      
      // Use batch to atomically update both locations
      const batch = writeBatch(db);
      const currentFooterRef = doc(db, CONTACT_LOCATIONS_COLLECTION, currentFooterLocation.id);
      const newFooterRef = doc(db, CONTACT_LOCATIONS_COLLECTION, id);
      
      batch.update(currentFooterRef, {
        showInFooter: false,
        updatedAt: Timestamp.now()
      });
      batch.update(newFooterRef, {
        showInFooter: true,
        updatedAt: Timestamp.now()
      });
      
      await batch.commit();
      return true; // Override was performed
    } else {
      // No existing footer location, or setting the same location
      const locationRef = doc(db, CONTACT_LOCATIONS_COLLECTION, id);
      await updateDoc(locationRef, {
        showInFooter: true,
        updatedAt: Timestamp.now()
      });
      return false; // No override needed
    }
  } catch (error) {
    console.error('Error setting footer location:', error);
    throw error; // Re-throw to preserve error message
  }
};

/**
 * Unset a location from footer (set showInFooter to false)
 */
export const unsetFooterLocation = async (id: string): Promise<void> => {
  try {
    const locationRef = doc(db, CONTACT_LOCATIONS_COLLECTION, id);
    await updateDoc(locationRef, {
      showInFooter: false,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error unsetting footer location:', error);
    throw new Error('Failed to unset footer location');
  }
};

/**
 * Swap the order of two contact locations
 */
export const swapContactLocationOrder = async (id1: string, id2: string): Promise<void> => {
  try {
    const location1 = await getContactLocationById(id1);
    const location2 = await getContactLocationById(id2);
    
    if (!location1 || !location2) {
      throw new Error('One or both locations not found');
    }
    
    const batch = writeBatch(db);
    const location1Ref = doc(db, CONTACT_LOCATIONS_COLLECTION, id1);
    const location2Ref = doc(db, CONTACT_LOCATIONS_COLLECTION, id2);
    
    batch.update(location1Ref, {
      order: location2.order,
      updatedAt: Timestamp.now()
    });
    batch.update(location2Ref, {
      order: location1.order,
      updatedAt: Timestamp.now()
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error swapping contact location order:', error);
    throw new Error('Failed to reorder contact locations');
  }
};

