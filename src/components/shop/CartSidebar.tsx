/**
 * CartSidebar Component
 * 
 * Displays the shopping cart as a floating sidebar
 */

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Sprout, ArrowRight } from 'lucide-react';
import type { CartItem } from '../../types';

interface CartSidebarProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  cartButtonRef: React.RefObject<HTMLButtonElement | null>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  getTotalPrice: () => number;
  getCartItemCount: () => number;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  isOpen,
  onClose,
  cartButtonRef,
  removeFromCart,
  updateQuantity,
  getTotalPrice,
  getCartItemCount,
}) => {
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);

  const handleCheckout = (): void => {
    onClose();
    navigate('/checkout');
  };

  // Outside Click Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, cartButtonRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={cartRef}
      className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] z-50 animate-slideIn"
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 border-t-4 border-lime-500 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
        <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center border-b pb-4 border-gray-100">
          <ShoppingCart className="h-6 w-6 mr-3 text-lime-600" />
          Your Order ({getCartItemCount()})
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-10 bg-green-50 rounded-lg">
            <Sprout className="h-10 w-10 text-green-500 mx-auto mb-4" />
            <p className="text-green-700 font-medium">
              Start your green journey by adding items!
            </p>
          </div>
        ) : (
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-100 pb-3 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-green-800 text-sm flex-1 pr-2 line-clamp-2">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                        disabled={item.quantity === 1}
                      >
                        <Minus className="h-3 w-3 text-gray-700" />
                      </button>
                      <span className="text-sm font-bold text-green-900 min-w-[3rem] text-center">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-lime-500 flex items-center justify-center hover:bg-lime-600 transition-colors"
                      >
                        <Plus className="h-3 w-3 text-green-900" />
                      </button>
                    </div>
                    <span className="text-lg font-extrabold text-green-700">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-5 mt-5">
              <div className="flex justify-between items-center mb-5">
                <span className="text-xl font-semibold text-green-900">Order Total:</span>
                <span className="text-3xl font-extrabold text-lime-600">
                  ₹{getTotalPrice()}
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-lime-500 hover:bg-lime-600 text-green-900 py-3 rounded-lg font-bold transition-colors duration-300 shadow-md text-lg flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
