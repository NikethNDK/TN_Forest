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
  orderBy,
  Timestamp,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { GalleryImage } from '../../types';
import { deleteImageFromCloudinary } from '../admin/fileUploadService';

const GALLERY_IMAGES_COLLECTION = 'galleryImages';

/**
 * Get all gallery images, ordered by order field (ascending)
 */
export const getAllGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    const q = query(imagesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const images: GalleryImage[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      images.push({
        id: docSnapshot.id,
        url: data.url || '',
        publicId: data.publicId || '',
        order: data.order || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    return images;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw new Error('Failed to fetch gallery images');
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
    return {
      id: docSnapshot.id,
      url: data.url || '',
      publicId: data.publicId || '',
      order: data.order || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    throw new Error('Failed to fetch gallery image');
  }
};

/**
 * Add a new gallery image
 */
export const addGalleryImage = async (
  image: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    // Get current max order to append at the end
    const existingImages = await getAllGalleryImages();
    const maxOrder = existingImages.length > 0 
      ? Math.max(...existingImages.map(img => img.order || 0))
      : -1;
    
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    const newImage = {
      url: image.url.trim(),
      publicId: image.publicId.trim(),
      order: maxOrder + 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
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
 * Delete a gallery image
 * Also attempts to delete from Cloudinary, but keeps in Firestore if Cloudinary delete fails
 * Returns result indicating if Cloudinary deletion succeeded
 */
export const deleteGalleryImage = async (id: string, publicId: string): Promise<{ cloudinaryDeleted: boolean; error?: string }> => {
  try {
    // Try to delete from Cloudinary first
    const cloudinaryResult = await deleteImageFromCloudinary(publicId);
    
    if (!cloudinaryResult.success) {
      console.warn('Failed to delete image from Cloudinary:', cloudinaryResult.error);
      // Per user preference: keep in Firestore if Cloudinary delete fails
      return {
        cloudinaryDeleted: false,
        error: cloudinaryResult.error
      };
    }
    
    // Delete from Firestore only if Cloudinary deletion succeeded
    const imageRef = doc(db, GALLERY_IMAGES_COLLECTION, id);
    await deleteDoc(imageRef);
    
    // Reorder remaining images
    const remainingImages = await getAllGalleryImages();
    if (remainingImages.length > 0) {
      await reorderGalleryImages(remainingImages);
    }
    
    return { cloudinaryDeleted: true };
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
 * Subscribe to real-time updates of gallery images
 * Returns an unsubscribe function
 */
export const subscribeToGalleryImages = (
  callback: (images: GalleryImage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const imagesRef = collection(db, GALLERY_IMAGES_COLLECTION);
    const q = query(imagesRef, orderBy('order', 'asc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const images: GalleryImage[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          images.push({
            id: docSnapshot.id,
            url: data.url || '',
            publicId: data.publicId || '',
            order: data.order || 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });
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

