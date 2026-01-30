/**
 * Gallery Images Service
 * 
 * Handles all Firestore operations for gallery images
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
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { GalleryImage } from '../../types';
import { deleteFileFromStorage } from './storageService';

const GALLERY_IMAGES_COLLECTION = 'galleryImages';

/**
 * Transform Firestore document data to GalleryImage
 * Defaults scope to 'global' for backward compatibility with existing documents
 */
const transformDocumentToGalleryImage = (docId: string, data: any): GalleryImage => {
  return {
    id: docId,
    url: data.url || '',
    publicId: data.publicId || '',
    title: data.title || undefined, // Optional title for the image
    order: data.order || 0,
    scope: data.scope || 'global', // Default to 'global' for existing images
    divisionSlug: data.divisionSlug || undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

/**
 * Get all gallery images, ordered by order field (ascending)
 * Returns only global scope images by default (for backward compatibility)
 * Legacy images without scope field are treated as global
 */
export const getAllGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    // Query all images and filter client-side for backward compatibility
    // This handles documents without scope field (legacy images)
    const q = query(imagesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const images: GalleryImage[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const image = transformDocumentToGalleryImage(docSnapshot.id, data);
      // Only include if scope is global or undefined (legacy images)
      if (!image.scope || image.scope === 'global') {
        images.push(image);
      }
    });
    
    return images;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw new Error('Failed to fetch gallery images');
  }
};

/**
 * Get all gallery images for a specific division, ordered by order field (ascending)
 */
export const getGalleryImagesByDivision = async (divisionSlug: string): Promise<GalleryImage[]> => {
  try {
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    const q = query(
      imagesRef,
      where('scope', '==', 'division'),
      where('divisionSlug', '==', divisionSlug),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const images: GalleryImage[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      images.push(transformDocumentToGalleryImage(docSnapshot.id, data));
    });
    
    return images;
  } catch (error) {
    console.error('Error fetching division gallery images:', error);
    throw new Error('Failed to fetch division gallery images');
  }
};

/**
 * Get a single gallery image by ID
 */
export const getGalleryImageById = async (id: string): Promise<GalleryImage | null> => {
  try {
    const imageRef = doc(db, GALLERY_IMAGES_COLLECTION, id);
    const docSnapshot = await getDoc(imageRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    return transformDocumentToGalleryImage(docSnapshot.id, data);
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    throw new Error('Failed to fetch gallery image');
  }
};

/**
 * Add a new gallery image
 * If scope is 'division', divisionSlug must be provided
 */
export const addGalleryImage = async (
  image: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    // Validate division scope
    if (image.scope === 'division' && !image.divisionSlug) {
      throw new Error('divisionSlug is required when scope is "division"');
    }
    
    // Get existing images based on scope to calculate order
    let existingImages: GalleryImage[];
    if (image.scope === 'division' && image.divisionSlug) {
      existingImages = await getGalleryImagesByDivision(image.divisionSlug);
    } else {
      existingImages = await getAllGalleryImages();
    }
    
    const maxOrder = existingImages.length > 0 
      ? Math.max(...existingImages.map(img => img.order || 0))
      : -1;
    
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    const newImage: any = {
      url: image.url.trim(),
      publicId: image.publicId.trim(),
      order: maxOrder + 1,
      scope: image.scope || 'global', // Default to global if not specified
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add title if provided
    if (image.title && image.title.trim()) {
      newImage.title = image.title.trim();
    }
    
    // Only add divisionSlug if scope is division
    if (image.scope === 'division' && image.divisionSlug) {
      newImage.divisionSlug = image.divisionSlug.trim();
    }
    
    const docRef = await addDoc(imagesRef, newImage);
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery image:', error);
    throw new Error('Failed to add gallery image');
  }
};

/**
 * Update a gallery image
 */
export const updateGalleryImage = async (
  id: string,
  updates: Partial<Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const imageRef = doc(db, GALLERY_IMAGES_COLLECTION, id);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    // Clean up undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    await updateDoc(imageRef, updateData);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw new Error('Failed to update gallery image');
  }
};

/**
 * Update the title of a gallery image
 * Convenience function for quick title updates
 */
