/**
 * Publication Categories Service
 * 
 * Handles all Firestore operations for publication categories
 * Categories are stored in a single document with an array field
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const CATEGORIES_DOC_ID = 'categories';
const CATEGORIES_COLLECTION = 'publicationCategories';

/**
 * Get all categories
 */
export const getCategories = async (): Promise<string[]> => {
  try {
    const categoriesRef = doc(db, CATEGORIES_COLLECTION, CATEGORIES_DOC_ID);
    const docSnapshot = await getDoc(categoriesRef);
    
    if (!docSnapshot.exists()) {
      // Initialize with default categories if document doesn't exist
      const defaultCategories = ['Research Paper', 'Technical Report', 'Annual Report', 'Policy Document'];
      await setDoc(categoriesRef, {
        categories: defaultCategories,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return defaultCategories;
    }
    
    const data = docSnapshot.data();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

/**
 * Add a new category
 */
export const addCategory = async (category: string): Promise<string[]> => {
  try {
    const categoriesRef = doc(db, CATEGORIES_COLLECTION, CATEGORIES_DOC_ID);
    const docSnapshot = await getDoc(categoriesRef);
    
    let currentCategories: string[] = [];
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      currentCategories = data.categories || [];
    }
    
    // Check if category already exists
    if (currentCategories.includes(category.trim())) {
      return currentCategories;
    }
    
    // Add new category
    const updatedCategories = [...currentCategories, category.trim()];
    
    if (docSnapshot.exists()) {
      await updateDoc(categoriesRef, {
        categories: updatedCategories,
        updatedAt: Timestamp.now()
      });
    } else {
      await setDoc(categoriesRef, {
        categories: updatedCategories,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    return updatedCategories;
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('Failed to add category');
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (category: string): Promise<string[]> => {
  try {
    const categoriesRef = doc(db, CATEGORIES_COLLECTION, CATEGORIES_DOC_ID);
    const docSnapshot = await getDoc(categoriesRef);
    
    if (!docSnapshot.exists()) {
      return [];
    }
    
    const data = docSnapshot.data();
    const currentCategories = data.categories || [];
    
    // Remove category
    const updatedCategories = currentCategories.filter((cat: string) => cat !== category);
    
    await updateDoc(categoriesRef, {
      categories: updatedCategories,
      updatedAt: Timestamp.now()
    });
    
    return updatedCategories;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};

