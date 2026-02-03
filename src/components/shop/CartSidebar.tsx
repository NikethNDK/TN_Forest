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
      <div className="bg-background-paper rounded-xl shadow-2xl p-6 border-t-4 border-card-borderAccent max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
        <h2 className="text-2xl font-bold text-content-heading mb-6 flex items-center border-b pb-4 border-border-lightest">
          <ShoppingCart className="h-6 w-6 mr-3 text-accent-darker" />
          Your Order ({getCartItemCount()})
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-10 bg-primary-lightest rounded-lg">
            <Sprout className="h-10 w-10 text-primary-main mx-auto mb-4" />
            <p className="text-primary-main font-medium">
              Start your green journey by adding items!
            </p>
          </div>
        ) : (
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-border-lightest pb-3 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-content-headingSecondary text-sm flex-1 pr-2 line-clamp-2">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-status-error-main hover:text-status-error-dark p-1 rounded-full hover:bg-status-error-lightest transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-background-muted p-1 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-border-light flex items-center justify-center hover:bg-border-default transition-colors disabled:opacity-50"
                        disabled={item.quantity === 1}
                      >
                        <Minus className="h-3 w-3 text-content-primary" />
                      </button>
                      <span className="text-sm font-bold text-content-heading min-w-[3rem] text-center">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-accent-dark flex items-center justify-center hover:bg-accent-darker transition-colors"
                      >
                        <Plus className="h-3 w-3 text-interactive-secondaryText" />
                      </button>
                    </div>
                    <span className="text-lg font-extrabold text-primary-main">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border-light pt-5 mt-5">
              <div className="flex justify-between items-center mb-5">
                <span className="text-xl font-semibold text-content-heading">Order Total:</span>
                <span className="text-3xl font-extrabold text-accent-darker">
                  ₹{getTotalPrice()}
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-interactive-secondaryDefault hover:bg-interactive-secondaryHover text-interactive-secondaryText py-3 rounded-lg font-bold transition-colors duration-300 shadow-md text-lg flex items-center justify-center"
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