export const updateGalleryImageTitle = async (
  id: string,
  title: string
): Promise<void> => {
  try {
    const imageRef = doc(db, GALLERY_IMAGES_COLLECTION, id);
    await updateDoc(imageRef, {
      title: title.trim(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating gallery image title:', error);
    throw new Error('Failed to update gallery image title');
  }
};

/**
 * Delete a gallery image
 * Automatically detects storage provider (Cloudinary or Firebase Storage) from URL
 * Keeps in Firestore if storage delete fails
 * Returns result indicating if storage deletion succeeded
 */
export const deleteGalleryImage = async (id: string, publicId: string, url?: string): Promise<{ storageDeleted: boolean; error?: string }> => {
  try {
    // Get the image to determine its scope for reordering and get URL if not provided
    const image = await getGalleryImageById(id);
    const imageUrl = url || image?.url;
    
    // Try to delete from storage (automatically detects Cloudinary vs Firebase Storage)
    if (imageUrl) {
      const deleteResult = await deleteFileFromStorage(imageUrl, publicId);
      
      if (!deleteResult.success) {
        console.warn('Failed to delete image from storage:', deleteResult.error);
        // Per user preference: keep in Firestore if storage delete fails
        return {
          storageDeleted: false,
          error: deleteResult.error
        };
      }
    }
    
    // Delete from Firestore only if storage deletion succeeded (or no URL/publicId)
    const imageRef = doc(db, GALLERY_IMAGES_COLLECTION, id);
    await deleteDoc(imageRef);
    
    // Reorder remaining images based on scope
    if (image) {
      let remainingImages: GalleryImage[];
      if (image.scope === 'division' && image.divisionSlug) {
        remainingImages = await getGalleryImagesByDivision(image.divisionSlug);
      } else {
        remainingImages = await getAllGalleryImages();
      }
      
      if (remainingImages.length > 0) {
        await reorderGalleryImages(remainingImages);
      }
    }
    
    return { storageDeleted: true };
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw new Error('Failed to delete gallery image');
  }
};

/**
 * Reorder gallery images
 * Updates the order field for all images in the provided array
 */
export const reorderGalleryImages = async (images: GalleryImage[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    images.forEach((image, index) => {
      if (image.id) {
        const imageRef = doc(db, GALLERY_IMAGES_COLLECTION, image.id);
        batch.update(imageRef, {
          order: index,
          updatedAt: Timestamp.now()
        });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error reordering gallery images:', error);
    throw new Error('Failed to reorder gallery images');
  }
};

/**
 * Subscribe to real-time updates of global gallery images
 * Returns an unsubscribe function
 * Defaults to global scope for backward compatibility
 */
export const subscribeToGalleryImages = (
  callback: (images: GalleryImage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    // Subscribe to all images, but filter to global in the callback
    const q = query(imagesRef, orderBy('order', 'asc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const images: GalleryImage[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const image = transformDocumentToGalleryImage(docSnapshot.id, data);
          // Only include global scope images or legacy images without scope
          if (!image.scope || image.scope === 'global') {
            images.push(image);
          }
        });
        // Sort by order
        images.sort((a, b) => (a.order || 0) - (b.order || 0));
        callback(images);
      },
      (error) => {
        console.error('Error in gallery images subscription:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up gallery images subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to subscribe to gallery images'));
    }
    // Return a no-op unsubscribe function
    return () => {};
  }
};

/**
 * Subscribe to real-time updates of global gallery images
 * Returns an unsubscribe function
 * Includes legacy images without scope field for backward compatibility
 * @param callback Function to call with the gallery images
 * @param onError Optional error handler
 * @param limit Optional limit on number of images to return
 */
export const subscribeToGlobalGalleryImages = (
  callback: (images: GalleryImage[]) => void,
  onError?: (error: Error) => void,
  limit?: number
): Unsubscribe => {
  try {
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    // Query all images and filter client-side to include legacy images (no scope field)
    // This ensures backward compatibility with existing images
    const q = query(imagesRef, orderBy('order', 'asc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const images: GalleryImage[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const image = transformDocumentToGalleryImage(docSnapshot.id, data);
          // Only include global scope images or legacy images without scope
          if (!image.scope || image.scope === 'global') {
            images.push(image);
          }
        });
        // Sort by order (already sorted, but ensure consistency)
        images.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        // Apply limit if specified
        const finalImages = limit && limit > 0 ? images.slice(0, limit) : images;
        callback(finalImages);
      },
      (error) => {
        console.error('Error in global gallery images subscription:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up global gallery images subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to subscribe to global gallery images'));
    }
    // Return a no-op unsubscribe function
    return () => {};
  }
};

/**
 * Subscribe to real-time updates of division gallery images
 * Returns an unsubscribe function
 * @param divisionSlug The division slug to filter by
 * @param callback Function to call with the gallery images
 * @param onError Optional error handler
 * @param limit Optional limit on number of images to return
 */
export const subscribeToDivisionGalleryImages = (
  divisionSlug: string,
  callback: (images: GalleryImage[]) => void,
  onError?: (error: Error) => void,
  limit?: number
): Unsubscribe => {
  try {
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    const queryConstraints: any[] = [
      where('scope', '==', 'division'),
      where('divisionSlug', '==', divisionSlug),
      orderBy('order', 'asc')
    ];
    
    if (limit && limit > 0) {
      queryConstraints.push(firestoreLimit(limit));
    }
    
    const q = query(imagesRef, ...queryConstraints);
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const images: GalleryImage[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          images.push(transformDocumentToGalleryImage(docSnapshot.id, data));
        });
        callback(images);
      },
      (error) => {
        console.error('Error in division gallery images subscription:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up division gallery images subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to subscribe to division gallery images'));
    }
    // Return a no-op unsubscribe function
    return () => {};
  }
};

