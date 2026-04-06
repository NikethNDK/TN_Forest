/**
 * useFertilizerOrderForm Hook
 * 
 * Manages fertilizer order form state and submission
 */

import { useState, useCallback } from 'react';
import { createCustomOrder } from '../services/api/shopApi';
import type { FertilizerOrderFormData, PickupLocation, ShopProduct } from '../types';
import { groupProductsByCatalogId, pickDefaultListing } from '../utils/shopCatalogGroups';

// Default pickup locations (research centers)
const PICKUP_LOCATIONS: PickupLocation[] = [
  { name: 'Thoppur Modern Nursery Centre', address: 'Thoppur RF, Dharmapuri', distance: '5 km' },
  { name: 'Harur Modern Nursery Centre', address: 'Harur RF, Dharmapuri', distance: '8 km' },
  { name: 'Kalamavoor Modern Nursery Centre', address: 'Kalamavoor Patthai RF, Pudukottai', distance: '12 km' },
  { name: 'Valkaradu Modern Nursery Centre', address: 'Valkaradu RF, Theni', distance: '15 km' },
  { name: 'Alwarmalai Modern Nursery Centre', address: 'Alwarmalai RF, Villupuram', distance: '20 km' },
];

const INITIAL_FORM_DATA: FertilizerOrderFormData = {
  name: '',
  email: '',
  phone: '',
  selectedProductId: '',
  selectedFertilizer: '',
  quantity: '',
  transportation: '',
  address: '',
};

/**
 * Data passed to checkout from fertilizer order form
 */
export interface FertilizerCheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  product: ShopProduct;
  quantity: number;
}

export interface UseFertilizerOrderFormOptions {
  onCheckout?: (data: FertilizerCheckoutData) => void;
  availableFertilizers?: ShopProduct[];
}

export interface UseFertilizerOrderFormReturn {
  formData: FertilizerOrderFormData;
  showToast: boolean;
  nearestLocation: PickupLocation | null;
  locations: PickupLocation[];
  updateFormField: <K extends keyof FertilizerOrderFormData>(
    field: K, 
    value: FertilizerOrderFormData[K]
  ) => void;
  handleTransportationChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  closeToast: () => void;
  isFormValid: () => boolean;
}

export const useFertilizerOrderForm = (options?: UseFertilizerOrderFormOptions): UseFertilizerOrderFormReturn => {
  const [formData, setFormData] = useState<FertilizerOrderFormData>(INITIAL_FORM_DATA);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [nearestLocation, setNearestLocation] = useState<PickupLocation | null>(null);

  const updateFormField = useCallback(<K extends keyof FertilizerOrderFormData>(
    field: K, 
    value: FertilizerOrderFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTransportationChange = useCallback((value: string): void => {
    setFormData(prev => ({ ...prev, transportation: value, address: '' }));
    setNearestLocation(null);
    
    if (value === 'no') {
      // Find nearest location (mock - just use first location)
      setNearestLocation(PICKUP_LOCATIONS[0]);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validate form
    const { name, email, phone, selectedFertilizer, quantity, transportation, address } = formData;
    if (!name || !email || !phone || !selectedFertilizer || !quantity || !transportation || !address) {
      alert('Please fill in all required fields');
      return;
    }

    // Parse quantity (extract number from string like "50 kgs")
    const quantityNum = parseInt(quantity.replace(/\D/g, ''), 10) || 1;

    // If onCheckout callback is provided, use it to redirect to checkout
    if (options?.onCheckout && options.availableFertilizers) {
      const selectedProduct = options.availableFertilizers.find(f => f.id === selectedFertilizer);
      
      if (selectedProduct) {
        options.onCheckout({
          name,
          email,
          phone,
          address,
          product: selectedProduct,
          quantity: quantityNum,
        });
        
        // Reset form
        setFormData(INITIAL_FORM_DATA);
        setNearestLocation(null);
        return;
      }
    }

    // Submit to backend so admin receives email; then show toast
    const productName = options?.availableFertilizers?.find(f => f.id === selectedFertilizer)?.name ?? selectedFertilizer;
    const itemsSummary = `Product: ${productName}\nQuantity: ${quantity}\nTransport: ${transportation}\nAddress: ${address}`;
    const details = `Bio-fertilizer order request. ${transportation === 'yes' ? 'Customer needs delivery.' : 'Customer will pick up.'}`;
    try {
      await createCustomOrder({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        details,
        items_summary: itemsSummary,
      });
    } catch (err) {
      console.error('Failed to submit custom order:', err);
      alert('Submission failed. Please try again or contact us directly.');
      return;
    }

    setShowToast(true);
    setTimeout(() => {
      setFormData(INITIAL_FORM_DATA);
      setNearestLocation(null);
    }, 5000);
    setTimeout(() => setShowToast(false), 5000);
  }, [formData, options]);

  const closeToast = useCallback((): void => {
    setShowToast(false);
  }, []);

  const isFormValid = useCallback((): boolean => {
    const { name, email, phone, selectedFertilizer, quantity, transportation, address } = formData;
    return !!(name && email && phone && selectedFertilizer && quantity && transportation && address);
  }, [formData]);

  return {
    formData,
    showToast,
    nearestLocation,
    locations: PICKUP_LOCATIONS,
    updateFormField,
    handleTransportationChange,
    handleSubmit,
    closeToast,
    isFormValid,
  };
};

export default useFertilizerOrderForm;
