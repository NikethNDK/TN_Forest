/**
 * Admin Order Detail Page
 * 
 * Displays order details and allows admin to accept or decline orders
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { getOrderById, updateOrderStatus } from '../../services/firebase/orderService';
import { sendOrderAcceptedEmail } from '../../services/emailService';
import type { CheckoutOrder } from '../../types';
import { Timestamp } from 'firebase/firestore';

const AdminOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        const fetchedOrder = await getOrderById(orderId);
        if (!fetchedOrder) {
          setError('Order not found');
        } else {
          setOrder(fetchedOrder);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore Timestamp
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
      });
    }
    
    // Handle regular Date or timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  const handleAcceptOrder = async () => {
    if (!order || !orderId) return;
    
    setIsProcessing(true);
    setActionMessage(null);

    try {
      // Update order status in Firestore
      await updateOrderStatus(orderId, 'accepted');

      // Send confirmation email to user
      const emailResult = await sendOrderAcceptedEmail({
        orderId,
        items: order.items,
        totalAmount: order.totalAmount,
        deliveryDetails: order.deliveryDetails,
        transactionId: order.transactionId,
        orderDate: formatDate(order.createdAt),
      });

      if (emailResult.success) {
        setActionMessage({ type: 'success', message: 'Order accepted and confirmation email sent to customer!' });
      } else {
        setActionMessage({ type: 'success', message: 'Order accepted but email notification failed. Please contact customer manually.' });
      }

      // Redirect to admin home after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      console.error('Error accepting order:', err);
      setActionMessage({ type: 'error', message: 'Failed to accept order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineOrder = async () => {
    if (!order || !orderId) return;
    
    setIsProcessing(true);
    setActionMessage(null);

    try {
      // Update order status in Firestore
      await updateOrderStatus(orderId, 'declined');

      setActionMessage({ type: 'success', message: 'Order declined. Refund will be processed within 2-3 business days.' });

      // Redirect to admin home after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      console.error('Error declining order:', err);
      setActionMessage({ type: 'error', message: 'Failed to decline order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const { deliveryDetails, items, totalAmount, transactionId, status, createdAt } = order;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-green-700 hover:text-green-800 font-medium mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Package className="h-7 w-7 mr-3 text-green-600" />
          Order Details
        </h1>
        <p className="text-gray-500 mt-1">Order ID: <span className="font-mono font-semibold">{orderId}</span></p>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            actionMessage.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          {actionMessage.message}
        </div>
      )}

      {/* Order Status Badge */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'accepted'
              ? 'bg-green-100 text-green-800'
              : status === 'declined'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className="ml-4 text-sm text-gray-500">
          Placed on: {formatDate(createdAt)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-green-600" />
            Customer Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{deliveryDetails.name}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{deliveryDetails.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{deliveryDetails.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="font-medium text-gray-800">
                  {deliveryDetails.address}<br />
                  {deliveryDetails.city}, {deliveryDetails.state} - {deliveryDetails.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-green-600" />
            Payment Details
          </h2>
          
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700 font-medium mb-1">Transaction ID</p>
              <p className="font-mono text-lg font-bold text-amber-900">{transactionId}</p>
              <p className="text-xs text-amber-600 mt-2">
                Please verify this transaction in your UPI/Bank app
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-green-800">₹{totalAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-green-600" />
          Order Items ({items.length})
        </h2>
        
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <div key={item.id || index} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{item.imageIcon || '🌿'}</span>
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} {item.unit} × ₹{item.price}
                  </p>
                </div>
              </div>
              <p className="font-bold text-green-700">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-green-700">₹{totalAmount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {status === 'pending' && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleAcceptOrder}
            disabled={isProcessing}
            className="flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            Accept Order
          </button>
          
          <button
            onClick={handleDeclineOrder}
            disabled={isProcessing}
            className="flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            Decline Order
          </button>
        </div>
      )}

      {/* Already processed message */}
      {status !== 'pending' && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            This order has already been {status}. No further action required.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetail;
