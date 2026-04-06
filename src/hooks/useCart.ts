/**
 * useCart Hook
 * 
 * Manages shopping cart state and operations with localStorage persistence
 */

import { useState, useCallback, useEffect } from 'react';
import type { ShopProduct, CartItem } from '../types';
import { clampCartQuantity, roundCartQty } from '../utils/cartQuantity';

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
  replaceCart: (items: CartItem[]) => void;
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
    if (!product.id) {
      console.error('Cannot add product without ID to cart');
      return;
    }
    const maxStock = product.stock;
    if (maxStock <= 0) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        const nextQty = clampCartQuantity(existingItem.quantity + 1, maxStock);
        if (nextQty <= 0) return prevCart;
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      const startQty = clampCartQuantity(Math.min(1, maxStock), maxStock);
      if (startQty <= 0) return prevCart;
      return [...prevCart, { ...product, id: product.id, quantity: startQty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string): void => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number): void => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (!item) return prevCart;
      const maxStock = item.stock;
      const clamped = clampCartQuantity(newQuantity, maxStock);
      if (clamped <= 0) {
        return prevCart.filter((i) => i.id !== productId);
      }
      return prevCart.map((i) =>
        i.id === productId ? { ...i, quantity: roundCartQty(clamped) } : i
      );
    });
  }, []);

  const clearCart = useCallback((): void => {
    setCart([]);
  }, []);

  const replaceCart = useCallback((items: CartItem[]): void => {
    setCart(Array.isArray(items) ? items : []);
  }, []);

  const getTotalPrice = useCallback((): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  /** Sum of line quantities (kg); can be fractional. */
  const getCartItemCount = useCallback((): number => {
    return roundCartQty(cart.reduce((total, item) => total + item.quantity, 0));
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    replaceCart,
    getTotalPrice,
    getCartItemCount,
  };
};

export default useCart;
