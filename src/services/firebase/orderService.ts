/**
 * Order Service
 * 
 * Handles all Firestore operations for orders
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { CheckoutOrder, CartItem, CheckoutDeliveryDetails } from '../../types';

const ORDERS_COLLECTION = 'orders';

/**
 * Transform Firestore document data to CheckoutOrder
 */
const transformDocumentToOrder = (docId: string, data: any): CheckoutOrder => {
  return {
    id: docId,
    items: data.items || [],
    totalAmount: data.totalAmount || 0,
    deliveryDetails: data.deliveryDetails || {},
    transactionId: data.transactionId || '',
    status: data.status || 'pending',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

/**
 * Create a new order with a specific ID
 */
export const createOrder = async (
  orderId: string,
  orderData: {
    items: CartItem[];
    totalAmount: number;
    deliveryDetails: CheckoutDeliveryDetails;
    transactionId: string;
  }
): Promise<CheckoutOrder> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    
    const newOrder = {
      ...orderData,
      status: 'pending' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(orderRef, newOrder);
    
    return {
      id: orderId,
      ...newOrder,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: string): Promise<CheckoutOrder | null> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnapshot = await getDoc(orderRef);
    
    if (!orderSnapshot.exists()) {
      return null;
    }
    
    return transformDocumentToOrder(orderSnapshot.id, orderSnapshot.data());
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: CheckoutOrder['status']
): Promise<void> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

/**
 * Get all orders (for admin)
 */
export const getAllOrders = async (): Promise<CheckoutOrder[]> => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders: CheckoutOrder[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      orders.push(transformDocumentToOrder(docSnapshot.id, data));
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};
