/**
 * Checkout Page
 * 
 * Displays order summary, delivery details form, payment QR, and order placement
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Package,
  AlertCircle,
} from 'lucide-react';
import type { CheckoutDeliveryDetails } from '../types';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/api/shopApi';
import { formatCartMoney, formatCartQtyForDisplay } from '../utils/cartQuantity';

// ============ VALIDATION & SANITIZATION UTILITIES ============

/**
 * Sanitize string input - removes potentially dangerous characters
 */
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"`;(){}[\]]/g, '') // Remove dangerous characters
    .trim();
};

/**
 * Sanitize and limit text length
 */
const sanitizeText = (input: string, maxLength: number = 100): string => {
  return sanitizeInput(input).slice(0, maxLength);
};

/**
 * Validation patterns
 */
const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[6-9]\d{9}$/, // Indian mobile: starts with 6-9, 10 digits
  pincode: /^\d{6}$/, // Indian pincode: exactly 6 digits
  name: /^[a-zA-Z\s.'-]{2,100}$/, // Letters, spaces, dots, apostrophes, hyphens
  transactionId: /^[a-zA-Z0-9]{8,30}$/, // Alphanumeric, 8-30 chars
};

/**
 * Validation error messages
 */
const VALIDATION_MESSAGES = {
  name: 'Name must be 2-100 characters (letters, spaces, dots only)',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid 10-digit Indian mobile number',
  address: 'Address must be 5-500 characters',
  city: 'City must be 2-50 characters',
  state: 'State must be 2-50 characters',
  pincode: 'Please enter a valid 6-digit pincode',
  transactionId: 'Transaction ID must be 8-30 alphanumeric characters',
};

/**
 * Field validation type
 */
interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  transactionId?: string;
}

/**
 * Validate individual field
 */
const validateField = (field: keyof ValidationErrors, value: string): string | undefined => {
  const trimmedValue = value.trim();
  
  switch (field) {
    case 'name':
      if (!trimmedValue) return 'Name is required';
      if (!VALIDATION_PATTERNS.name.test(trimmedValue)) return VALIDATION_MESSAGES.name;
      break;
    case 'email':
      if (!trimmedValue) return 'Email is required';
      if (!VALIDATION_PATTERNS.email.test(trimmedValue)) return VALIDATION_MESSAGES.email;
      break;
    case 'phone':
      // Remove spaces, dashes, and +91 prefix for validation
      const cleanPhone = trimmedValue.replace(/[\s\-+]/g, '').replace(/^91/, '');
      if (!cleanPhone) return 'Phone number is required';
      if (!VALIDATION_PATTERNS.phone.test(cleanPhone)) return VALIDATION_MESSAGES.phone;
      break;
    case 'address':
      if (!trimmedValue) return 'Address is required';
      if (trimmedValue.length < 5 || trimmedValue.length > 500) return VALIDATION_MESSAGES.address;
      break;
    case 'city':
      if (!trimmedValue) return 'City is required';
      if (trimmedValue.length < 2 || trimmedValue.length > 50) return VALIDATION_MESSAGES.city;
      break;
    case 'state':
      if (!trimmedValue) return 'State is required';
      if (trimmedValue.length < 2 || trimmedValue.length > 50) return VALIDATION_MESSAGES.state;
      break;
    case 'pincode':
      if (!trimmedValue) return 'Pincode is required';
      if (!VALIDATION_PATTERNS.pincode.test(trimmedValue)) return VALIDATION_MESSAGES.pincode;
      break;
    case 'transactionId':
      if (!trimmedValue) return 'Transaction ID is required';
      const cleanTxnId = trimmedValue.replace(/[\s\-]/g, '');
      if (!VALIDATION_PATTERNS.transactionId.test(cleanTxnId)) return VALIDATION_MESSAGES.transactionId;
      break;
  }
  return undefined;
};

// ============ COMPONENT CONSTANTS ============

const INITIAL_DELIVERY_DETAILS: CheckoutDeliveryDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: 'Tamil Nadu',
  pincode: '',
};

// UPI Payment Details (customize these)
const PAYMENT_UPI_ID = 'forestconservation@sbi';
const PAYMENT_ACCOUNT_NAME = 'EM CUM DEPUTY CONSERVATOR';

/**
 * Location state interface for pre-filled data from fertilizer form
 */
