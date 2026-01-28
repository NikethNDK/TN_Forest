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
      <div className="mt-20 bg-white rounded-xl p-8 shadow-2xl border-t-4 border-lime-500">
        <div className="text-center mb-8">
          <FlaskConical className="h-12 w-12 text-lime-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-900 mb-2">
            Order Bio-Fertilizers
          </h2>
          <p className="text-gray-600">
            Place your order below for biofertilizers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-green-900 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-green-900 mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => updateFormField('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-green-900 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => updateFormField('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Fertilizer Selection */}
          <div>
            <label
              htmlFor="fertilizer"
              className="block text-sm font-semibold text-green-900 mb-2"
            >
              Select Bio-Fertilizer <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FlaskConical className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <select
                id="fertilizer"
                required
                value={formData.selectedFertilizer}
                onChange={(e) => updateFormField('selectedFertilizer', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700 appearance-none bg-white"
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
              <p className="mt-2 text-sm text-gray-600">
                {selectedFertilizerDetails.description}
              </p>
            )}
          </div>

          {/* Quantity Field */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-semibold text-green-900 mb-2"
            >
              Quantity <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="quantity"
                required
                value={formData.quantity}
                onChange={(e) => updateFormField('quantity', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
                placeholder="Enter quantity (e.g., 50 kgs, 100 liters)"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Please specify the quantity you need (in kgs or liters)
            </p>
          </div>

          {/* Transportation Radio Buttons */}
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-3">
              Do you need transportation? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-green-50 border-gray-200 hover:border-lime-500">
                <input
                  type="radio"
                  name="transportation"
                  value="yes"
                  checked={formData.transportation === 'yes'}
                  onChange={(e) => handleTransportationChange(e.target.value)}
                  className="mr-3 h-5 w-5 text-lime-600 focus:ring-lime-500"
                  required
                />
                <Truck className="h-5 w-5 mr-2 text-green-700" />
                <span className="font-medium text-green-900">
                  Yes, deliver to my address
                </span>
              </label>
              <label className="flex items-center p-4 border-2 rounded-lg cursor-not-allowed bg-gray-100 border-gray-200 opacity-60">
                <input
                  type="radio"
                  name="transportation"
                  value="no"
                  checked={formData.transportation === 'no'}
                  onChange={(e) => handleTransportationChange(e.target.value)}
                  className="mr-3 h-5 w-5 text-gray-400"
                  disabled
                />
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                <span className="font-medium text-gray-500">No, I'll pick it up</span>
                <span className="ml-2 text-xs text-gray-400">(Coming soon)</span>
              </label>
            </div>
          </div>

          {/* Address Field */}
          {formData.transportation && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-green-900 mb-2"
                >
                  {formData.transportation === 'yes'
                    ? 'Delivery Address'
                    : 'Your Address (for finding nearest location)'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => updateFormField('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700 resize-none"
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
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-green-900">
                      Nearest Pickup Location:
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-800 mb-1">
                    {nearestLocation.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{nearestLocation.address}</p>
                  <p className="text-sm text-gray-600">
                    Distance: Approximately {nearestLocation.distance}
                  </p>
                </div>
              )}

              {/* Delivery Confirmation */}
              {formData.address && formData.transportation === 'yes' && (
                <div className="p-4 rounded-lg bg-lime-50 border border-lime-200">
                  <p className="text-sm text-gray-700">
                    <strong className="text-green-900">Delivery will be arranged</strong>{' '}
                    upon order confirmation. Our team will contact you to finalize
                    delivery details and pricing.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Order Summary */}
          {formData.selectedFertilizer && formData.quantity && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Product:</span>
                  <span className="font-medium text-green-900">
                    {selectedFertilizerDetails?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Quantity:</span>
                  <span className="font-medium text-green-900">{formData.quantity}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-green-200">
                  <p className="text-xs text-gray-600 italic">
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
                  ? 'bg-lime-500 hover:bg-lime-600 text-green-900'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Place Order
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white p-6 rounded-xl shadow-2xl z-50 max-w-md animate-slideUp border-l-4 border-lime-400">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Order Received Successfully!</h3>
              <p className="text-green-50 mb-2">
                Thank you for your order. Our team has received your request and will
                be contacting you soon to discuss pricing and delivery details.
              </p>
              <p className="text-green-50 text-sm">
                We'll reach out to you at <strong>{formData.email}</strong> or{' '}
                <strong>{formData.phone}</strong> within 2-3 business days.
              </p>
            </div>
            <button
              onClick={closeToast}
              className="ml-4 text-white hover:text-green-200 transition-colors"
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
