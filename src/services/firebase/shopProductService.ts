/**
 * Shop Products Service
 * 
 * Handles all Firestore operations for shop products (Seeds & Bio Fertilizers)
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
  Timestamp,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { ShopProduct } from '../../types';
import { deleteImageFromCloudinary } from '../admin/fileUploadService';

const SHOP_PRODUCTS_COLLECTION = 'shopProducts';

/**
 * Transform Firestore document data to ShopProduct
 */
const transformDocumentToShopProduct = (docId: string, data: any): ShopProduct => {
  return {
    id: docId,
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    category: data.category || 'Seeds',
    stock: data.stock || 0,
    unit: data.unit || 'packets',
    imageUrl: data.imageUrl || undefined,
    imagePublicId: data.imagePublicId || undefined,
    imageIcon: data.imageIcon || undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

/**
 * Get all shop products, ordered by name
 */
export const getAllShopProducts = async (): Promise<ShopProduct[]> => {
  try {
    const productsRef = collection(db, SHOP_PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const products: ShopProduct[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      products.push(transformDocumentToShopProduct(docSnapshot.id, data));
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching shop products:', error);
    throw new Error('Failed to fetch shop products');
  }
};

/**
 * Get shop products by category
 */
export const getShopProductsByCategory = async (category: 'Seeds' | 'Bio Fertilizers'): Promise<ShopProduct[]> => {
  try {
    const productsRef = collection(db, SHOP_PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('category', '==', category),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const products: ShopProduct[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      products.push(transformDocumentToShopProduct(docSnapshot.id, data));
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching shop products by category:', error);
    throw new Error('Failed to fetch shop products by category');
  }
};

/**
 * Get a single shop product by ID
 */
export const getShopProductById = async (id: string): Promise<ShopProduct | null> => {
  try {
    const productRef = doc(db, SHOP_PRODUCTS_COLLECTION, id);
    const docSnapshot = await getDoc(productRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    return transformDocumentToShopProduct(docSnapshot.id, data);
  } catch (error) {
    console.error('Error fetching shop product:', error);
    throw new Error('Failed to fetch shop product');
  }
};

/**
 * Add a new shop product
 */
export const addShopProduct = async (
  product: Omit<ShopProduct, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const productsRef = collection(db, SHOP_PRODUCTS_COLLECTION);
    const newProduct: any = {
      name: product.name.trim(),
      description: product.description.trim(),
      price: product.price,
      category: product.category,
      stock: product.stock,
      unit: product.unit.trim(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add optional image fields
    if (product.imageUrl) {
      newProduct.imageUrl = product.imageUrl.trim();
    }
    if (product.imagePublicId) {
      newProduct.imagePublicId = product.imagePublicId.trim();
    }
    if (product.imageIcon) {
      newProduct.imageIcon = product.imageIcon.trim();
    }
    
    const docRef = await addDoc(productsRef, newProduct);
    return docRef.id;
  } catch (error) {
    console.error('Error adding shop product:', error);
    throw new Error('Failed to add shop product');
  }
};

/**
 * Add multiple shop products in a batch
 */
export const addShopProductsBatch = async (
  products: Omit<ShopProduct, 'id' | 'createdAt' | 'updatedAt'>[]
): Promise<number> => {
  try {
    const batch = writeBatch(db);
    const productsRef = collection(db, SHOP_PRODUCTS_COLLECTION);
    
    products.forEach((product) => {
      const docRef = doc(productsRef);
      const newProduct: any = {
        name: product.name.trim(),
        description: product.description.trim(),
        price: product.price,
        category: product.category,
        stock: product.stock,
        unit: product.unit.trim(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      if (product.imageUrl) {
        newProduct.imageUrl = product.imageUrl.trim();
      }
      if (product.imagePublicId) {
        newProduct.imagePublicId = product.imagePublicId.trim();
      }
      if (product.imageIcon) {
        newProduct.imageIcon = product.imageIcon.trim();
      }
      
      batch.set(docRef, newProduct);
    });
    
    await batch.commit();
    return products.length;
  } catch (error) {
    console.error('Error adding shop products batch:', error);
    throw new Error('Failed to add shop products batch');
  }
};

/**
 * Update a shop product
 */
export const updateShopProduct = async (
  id: string,
  updates: Partial<Omit<ShopProduct, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const productRef = doc(db, SHOP_PRODUCTS_COLLECTION, id);
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
    
    await updateDoc(productRef, updateData);
  } catch (error) {
    console.error('Error updating shop product:', error);
    throw new Error('Failed to update shop product');
  }
};

/**
 * Update product stock
 */
export const updateProductStock = async (id: string, stock: number): Promise<void> => {
  try {
    const productRef = doc(db, SHOP_PRODUCTS_COLLECTION, id);
    await updateDoc(productRef, {
      stock,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw new Error('Failed to update product stock');
  }
};

/**
 * Delete a shop product
 * Also attempts to delete image from Cloudinary if it exists
 */
export const deleteShopProduct = async (id: string, imagePublicId?: string): Promise<{ cloudinaryDeleted: boolean; error?: string }> => {
  try {
    // Try to delete image from Cloudinary first if it exists
    if (imagePublicId) {
      const cloudinaryResult = await deleteImageFromCloudinary(imagePublicId);
      
      if (!cloudinaryResult.success) {
        console.warn('Failed to delete image from Cloudinary:', cloudinaryResult.error);
        // Continue with Firestore deletion anyway
      }
    }
    
    // Delete from Firestore
    const productRef = doc(db, SHOP_PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
    
    return { cloudinaryDeleted: !imagePublicId || true };
  } catch (error) {
    console.error('Error deleting shop product:', error);
    throw new Error('Failed to delete shop product');
  }
};

/**
 * Subscribe to real-time updates of all shop products
 */
export const subscribeToShopProducts = (
  callback: (products: ShopProduct[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const productsRef = collection(db, SHOP_PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('name', 'asc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const products: ShopProduct[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          products.push(transformDocumentToShopProduct(docSnapshot.id, data));
        });
        callback(products);
      },
      (error) => {
        console.error('Error in shop products subscription:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up shop products subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to subscribe to shop products'));
    }
    return () => {};
  }
};

/**
 * Subscribe to real-time updates of shop products by category
 */
export const subscribeToShopProductsByCategory = (
  category: 'Seeds' | 'Bio Fertilizers',
  callback: (products: ShopProduct[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const productsRef = collection(db, SHOP_PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('category', '==', category),
      orderBy('name', 'asc')
    );
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const products: ShopProduct[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          products.push(transformDocumentToShopProduct(docSnapshot.id, data));
        });
        callback(products);
      },
      (error) => {
        console.error('Error in shop products by category subscription:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up shop products by category subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to subscribe to shop products by category'));
    }
    return () => {};
  }
};

/**
 * Check if a product is in stock
 */
export const isProductInStock = (product: ShopProduct): boolean => {
  return product.stock > 0;
};

/**
 * Format stock display string
 */
export const formatStock = (product: ShopProduct): string => {
  if (product.stock <= 0) {
    return 'Out of stock';
  }
  return `${product.stock} ${product.unit}`;
};
