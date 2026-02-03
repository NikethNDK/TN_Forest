/**
 * BioFertilizerOrderForm Component
 * 
 * Form for ordering bio-fertilizers with delivery/pickup options
 */

import React from 'react';
import {
  FlaskConical,
  Mail,
  MapPin,
  Truck,
  X,
  CheckCircle,
  User,
  Phone,
  Package,
} from 'lucide-react';
import type { ShopProduct, FertilizerOrderFormData, PickupLocation } from '../../types';

interface BioFertilizerOrderFormProps {
  formData: FertilizerOrderFormData;
  showToast: boolean;
  nearestLocation: PickupLocation | null;
  availableFertilizers: ShopProduct[];
  updateFormField: <K extends keyof FertilizerOrderFormData>(
    field: K,
    value: FertilizerOrderFormData[K]
  ) => void;
  handleTransportationChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  closeToast: () => void;
  isFormValid: () => boolean;
}

const BioFertilizerOrderForm: React.FC<BioFertilizerOrderFormProps> = ({
  formData,
  showToast,
  nearestLocation,
  availableFertilizers,
  updateFormField,
  handleTransportationChange,
  handleSubmit,
  closeToast,
  isFormValid,
}) => {
  const selectedFertilizerDetails = availableFertilizers.find(
    (f) => f.id === formData.selectedFertilizer
  );

  return (
    <>
      <div className="mt-20 bg-background-paper rounded-xl p-8 shadow-2xl border-t-4 border-card-borderAccent">
        <div className="text-center mb-8">
          <FlaskConical className="h-12 w-12 text-accent-darker mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-content-heading mb-2">
            Order Bio-Fertilizers
          </h2>
          <p className="text-content-secondary">
            Place your order below for biofertilizers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-content-heading mb-2"
            >
              Full Name <span className="text-status-error-main">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-form-inputBorder rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus transition-shadow text-content-primary"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-content-heading mb-2"
            >
              Email Address <span className="text-status-error-main">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => updateFormField('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-form-inputBorder rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus transition-shadow text-content-primary"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-content-heading mb-2"
            >
              Phone Number <span className="text-status-error-main">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => updateFormField('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-form-inputBorder rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus transition-shadow text-content-primary"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Fertilizer Selection */}
          <div>
            <label
              htmlFor="fertilizer"
              className="block text-sm font-semibold text-content-heading mb-2"
            >
              Select Bio-Fertilizer <span className="text-status-error-main">*</span>
            </label>
            <div className="relative">
              <FlaskConical className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted z-10" />
              <select
                id="fertilizer"
                required
                value={formData.selectedFertilizer}
                onChange={(e) => updateFormField('selectedFertilizer', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-form-inputBorder rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus transition-shadow text-content-primary appearance-none bg-background-paper"
              >
                <option value="">-- Select a Bio-Fertilizer --</option>
                {availableFertilizers
                  .filter((f) => f.id)
                  .map((fertilizer) => (
                    <option key={fertilizer.id} value={fertilizer.id}>
                      {fertilizer.name}
                    </option>
                  ))}
              </select>
            </div>
            {selectedFertilizerDetails && (
              <p className="mt-2 text-sm text-content-secondary">
                {selectedFertilizerDetails.description}
              </p>
            )}
          </div>

          {/* Quantity Field */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-semibold text-content-heading mb-2"
            >
              Quantity <span className="text-status-error-main">*</span>
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
              <input
                type="text"
                id="quantity"
                required
                value={formData.quantity}
                onChange={(e) => updateFormField('quantity', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-form-inputBorder rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus transition-shadow text-content-primary"
                placeholder="Enter quantity (e.g., 50 kgs, 100 liters)"
              />
            </div>
            <p className="mt-1 text-xs text-content-tertiary">
              Please specify the quantity you need (in kgs or liters)
            </p>
          </div>

          {/* Transportation Radio Buttons */}
          <div>
            <label className="block text-sm font-semibold text-content-heading mb-3">
              Do you need transportation? <span className="text-status-error-main">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-primary-lightest border-border-light hover:border-card-borderAccent">
                <input
                  type="radio"
                  name="transportation"
                  value="yes"
                  checked={formData.transportation === 'yes'}
                  onChange={(e) => handleTransportationChange(e.target.value)}
                  className="mr-3 h-5 w-5 text-accent-darker focus:ring-form-inputFocus"
                  required
                />
                <Truck className="h-5 w-5 mr-2 text-primary-main" />
                <span className="font-medium text-content-heading">
                  Yes, deliver to my address
                </span>
              </label>
              <label className="flex items-center p-4 border-2 rounded-lg cursor-not-allowed bg-background-muted border-border-light opacity-60">
                <input
                  type="radio"
                  name="transportation"
                  value="no"
                  checked={formData.transportation === 'no'}
                  onChange={(e) => handleTransportationChange(e.target.value)}
                  className="mr-3 h-5 w-5 text-content-muted"
                  disabled
                />
                <MapPin className="h-5 w-5 mr-2 text-content-muted" />
                <span className="font-medium text-content-tertiary">No, I'll pick it up</span>
                <span className="ml-2 text-xs text-content-muted">(Coming soon)</span>
              </label>
            </div>
          </div>

          {/* Address Field */}
          {formData.transportation && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-content-heading mb-2"
                >
                  {formData.transportation === 'yes'
                    ? 'Delivery Address'
                    : 'Your Address (for finding nearest location)'}{' '}
                  <span className="text-status-error-main">*</span>
                </label>
                <textarea
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => updateFormField('address', e.target.value)}
                  className="w-full px-4 py-3 border border-form-inputBorder rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus transition-shadow text-content-primary resize-none"
                  rows={3}
                  placeholder={
                    formData.transportation === 'yes'
                      ? 'Enter your complete delivery address'
                      : 'Enter your address to find the nearest pickup location'
                  }
                />
              </div>

              {/* Nearest Location for Pickup */}
              {formData.address && formData.transportation === 'no' && nearestLocation && (
                <div className="p-4 rounded-lg bg-status-info-lightest border border-status-info-border">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-status-info-main mr-2" />
                    <span className="font-semibold text-content-heading">
                      Nearest Pickup Location:
                    </span>
                  </div>
                  <p className="text-lg font-bold text-status-info-text mb-1">
                    {nearestLocation.name}
                  </p>
                  <p className="text-sm text-content-secondary mb-2">{nearestLocation.address}</p>
                  <p className="text-sm text-content-secondary">
                    Distance: Approximately {nearestLocation.distance}
                  </p>
                </div>
              )}

              {/* Delivery Confirmation */}
              {formData.address && formData.transportation === 'yes' && (
                <div className="p-4 rounded-lg bg-accent-lightest border border-accent-lighter">
                  <p className="text-sm text-content-primary">
                    <strong className="text-content-heading">Delivery will be arranged</strong>{' '}
                    upon order confirmation. Our team will contact you to finalize
                    delivery details and pricing.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Order Summary */}
          {formData.selectedFertilizer && formData.quantity && (
            <div className="bg-primary-lightest border border-primary-lighter rounded-lg p-4">
              <h3 className="font-semibold text-content-heading mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-content-primary">Product:</span>
                  <span className="font-medium text-content-heading">
                    {selectedFertilizerDetails?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-primary">Quantity:</span>
                  <span className="font-medium text-content-heading">{formData.quantity}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-primary-lighter">
                  <p className="text-xs text-content-secondary italic">
                    Pricing will be provided by our team after reviewing your order
                    requirements.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors duration-300 shadow-lg ${
                isFormValid()
                  ? 'bg-interactive-secondaryDefault hover:bg-interactive-secondaryHover text-interactive-secondaryText'
                  : 'bg-interactive-disabled text-interactive-disabledText cursor-not-allowed'
              }`}
            >
              Place Order
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-primary-main text-content-inverse p-6 rounded-xl shadow-2xl z-50 max-w-md animate-slideUp border-l-4 border-card-borderAccent">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Order Received Successfully!</h3>
              <p className="text-content-inverseSecondary mb-2">
                Thank you for your order. Our team has received your request and will
                be contacting you soon to discuss pricing and delivery details.
              </p>
              <p className="text-content-inverseSecondary text-sm">
                We'll reach out to you at <strong>{formData.email}</strong> or{' '}
                <strong>{formData.phone}</strong> within 2-3 business days.
              </p>
            </div>
            <button
              onClick={closeToast}
              className="ml-4 text-content-inverse hover:text-content-inverseSecondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BioFertilizerOrderForm;
