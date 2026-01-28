/**
 * useCart Hook
 * 
 * Manages shopping cart state and operations with localStorage persistence
 */

import { useState, useCallback, useEffect } from 'react';
import type { ShopProduct, CartItem } from '../types';

const CART_STORAGE_KEY = 'tnforest_shop_cart';

/**
 * Load cart from localStorage
 */
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that it's an array
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return [];
};

/**
 * Save cart to localStorage
 */
const saveCartToStorage = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export interface UseCartReturn {
  cart: CartItem[];
  addToCart: (product: ShopProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartItemCount: () => number;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage());

  // Save to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = useCallback((product: ShopProduct): void => {
    // Ensure product has an id before adding to cart
    if (!product.id) {
      console.error('Cannot add product without ID to cart');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, id: product.id, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string): void => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number): void => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  }, []);

  const clearCart = useCallback((): void => {
    setCart([]);
  }, []);

  const getTotalPrice = useCallback((): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const getCartItemCount = useCallback((): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartItemCount,
  };
};

export default useCart;