interface LocationState {
  prefillData?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  fromFertilizerForm?: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, getTotalPrice, getCartItemCount, clearCart } = useCart();
  
  const [deliveryDetails, setDeliveryDetails] = useState<CheckoutDeliveryDetails>(INITIAL_DELIVERY_DETAILS);
  const [transactionId, setTransactionId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [orderNo, setOrderNo] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Pre-fill form data from navigation state (from fertilizer order form)
  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.prefillData) {
      setDeliveryDetails((prev) => ({
        ...prev,
        name: state.prefillData?.name || '',
        email: state.prefillData?.email || '',
        phone: state.prefillData?.phone || '',
        address: state.prefillData?.address || '',
      }));
    }
  }, [location.state]);

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/shop');
    }
  }, [cart, navigate, orderPlaced]);

  /**
   * Update delivery field with sanitization and validation
   */
  const updateDeliveryField = <K extends keyof CheckoutDeliveryDetails>(
    field: K,
    value: CheckoutDeliveryDetails[K]
  ): void => {
    // Sanitize input based on field type
    let sanitizedValue: string;
    if (field === 'address') {
      sanitizedValue = sanitizeText(value as string, 500);
    } else if (field === 'name') {
      sanitizedValue = sanitizeText(value as string, 100);
    } else if (field === 'email') {
      // Don't sanitize email too aggressively, just trim and limit
      sanitizedValue = (value as string).trim().slice(0, 100);
    } else if (field === 'phone') {
      // Allow only digits, spaces, +, and -
      sanitizedValue = (value as string).replace(/[^\d\s+\-]/g, '').slice(0, 15);
    } else if (field === 'pincode') {
      // Allow only digits
      sanitizedValue = (value as string).replace(/\D/g, '').slice(0, 6);
    } else {
      sanitizedValue = sanitizeText(value as string, 100);
    }

    setDeliveryDetails((prev) => ({ ...prev, [field]: sanitizedValue }));
    
    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field as keyof ValidationErrors, sanitizedValue);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  /**
   * Handle field blur - mark as touched and validate
   */
  const handleFieldBlur = (field: keyof ValidationErrors, value: string): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  /**
   * Handle transaction ID change with sanitization
   */
  const handleTransactionIdChange = (value: string): void => {
    // Allow only alphanumeric, spaces, and dashes
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s\-]/g, '').slice(0, 30);
    setTransactionId(sanitizedValue);
    
    if (touched.transactionId) {
      const error = validateField('transactionId', sanitizedValue);
      setErrors((prev) => ({ ...prev, transactionId: error }));
    }
  };

  /**
   * Validate all fields and check if form is valid
   */
  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate delivery details
    const fieldsToValidate: (keyof ValidationErrors)[] = [
      'name', 'email', 'phone', 'address', 'city', 'state', 'pincode'
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, deliveryDetails[field as keyof CheckoutDeliveryDetails] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate transaction ID
    const txnError = validateField('transactionId', transactionId);
    if (txnError) {
      newErrors.transactionId = txnError;
      isValid = false;
    }

    setErrors(newErrors);
    // Mark all fields as touched
    setTouched({
      name: true, email: true, phone: true, address: true,
      city: true, state: true, pincode: true, transactionId: true
    });

    return isValid;
  };

  /**
   * Check if form is valid (for button state)
   */
  const isFormValid = (): boolean => {
    const { name, email, phone, address, city, state, pincode } = deliveryDetails;
    
    // Basic check for non-empty fields
    const allFieldsFilled = !!(
      name.trim() &&
      email.trim() &&
      phone.trim() &&
      address.trim() &&
      city.trim() &&
      state.trim() &&
      pincode.trim() &&
      transactionId.trim()
    );

    // Check no validation errors exist
    const noErrors = Object.values(errors).every((error) => !error);

    return allFieldsFilled && noErrors;
  };

  const handlePlaceOrder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const totalAmount = getTotalPrice();

      const sanitizedDeliveryDetails = {
        name: sanitizeText(deliveryDetails.name, 100),
        email: deliveryDetails.email.trim().slice(0, 100),
        phone: deliveryDetails.phone.replace(/[^\d+\-\s]/g, '').slice(0, 15),
        address: sanitizeText(deliveryDetails.address, 500),
        city: sanitizeText(deliveryDetails.city, 50),
        state: sanitizeText(deliveryDetails.state, 50),
        pincode: deliveryDetails.pincode.replace(/\D/g, '').slice(0, 6),
      };

      const sanitizedTransactionId = transactionId.replace(/[^a-zA-Z0-9\-]/g, '').slice(0, 30);

      const order = await createOrder({
        items: cart.map((item) => ({
          listing_id: Number(item.id),
          quantity: item.quantity,
          unit: item.unit ?? '',
        })),
        total_amount: totalAmount.toFixed(2),
        delivery_name: sanitizedDeliveryDetails.name,
        delivery_email: sanitizedDeliveryDetails.email,
        delivery_phone: sanitizedDeliveryDetails.phone,
        delivery_address: sanitizedDeliveryDetails.address,
        delivery_city: sanitizedDeliveryDetails.city,
        delivery_state: sanitizedDeliveryDetails.state,
        delivery_pincode: sanitizedDeliveryDetails.pincode,
        transaction_id: sanitizedTransactionId,
      });

      setOrderId(String(order.id));
      setOrderNo(order.order_no ?? `#${order.id}`);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      // Log generic error without sensitive details
      console.error('Order placement failed');
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success View
  if (orderPlaced) {
    return (
      <div className="py-16 bg-background-page min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-background-paper rounded-xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-primary-main" />
            </div>
            <h1 className="text-3xl font-bold text-content-heading mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-content-secondary mb-6">
              Thank you for your order. We have received your payment details and will
              verify the transaction shortly.
            </p>
            
            <div className="bg-primary-lightest rounded-lg p-4 mb-6">
              <p className="text-sm text-content-secondary mb-1">Your order number</p>
              <p className="text-xl font-bold text-content-headingSecondary font-mono">{orderNo || orderId}</p>
              <p className="text-xs text-content-tertiary mt-1">Quote this for any support or queries.</p>
            </div>

            <div className="bg-status-info-lightest rounded-lg p-4 mb-8">
              <p className="text-sm text-content-primary">
                <strong>Transaction ID:</strong> {transactionId}
              </p>
              <p className="text-sm text-content-secondary mt-2">
                Our team will verify your payment and contact you at{' '}
                <strong>{deliveryDetails.email}</strong> or{' '}
                <strong>{deliveryDetails.phone}</strong> within 24-48 hours.
              </p>
            </div>

            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-interactive-primaryDefault text-interactive-primaryText rounded-lg font-semibold hover:bg-interactive-primaryHover transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="py-16 bg-background-page min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center text-primary-main hover:text-content-headingSecondary font-medium mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shop
          </button>
          <h1 className="text-3xl font-bold text-content-heading flex items-center">
            <ShoppingBag className="h-8 w-8 mr-3 text-accent-darker" />
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary & Delivery Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-background-paper rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-content-heading mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-accent-darker" />
                Order Summary ({formatCartQtyForDisplay(getCartItemCount())} total qty)
              </h2>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-border-lightest last:border-b-0"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{item.imageIcon || '🌿'}</span>
                      <div>
                        <p className="font-medium text-content-headingSecondary">{item.name}</p>
                        <p className="text-sm text-content-tertiary">
                          {formatCartQtyForDisplay(item.quantity)} {item.unit} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-primary-main tabular-nums">
                      ₹{formatCartMoney(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-light mt-4 pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-content-heading">Total Amount:</span>
                  <span className="text-2xl font-bold text-accent-darker tabular-nums">
                    ₹{formatCartMoney(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Details Form */}
            <div className="bg-background-paper rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-content-heading mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-accent-darker" />
                Delivery Details
              </h2>

              <form className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-content-heading mb-1">
                    Full Name <span className="text-status-error-main">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
                    <input
                      type="text"
                      value={deliveryDetails.name}
                      onChange={(e) => updateDeliveryField('name', e.target.value)}
                      onBlur={() => handleFieldBlur('name', deliveryDetails.name)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus ${
                        errors.name && touched.name ? 'border-status-error-main bg-status-error-lightest' : 'border-border-default'
                      }`}
                      placeholder="Enter your full name"
                      maxLength={100}
                      required
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-status-error-main text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-content-heading mb-1">
                      Email <span className="text-status-error-main">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
                      <input
                        type="email"
                        value={deliveryDetails.email}
                        onChange={(e) => updateDeliveryField('email', e.target.value)}
                        onBlur={() => handleFieldBlur('email', deliveryDetails.email)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus ${
                          errors.email && touched.email ? 'border-status-error-main bg-status-error-lightest' : 'border-border-default'
                        }`}
                        placeholder="your@email.com"
                        maxLength={100}
                        required
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-status-error-main text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-content-heading mb-1">
                      Phone <span className="text-status-error-main">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
                      <input
                        type="tel"
                        value={deliveryDetails.phone}
                        onChange={(e) => updateDeliveryField('phone', e.target.value)}
                        onBlur={() => handleFieldBlur('phone', deliveryDetails.phone)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus ${
                          errors.phone && touched.phone ? 'border-status-error-main bg-status-error-lightest' : 'border-border-default'
                        }`}
                        placeholder="9876543210"
                        maxLength={15}
                        required
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="text-status-error-main text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-content-heading mb-1">
                    Delivery Address <span className="text-status-error-main">*</span>
                  </label>
                  <textarea
                    value={deliveryDetails.address}
                    onChange={(e) => updateDeliveryField('address', e.target.value)}
                    onBlur={() => handleFieldBlur('address', deliveryDetails.address)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus resize-none ${
                      errors.address && touched.address ? 'border-status-error-main bg-status-error-lightest' : 'border-border-default'
                    }`}
                    rows={2}
                    placeholder="House/Flat No., Street, Landmark"
                    maxLength={500}
                    required
                  />
                  {errors.address && touched.address && (
                    <p className="text-status-error-main text-xs mt-1">{errors.address}</p>
                  )}
                </div>

                {/* City, State, Pincode Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-content-heading mb-1">
                      City <span className="text-status-error-main">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
                      <input
                        type="text"
                        value={deliveryDetails.city}
                        onChange={(e) => updateDeliveryField('city', e.target.value)}
                        onBlur={() => handleFieldBlur('city', deliveryDetails.city)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus ${
                          errors.city && touched.city ? 'border-status-error-main bg-status-error-lightest' : 'border-border-default'
                        }`}
                        placeholder="City"
                        maxLength={50}
                        required
                      />
                    </div>
                    {errors.city && touched.city && (
                      <p className="text-status-error-main text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-content-heading mb-1">
                      State <span className="text-status-error-main">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryDetails.state}
                      onChange={(e) => updateDeliveryField('state', e.target.value)}
                      onBlur={() => handleFieldBlur('state', deliveryDetails.state)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus ${
                        errors.state && touched.state ? 'border-status-error-main bg-status-error-lightest' : 'border-border-default'
                      }`}
                      placeholder="State"
                      maxLength={50}
                      required
                    />
                    {errors.state && touched.state && (
                      <p className="text-status-error-main text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-content-heading mb-1">
                      Pincode <span className="text-status-error-main">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryDetails.pincode}
                      onChange={(e) => updateDeliveryField('pincode', e.target.value)}
                      onBlur={() => handleFieldBlur('pincode', deliveryDetails.pincode)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus ${
                        errors.pincode && touched.pincode ? 'border-status-error-main bg-status-error-lightest' : 'border-border-default'
                      }`}
                      placeholder="600001"
                      maxLength={6}
                      required
                    />
                    {errors.pincode && touched.pincode && (
                      <p className="text-status-error-main text-xs mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            {/* Payment Section */}
            <div className="bg-background-paper rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-content-heading mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-accent-darker" />
                Payment
              </h2>

              {/* QR Code Section */}
              <div className="bg-gradient-to-br from-primary-lightest to-accent-lightest rounded-xl p-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-content-secondary mb-4">
                    Scan the QR code below to pay via UPI
                  </p>
                  
                  {/* QR Code Placeholder */}
                  <div className="inline-block bg-background-paper p-4 rounded-xl shadow-md mb-4">
                    {/* <div className="w-48 h-48 bg-background-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border-default">
                      <div className="text-center">
                        <QrCode className="h-16 w-16 text-content-muted mx-auto mb-2" />
                        <p className="text-xs text-content-tertiary">
                          QR Code
                        </p>
                      </div>
                    </div> */}
                      <img 
                        src="/QR_CODE.jpeg" 
                        alt="Payment QR Code" 
                        className="w-48 h-48"
                      />
                  </div>

                  <div className="bg-background-paper rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-content-tertiary">UPI ID</p>
                    <p className="font-mono font-bold text-content-headingSecondary">{PAYMENT_UPI_ID}</p>
                    <p className="text-xs text-content-tertiary mt-1">{PAYMENT_ACCOUNT_NAME}</p>
                  </div>
                </div>
              </div>

              {/* Amount to Pay */}
              <div className="bg-accent-lighter rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-content-heading">Amount to Pay:</span>
                  <span className="text-3xl font-bold text-content-headingSecondary tabular-nums">
                    ₹{formatCartMoney(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-content-heading mb-2">
                  Transaction ID / UTR Number <span className="text-status-error-main">*</span>
                </label>
                <p className="text-xs text-content-tertiary mb-2">
                  After making the payment, enter the Transaction ID or UTR number from your payment app (8-30 characters)
                </p>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => handleTransactionIdChange(e.target.value)}
                  onBlur={() => handleFieldBlur('transactionId', transactionId)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus font-mono ${
                    errors.transactionId && touched.transactionId ? 'border-status-error-main bg-status-error-lightest' : 'border-border-default'
                  }`}
                  placeholder="Enter Transaction ID"
                  maxLength={30}
                  required
                />
                {errors.transactionId && touched.transactionId && (
                  <p className="text-status-error-main text-xs mt-1">{errors.transactionId}</p>
                )}
              </div>

              {/* Info Alert */}
              <div className="bg-status-info-lightest border border-status-info-border rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-status-info-main mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-status-info-text">
                    <p className="font-semibold mb-1">Payment Verification</p>
                    <p>
                      Your order will be confirmed once we verify your payment. This usually
                      takes 24-48 hours. We'll contact you via email/phone once verified.
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                  isFormValid() && !isSubmitting
                    ? 'bg-interactive-secondaryDefault hover:bg-interactive-secondaryHover text-interactive-secondaryText shadow-lg hover:shadow-xl'
                    : 'bg-interactive-disabled text-interactive-disabledText cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
