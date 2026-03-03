/**
 * Slider Images Service
 * 
 * Handles all Firestore operations for slider images
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
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { SliderImage } from '../../types';
import { deleteFileFromStorage } from './storageService';

const SLIDER_IMAGES_COLLECTION = 'sliderImages';

/**
 * Get all slider images, ordered by order field (ascending)
 */
export const getAllSliderImages = async (): Promise<SliderImage[]> => {
  try {
    const imagesRef = collection(db, SLIDER_IMAGES_COLLECTION);
    const q = query(imagesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const images: SliderImage[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      images.push({
        id: docSnapshot.id,
        url: data.url || '',
        publicId: data.publicId || '',
        order: data.order || 0,
        title: data.title || undefined,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    return images;
  } catch (error) {
    console.error('Error fetching slider images:', error);
    throw new Error('Failed to fetch slider images');
  }
};

/**
 * Get a single slider image by ID
 */
export const getSliderImageById = async (id: string): Promise<SliderImage | null> => {
  try {
    const imageRef = doc(db, SLIDER_IMAGES_COLLECTION, id);
    const docSnapshot = await getDoc(imageRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      url: data.url || '',
      publicId: data.publicId || '',
      order: data.order || 0,
      title: data.title || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  } catch (error) {
    console.error('Error fetching slider image:', error);
    throw new Error('Failed to fetch slider image');
  }
};

/**
 * Add a new slider image
 */
export const addSliderImage = async (
  image: Omit<SliderImage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    // Get current max order to append at the end
    const existingImages = await getAllSliderImages();
    const maxOrder = existingImages.length > 0 
      ? Math.max(...existingImages.map(img => img.order || 0))
      : -1;
    
    const imagesRef = collection(db, SLIDER_IMAGES_COLLECTION);
    const newImage: Record<string, unknown> = {
      url: image.url.trim(),
      publicId: image.publicId.trim(),
      order: maxOrder + 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    if (image.title != null && image.title.trim() !== '') {
      newImage.title = image.title.trim();
    }
    
    const docRef = await addDoc(imagesRef, newImage);
    return docRef.id;
  } catch (error) {
    console.error('Error adding slider image:', error);
    throw new Error('Failed to add slider image');
  }
};

/**
 * Update a slider image
 */
export const updateSliderImage = async (
  id: string,
  updates: Partial<Omit<SliderImage, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const imageRef = doc(db, SLIDER_IMAGES_COLLECTION, id);
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
    console.error('Error updating slider image:', error);
    throw new Error('Failed to update slider image');
  }
};

/**
 * Update a slider image's title
 */
export const updateSliderImageTitle = async (
  id: string,
  title: string
): Promise<void> => {
  try {
    const imageRef = doc(db, SLIDER_IMAGES_COLLECTION, id);
    await updateDoc(imageRef, {
      title: title.trim(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating slider image title:', error);
    throw new Error('Failed to update slider image title');
  }
};

/**
 * Delete a slider image
 * Automatically detects storage provider (Cloudinary or Firebase Storage) from URL
 * Keeps in Firestore if storage delete fails
 * Returns result indicating if storage deletion succeeded
 */
export const deleteSliderImage = async (id: string, publicId: string, url?: string): Promise<{ storageDeleted: boolean; error?: string }> => {
  try {
    // Get URL if not provided
    let imageUrl = url;
    if (!imageUrl) {
      const image = await getSliderImageById(id);
      imageUrl = image?.url;
    }
    
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
    
    // Delete from Firestore only if storage deletion succeeded
    const imageRef = doc(db, SLIDER_IMAGES_COLLECTION, id);
    await deleteDoc(imageRef);
    
    // Reorder remaining images
    const remainingImages = await getAllSliderImages();
    if (remainingImages.length > 0) {
      await reorderSliderImages(remainingImages);
    }
    
    return { storageDeleted: true };
  } catch (error) {
    console.error('Error deleting slider image:', error);
    throw new Error('Failed to delete slider image');
  }
};

/**
 * Reorder slider images
 * Updates the order field for all images in the provided array
 */
export const reorderSliderImages = async (images: SliderImage[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    images.forEach((image, index) => {
      if (image.id) {
        const imageRef = doc(db, SLIDER_IMAGES_COLLECTION, image.id);
        batch.update(imageRef, {
          order: index,
          updatedAt: Timestamp.now()
        });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error reordering slider images:', error);
    throw new Error('Failed to reorder slider images');
  }
};

/**
 * Subscribe to real-time updates of slider images
 * Returns an unsubscribe function
 */
export const subscribeToSliderImages = (
  callback: (images: SliderImage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const imagesRef = collection(db, SLIDER_IMAGES_COLLECTION);
    const q = query(imagesRef, orderBy('order', 'asc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const images: SliderImage[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          images.push({
            id: docSnapshot.id,
            url: data.url || '',
            publicId: data.publicId || '',
            order: data.order || 0,
            title: data.title || undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });
        callback(images);
      },
      (error) => {
        console.error('Error in slider images subscription:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up slider images subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to subscribe to slider images'));
    }
    // Return a no-op unsubscribe function
    return () => {};
  }
};

