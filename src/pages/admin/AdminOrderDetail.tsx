/**
 * Admin Order Detail Page
 * 
 * Displays order details and allows admin to accept or decline orders
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { getOrderById, acceptOrder, declineOrder, getMe } from '../../services/api/shopApi';
import type { OrderFromApi } from '../../services/api/shopApi';

/** Map API order to UI shape (deliveryDetails, items with name/price/quantity/unit, orderNo). */
function mapOrderToDisplay(api: OrderFromApi) {
  const portion =
    api.portion_subtotal != null && api.portion_subtotal !== ''
      ? Number(api.portion_subtotal)
      : null;
  return {
    id: String(api.id),
    orderNo: api.order_no ?? `#${api.id}`,
    status: api.status,
    totalAmount: Number(api.total_amount),
    portionSubtotal: portion,
    transactionId: api.transaction_id,
    deliveryDetails: {
      name: api.delivery_name,
      email: api.delivery_email,
      phone: api.delivery_phone ?? '',
      address: api.delivery_address,
      city: api.delivery_city,
      state: api.delivery_state,
      pincode: api.delivery_pincode,
    },
    items: api.items.map((it) => ({
      id: it.id,
      name: it.product_name,
      quantity: it.quantity,
      unit: it.unit ?? '',
      price: Number(it.price),
      divisionName: it.division_name ?? undefined,
      imageIcon: undefined as string | undefined,
    })),
    createdAt: api.created_at,
  };
}

type OrderDisplay = ReturnType<typeof mapOrderToDisplay>;

const AdminOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [order, setOrder] = useState<OrderDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isMainAdmin, setIsMainAdmin] = useState(true);

  useEffect(() => {
    getMe()
      .then((me) => setIsMainAdmin(me.admin_type === 'main_admin'))
      .catch(() => setIsMainAdmin(false));
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      const id = orderId ? parseInt(orderId, 10) : NaN;
      if (!orderId || Number.isNaN(id)) {
        setError('Order ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        const apiOrder = await getOrderById(id);
        setOrder(mapOrderToDisplay(apiOrder));
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Order not found or failed to load.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatDate = (timestamp: string | undefined): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });
  };

  const handleAcceptOrder = async () => {
    if (!order || !orderId) return;
    const id = parseInt(orderId, 10);
    if (Number.isNaN(id)) return;
    
    setIsProcessing(true);
    setActionMessage(null);

    try {
      await acceptOrder(id);
      setActionMessage({ type: 'success', message: 'Order accepted and confirmation email sent to customer!' });
      const isFromEcoStore = location.pathname.startsWith('/admin/shop');
      setTimeout(() => navigate(isFromEcoStore ? '/admin/shop/orders/confirmed' : '/admin'), 2000);
    } catch (err) {
      console.error('Error accepting order:', err);
      setActionMessage({ type: 'error', message: 'Failed to accept order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineOrder = async () => {
    if (!order || !orderId) return;
    const id = parseInt(orderId, 10);
    if (Number.isNaN(id)) return;
    
    setIsProcessing(true);
    setActionMessage(null);

    try {
      await declineOrder(id);
      setActionMessage({ type: 'success', message: 'Order declined. Customer has been notified. Refund will be processed within 2-3 business days.' });
      const isFromEcoStore = location.pathname.startsWith('/admin/shop');
      setTimeout(() => navigate(isFromEcoStore ? '/admin/shop/orders/confirmed' : '/admin'), 2000);
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
    const backToEcoStore =
      isMainAdmin ? '/admin/shop/orders/requests' : '/admin/shop/orders/confirmed';
    const backTo = location.pathname.startsWith('/admin/shop') ? backToEcoStore : '/admin';
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(backTo)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {backTo.includes('/confirmed')
              ? 'Back to Confirmed orders'
              : backTo.includes('/shop')
                ? 'Back to Requested orders'
                : 'Back to Admin'}
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const { deliveryDetails, items, totalAmount, portionSubtotal, transactionId, status, createdAt, orderNo } = order;
  const displayPrimaryAmount = isMainAdmin ? totalAmount : portionSubtotal ?? totalAmount;

  const isFromEcoStore = location.pathname.startsWith('/admin/shop');
  const backHref = isFromEcoStore
    ? isMainAdmin && status === 'pending'
      ? '/admin/shop/orders/requests'
      : '/admin/shop/orders/confirmed'
    : '/admin';
  const backLabel = isFromEcoStore
    ? isMainAdmin && status === 'pending'
      ? 'Back to Requested orders'
      : 'Back to Confirmed orders'
    : 'Back to Dashboard';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(backHref)}
          className="flex items-center text-green-700 hover:text-green-800 font-medium mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {backLabel}
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Package className="h-7 w-7 mr-3 text-green-600" />
          Order Details
        </h1>
        <p className="text-gray-500 mt-1">
          Order number: <span className="font-mono font-semibold text-gray-800">{orderNo}</span>
        </p>
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
              <p className="text-sm text-green-700 font-medium mb-1">
                {isMainAdmin ? 'Total amount' : "Your division's portion"}
              </p>
              <p className="text-3xl font-bold text-green-800">₹{displayPrimaryAmount}</p>
              {!isMainAdmin && portionSubtotal != null && (
                <p className="text-xs text-gray-500 mt-2">
                  Full order total (all divisions): ₹{totalAmount}
                </p>
              )}
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
                  {item.divisionName && (
                    <p className="text-xs text-gray-500">Sold by: {item.divisionName}</p>
                  )}
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
          <span className="text-lg font-semibold text-gray-800">
            {isMainAdmin ? 'Total' : 'Your portion'}
          </span>
          <span className="text-2xl font-bold text-green-700">₹{displayPrimaryAmount}</span>
        </div>
      </div>

      {/* Action Buttons — main admin only; division admin sees scoped lines only */}
      {status === 'pending' && isMainAdmin && (
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
