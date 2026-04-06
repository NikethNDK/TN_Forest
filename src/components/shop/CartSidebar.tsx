/**
 * CartSidebar Component
 *
 * Displays the shopping cart as a floating sidebar
 */

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Sprout, ArrowRight } from 'lucide-react';
import type { CartItem } from '../../types';
import {
  CART_QTY_MIN,
  CART_QTY_STEP,
  formatCartMoney,
  formatCartQtyForDisplay,
} from '../../utils/cartQuantity';

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

const CartLineQuantity: React.FC<{
  item: CartItem;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}> = ({ item, updateQuantity, removeFromCart }) => {
  const [inputStr, setInputStr] = useState<string | null>(null);

  const atMax = item.quantity >= item.stock - 1e-6;

  const handleDec = (): void => {
    const next = roundCartQty(item.quantity - CART_QTY_STEP);
    if (next < CART_QTY_MIN - 1e-6) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, next);
    }
  };

  const handleInc = (): void => {
    updateQuantity(item.id, item.quantity + CART_QTY_STEP);
  };

  const displayValue =
    inputStr !== null ? inputStr : formatCartQtyForDisplay(item.quantity);

  return (
    <div className="flex items-center gap-2 bg-background-muted p-1 rounded-lg flex-1 min-w-0">
      <button
        type="button"
        onClick={handleDec}
        className="w-8 h-8 shrink-0 rounded-md bg-border-light flex items-center justify-center hover:bg-border-default transition-colors disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3 text-content-primary" />
      </button>
      <div className="flex items-center gap-1 min-w-0 flex-1 justify-center">
        <input
          type="number"
          min={CART_QTY_MIN}
          max={item.stock}
          step={0.01}
          inputMode="decimal"
          className="w-full min-w-[4rem] max-w-[5.5rem] text-sm font-bold text-content-heading text-center bg-background-paper border border-border-light rounded-md py-1 px-1 tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label={`Quantity in ${item.unit}`}
          value={displayValue}
          onFocus={() => setInputStr(formatCartQtyForDisplay(item.quantity))}
          onChange={(e) => {
            const raw = e.target.value;
            setInputStr(raw);
            if (raw === '' || raw === '.' || raw === '-') return;
            const v = parseFloat(raw.replace(',', '.'));
            if (!Number.isNaN(v)) {
              updateQuantity(item.id, v);
            }
          }}
          onBlur={() => {
            const raw = inputStr ?? formatCartQtyForDisplay(item.quantity);
            setInputStr(null);
            const v = parseFloat(String(raw).replace(',', '.'));
            if (!Number.isNaN(v)) {
              updateQuantity(item.id, v);
            }
          }}
        />
        <span className="text-xs text-content-muted shrink-0">{item.unit}</span>
      </div>
      <button
        type="button"
        onClick={handleInc}
        disabled={atMax}
        className="w-8 h-8 shrink-0 rounded-md bg-accent-dark flex items-center justify-center hover:bg-accent-darker transition-colors disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3 text-interactive-secondaryText" />
      </button>
    </div>
  );
};

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

  const totalKg = getCartItemCount();

  return (
    <div
      ref={cartRef}
      className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] z-50 animate-slideIn"
    >
      <div className="bg-background-paper rounded-xl shadow-2xl p-6 border-t-4 border-card-borderAccent max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
        <h2 className="text-2xl font-bold text-content-heading mb-6 flex items-center border-b pb-4 border-border-lightest">
          <ShoppingCart className="h-6 w-6 mr-3 text-accent-darker" />
          Your Order ({formatCartQtyForDisplay(totalKg)})
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
                    <div className="flex-1 pr-2 min-w-0">
                      <h4 className="font-semibold text-content-headingSecondary text-sm line-clamp-2">
                        {item.name}
                      </h4>
                      {item.divisionName && (
                        <p className="text-xs text-content-muted mt-0.5">
                          Supplier: {item.divisionName}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-status-error-main hover:text-status-error-dark p-1 rounded-full hover:bg-status-error-lightest transition-colors flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CartLineQuantity
                      item={item}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                    />
                    <span className="text-lg font-extrabold text-primary-main tabular-nums text-right shrink-0">
                      ₹{formatCartMoney(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border-light pt-5 mt-5">
              <div className="flex justify-between items-center mb-5">
                <span className="text-xl font-semibold text-content-heading">Order Total:</span>
                <span className="text-3xl font-extrabold text-accent-darker tabular-nums">
                  ₹{formatCartMoney(getTotalPrice())}
                </span>
              </div>
              <button
                type="button"
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
