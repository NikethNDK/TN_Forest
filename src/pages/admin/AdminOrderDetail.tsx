/**
 * Admin Order Detail Page
 *
 * Displays order details, line-level division decisions, and accept/decline actions.
 */

import React, { useCallback, useEffect, useState } from 'react';
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
import Modal from '../../components/admin/Modal';
import {
  getOrderById,
  acceptOrder,
  declineOrder,
  getMe,
  postOrderItemDecisions,
  postOrderItemFulfillment,
  postOrderItemRefunds,
  isShopApiError,
} from '../../services/api/shopApi';
import type {
  OrderDecisionRollup,
  OrderFromApi,
  OrderItemDecisionStatus,
  OrderItemFulfillmentStatus,
  OrderItemRefundStatus,
} from '../../services/api/shopApi';

function decisionRollupLabel(rollup: OrderDecisionRollup): string {
  switch (rollup) {
    case 'awaiting_decisions':
      return 'Awaiting line decisions';
    case 'fully_accepted':
      return 'All lines accepted';
    case 'fully_rejected':
      return 'All lines rejected';
    case 'partially_accepted':
      return 'Mixed accept / reject';
    default:
      return rollup;
  }
}

function decisionRollupBadgeClass(rollup: OrderDecisionRollup): string {
  switch (rollup) {
    case 'awaiting_decisions':
      return 'bg-yellow-100 text-yellow-800';
    case 'fully_accepted':
      return 'bg-green-100 text-green-800';
    case 'fully_rejected':
      return 'bg-red-100 text-red-800';
    case 'partially_accepted':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function itemDecisionLabel(s: OrderItemDecisionStatus): string {
  switch (s) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    default:
      return s;
  }
}

function fulfillmentLabel(s: OrderItemFulfillmentStatus): string {
  switch (s) {
    case 'not_started':
      return 'Not started';
    case 'shipped':
      return 'Shipped';
    case 'out_for_delivery':
      return 'Out for delivery';
    case 'delivered':
      return 'Delivered';
    default:
      return s;
  }
}

function refundLabel(s: OrderItemRefundStatus): string {
  switch (s) {
    case 'not_applicable':
      return 'Not applicable';
    case 'refund_pending':
      return 'Refund pending';
    case 'refunded':
      return 'Refunded';
    case 'refund_failed':
      return 'Refund failed';
    default:
      return s;
  }
}

/** Map API order to UI shape (deliveryDetails, items with name/price/quantity/unit, orderNo). */
function mapOrderToDisplay(api: OrderFromApi) {
  const portion =
    api.portion_subtotal != null && api.portion_subtotal !== ''
      ? Number(api.portion_subtotal)
      : null;
  const rollup = api.decision_rollup ?? 'awaiting_decisions';
  return {
    id: String(api.id),
    orderNo: api.order_no ?? `#${api.id}`,
    status: api.status,
    decisionRollup: rollup as OrderDecisionRollup,
    fulfillmentRollup: api.fulfillment_rollup ?? 'not_applicable',
    refundRollup: api.refund_rollup ?? 'not_applicable',
    totalAmount: Number(api.total_amount),
    portionSubtotal: portion,
    transactionId: api.transaction_id,
    paymentStatus: api.payment_status ?? null,
    paymentAmountAuthorizedPaise: api.payment_amount_authorized_paise ?? null,
    paymentAmountCapturedPaise: api.payment_amount_captured_paise ?? null,
    paymentAmountRefundedPaise: api.payment_amount_refunded_paise ?? null,
    paymentSafetyCaptured: api.payment_safety_captured ?? null,
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
      divisionId: it.division,
      divisionName: it.division_name ?? undefined,
      decisionStatus: (it.decision_status ?? 'pending') as OrderItemDecisionStatus,
      fulfillmentStatus: (it.fulfillment_status ?? 'not_started') as OrderItemFulfillmentStatus,
      refundStatus: (it.refund_status ?? 'not_applicable') as OrderItemRefundStatus,
      rejectionReason: (it.rejection_reason ?? '').trim() || undefined,
      refundReference: (it.refund_reference ?? '').trim() || undefined,
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
  const [submittingItemId, setSubmittingItemId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isMainAdmin, setIsMainAdmin] = useState(true);
  const [isDivisionAdmin, setIsDivisionAdmin] = useState(false);
  const [divisionIds, setDivisionIds] = useState<number[]>([]);
  const [rejectModalItemId, setRejectModalItemId] = useState<number | null>(null);
  const [rejectReasonDraft, setRejectReasonDraft] = useState('');

  useEffect(() => {
    getMe()
      .then((me) => {
        setIsMainAdmin(me.admin_type === 'main_admin');
        setIsDivisionAdmin(me.admin_type === 'division_admin');
        setDivisionIds(me.division_ids ?? []);
      })
      .catch(() => {
        setIsMainAdmin(false);
        setIsDivisionAdmin(false);
        setDivisionIds([]);
      });
  }, []);

  const refreshOrder = useCallback(async () => {
    const id = orderId ? parseInt(orderId, 10) : NaN;
    if (!orderId || Number.isNaN(id)) return;
    const apiOrder = await getOrderById(id);
    setOrder(mapOrderToDisplay(apiOrder));
  }, [orderId]);

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

  const canDecideItem = (item: OrderDisplay['items'][0]): boolean => {
    if (item.decisionStatus !== 'pending') return false;
    if (isMainAdmin) return true;
    return item.divisionId != null && divisionIds.includes(item.divisionId);
  };

  const canUpdateFulfillment = (item: OrderDisplay['items'][0]): boolean => {
    if (!isDivisionAdmin) return false;
    if (item.decisionStatus !== 'accepted') return false;
    return item.divisionId != null && divisionIds.includes(item.divisionId);
  };

  const canUpdateRefund = (item: OrderDisplay['items'][0]): boolean => {
    return isMainAdmin && item.decisionStatus === 'rejected';
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
      await refreshOrder();
      const isFromEcoStore = location.pathname.startsWith('/admin/shop');
      setTimeout(() => navigate(isFromEcoStore ? '/admin/shop/orders/confirmed' : '/admin'), 2000);
    } catch (err) {
      console.error('Error accepting order:', err);
      const msg = err instanceof Error ? err.message : 'Failed to accept order. Please try again.';
      if (msg.toLowerCase().includes('insufficient stock')) {
        setActionMessage({
          type: 'error',
          message: `Acceptance blocked: ${msg}`,
        });
      } else {
        setActionMessage({ type: 'error', message: msg });
      }
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
      await refreshOrder();
      const isFromEcoStore = location.pathname.startsWith('/admin/shop');
      setTimeout(() => navigate(isFromEcoStore ? '/admin/shop/orders/confirmed' : '/admin'), 2000);
    } catch (err) {
      console.error('Error declining order:', err);
      setActionMessage({ type: 'error', message: 'Failed to decline order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptItem = async (itemId: number) => {
    if (!orderId) return;
    const id = parseInt(orderId, 10);
    if (Number.isNaN(id)) return;
    setSubmittingItemId(itemId);
    setActionMessage(null);
    try {
      await postOrderItemDecisions(id, [{ item_id: itemId, decision: 'accepted' }]);
      setActionMessage({ type: 'success', message: 'Line item updated.' });
      await refreshOrder();
    } catch (err) {
      const rawMsg =
        isShopApiError(err) && err.status === 409
          ? 'This line was already decided. Refresh the page.'
          : err instanceof Error
            ? err.message
            : 'Failed to update line item.';
      const msg = rawMsg.toLowerCase().includes('insufficient stock')
        ? `Acceptance blocked: ${rawMsg}`
        : rawMsg;
      setActionMessage({ type: 'error', message: msg });
    } finally {
      setSubmittingItemId(null);
    }
  };

  const handleFulfillmentUpdate = async (itemId: number, fulfillmentStatus: OrderItemFulfillmentStatus) => {
    if (!orderId) return;
    const id = parseInt(orderId, 10);
    if (Number.isNaN(id)) return;
    setSubmittingItemId(itemId);
    setActionMessage(null);
    try {
      await postOrderItemFulfillment(id, [{ item_id: itemId, fulfillment_status: fulfillmentStatus }]);
      setActionMessage({ type: 'success', message: 'Fulfillment status updated.' });
      await refreshOrder();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update fulfillment.';
      setActionMessage({ type: 'error', message: msg });
    } finally {
      setSubmittingItemId(null);
    }
  };

  const openRejectModal = (itemId: number) => {
    setRejectReasonDraft('');
    setRejectModalItemId(itemId);
  };

  const closeRejectModal = () => {
    setRejectModalItemId(null);
    setRejectReasonDraft('');
  };

  const handleConfirmRejectItem = async () => {
    if (!orderId || rejectModalItemId == null) return;
    const oid = parseInt(orderId, 10);
    if (Number.isNaN(oid)) return;
    const itemId = rejectModalItemId;
    setSubmittingItemId(itemId);
    setActionMessage(null);
    try {
      const reason = rejectReasonDraft.trim();
      await postOrderItemDecisions(oid, [
        {
          item_id: itemId,
          decision: 'rejected',
          ...(reason ? { rejection_reason: reason } : {}),
        },
      ]);
      setActionMessage({ type: 'success', message: 'Line item rejected.' });
      closeRejectModal();
      await refreshOrder();
    } catch (err) {
      const msg =
        isShopApiError(err) && err.status === 409
          ? 'This line was already decided. Refresh the page.'
          : err instanceof Error
            ? err.message
            : 'Failed to reject line item.';
      setActionMessage({ type: 'error', message: msg });
    } finally {
      setSubmittingItemId(null);
    }
  };

  const handleRefundUpdate = async (
    itemId: number,
    refundStatus: Exclude<OrderItemRefundStatus, 'not_applicable'>
  ) => {
    if (!orderId) return;
    const id = parseInt(orderId, 10);
    if (Number.isNaN(id)) return;
    setSubmittingItemId(itemId);
    setActionMessage(null);
    try {
      await postOrderItemRefunds(id, [{ item_id: itemId, refund_status: refundStatus }]);
      setActionMessage({ type: 'success', message: 'Refund status updated.' });
      await refreshOrder();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update refund status.';
      setActionMessage({ type: 'error', message: msg });
    } finally {
      setSubmittingItemId(null);
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
    const backToEcoStore = isMainAdmin
      ? '/admin/shop/orders/requests'
      : isDivisionAdmin
        ? '/admin/shop/orders/pending'
        : '/admin/shop/orders/confirmed';
    const backTo = location.pathname.startsWith('/admin/shop') ? backToEcoStore : '/admin';
    const ecoBackLabel = backTo.includes('/pending')
      ? 'Back to Pending orders'
      : backTo.includes('/confirmed')
        ? 'Back to Confirmed orders'
        : backTo.includes('/shop')
          ? 'Back to Requested orders'
          : 'Back to Admin';
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
            {ecoBackLabel}
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const {
    deliveryDetails,
    items,
    totalAmount,
    portionSubtotal,
    transactionId,
    paymentStatus,
    paymentAmountAuthorizedPaise,
    paymentAmountCapturedPaise,
    paymentAmountRefundedPaise,
    paymentSafetyCaptured,
    status,
    createdAt,
    orderNo,
    decisionRollup,
    fulfillmentRollup,
    refundRollup,
  } = order;
  const displayPrimaryAmount = isMainAdmin ? totalAmount : portionSubtotal ?? totalAmount;

  const hasPendingLine = items.some((i) => i.decisionStatus === 'pending');
  const hasDecisionActions = items.some((item) => canDecideItem(item));
  const hasFulfillmentActions = items.some((item) => canUpdateFulfillment(item));
  const userHasLineActions = items.some((item) => canDecideItem(item) || canUpdateFulfillment(item) || canUpdateRefund(item));

  const isFromEcoStore = location.pathname.startsWith('/admin/shop');
  const inMainQueue =
    isMainAdmin && status === 'pending' && decisionRollup === 'awaiting_decisions';
  const backHref = isFromEcoStore
    ? isMainAdmin
      ? inMainQueue
        ? '/admin/shop/orders/requests'
        : '/admin/shop/orders/confirmed'
      : isDivisionAdmin
        ? hasDecisionActions
          ? '/admin/shop/orders/pending'
          : hasFulfillmentActions
            ? '/admin/shop/orders/fulfillment'
            : '/admin/shop/orders/confirmed'
        : '/admin/shop/orders/confirmed'
    : '/admin';
  const backLabel = isFromEcoStore
    ? isMainAdmin
      ? inMainQueue
        ? 'Back to Requested orders'
        : 'Back to Confirmed orders'
      : isDivisionAdmin
        ? hasDecisionActions
          ? 'Back to Pending orders'
          : hasFulfillmentActions
            ? 'Back to Fulfillment queue'
            : 'Back to Confirmed orders'
        : 'Back to Confirmed orders'
    : 'Back to Dashboard';

  const showBulkActions =
    isMainAdmin && decisionRollup === 'awaiting_decisions' && hasPendingLine;

  const showProcessedFooter = !showBulkActions && !userHasLineActions;

  const processedMessage = (() => {
    if (decisionRollup === 'fully_accepted') {
      return 'All line items were accepted. No further action required.';
    }
    if (decisionRollup === 'fully_rejected') {
      return 'All line items were rejected. No further action required.';
    }
    if (decisionRollup === 'partially_accepted') {
      return 'Line-item decisions are complete for this order.';
    }
    if (decisionRollup === 'awaiting_decisions' && !isMainAdmin && !userHasLineActions) {
      return 'No pending items for your division on this order.';
    }
    if (status !== 'pending') {
      return `This order has already been ${status}. No further action required.`;
    }
    return 'No further action required.';
  })();

  return (
    <div className="max-w-4xl mx-auto">
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

      <div className="mb-6 flex flex-wrap items-center gap-2">
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
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${decisionRollupBadgeClass(decisionRollup)}`}
        >
          Decisions: {decisionRollupLabel(decisionRollup)}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Fulfillment: {fulfillmentRollup}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          Refunds: {refundRollup}
        </span>
        <span className="text-sm text-gray-500 w-full sm:w-auto sm:ml-2">Placed on: {formatDate(createdAt)}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  {deliveryDetails.address}
                  <br />
                  {deliveryDetails.city}, {deliveryDetails.state} - {deliveryDetails.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-green-600" />
            Payment Details
          </h2>

          <div className="space-y-4">
            {paymentStatus ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm text-blue-700 font-medium">Razorpay payment</p>
                <p className="text-sm text-blue-900">
                  Status:{' '}
                  <span className="font-semibold uppercase tracking-wide">{paymentStatus}</span>
                  {paymentSafetyCaptured ? (
                    <span className="ml-2 text-xs font-medium text-amber-700">(safety captured)</span>
                  ) : null}
                </p>
                {transactionId ? (
                  <p className="text-xs font-mono text-blue-800 break-all">
                    Payment ID: {transactionId}
                  </p>
                ) : null}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-blue-900 pt-1">
                  <p>
                    Authorized:{' '}
                    <strong>
                      ₹
                      {((paymentAmountAuthorizedPaise ?? 0) / 100).toFixed(2)}
                    </strong>
                  </p>
                  <p>
                    Captured:{' '}
                    <strong>
                      ₹
                      {((paymentAmountCapturedPaise ?? 0) / 100).toFixed(2)}
                    </strong>
                  </p>
                  <p>
                    Refunded:{' '}
                    <strong>
                      ₹
                      {((paymentAmountRefundedPaise ?? 0) / 100).toFixed(2)}
                    </strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-700 font-medium mb-1">Transaction ID</p>
                <p className="font-mono text-lg font-bold text-amber-900">
                  {transactionId || '—'}
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  Manual UPI / bank reference — verify in your UPI/Bank app
                </p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium mb-1">
                {isMainAdmin ? 'Total amount' : "Your division's portion"}
              </p>
              <p className="text-3xl font-bold text-green-800">₹{displayPrimaryAmount}</p>
              {!isMainAdmin && portionSubtotal != null && (
                <p className="text-xs text-gray-500 mt-2">Full order total (all divisions): ₹{totalAmount}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-green-600" />
          Order Items ({items.length})
        </h2>

        <div className="divide-y divide-gray-100">
          {items.map((item, index) => {
            const acting = submittingItemId === item.id;
            const showDecisionActions = canDecideItem(item);
            const showFulfillmentActions = canUpdateFulfillment(item);
            const showRefundActions = canUpdateRefund(item);
            const fulfillmentLocked = item.fulfillmentStatus === 'delivered';
            const refundLocked = item.refundStatus === 'refunded';
            return (
              <div
                key={item.id || index}
                className="py-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex items-start min-w-0">
                  <span className="text-2xl mr-4 flex-shrink-0">{item.imageIcon || '🌿'}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.divisionName && <p className="text-xs text-gray-500">Sold by: {item.divisionName}</p>}
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit} × ₹{item.price}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Line: <span className="font-medium text-gray-700">{itemDecisionLabel(item.decisionStatus)}</span>
                      {item.rejectionReason && item.decisionStatus === 'rejected' ? (
                        <span className="block text-gray-500 mt-0.5">Reason: {item.rejectionReason}</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Fulfillment:{' '}
                      <span className="font-medium text-gray-700">
                        {fulfillmentLabel(item.fulfillmentStatus)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Refund:{' '}
                      <span className="font-medium text-gray-700">
                        {refundLabel(item.refundStatus)}
                      </span>
                      {item.refundReference ? (
                        <span className="block text-gray-500 mt-0.5">Ref: {item.refundReference}</span>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-stretch sm:items-end gap-2 flex-shrink-0">
                  <p className="font-bold text-green-700 text-right">₹{item.price * item.quantity}</p>
                  {showDecisionActions ? (
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleAcceptItem(item.id)}
                        disabled={acting || isProcessing}
                        className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => openRejectModal(item.id)}
                        disabled={acting || isProcessing}
                        className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  ) : null}
                  {showFulfillmentActions ? (
                    <div className="flex items-center gap-2 justify-end">
                      <select
                        value={item.fulfillmentStatus}
                        onChange={(e) =>
                          handleFulfillmentUpdate(
                            item.id,
                            e.target.value as OrderItemFulfillmentStatus
                          )
                        }
                        disabled={acting || isProcessing || fulfillmentLocked}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      >
                        <option value="not_started">Not started</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      {fulfillmentLocked ? (
                        <span className="text-xs text-gray-500">Locked</span>
                      ) : null}
                    </div>
                  ) : null}
                  {showRefundActions ? (
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleRefundUpdate(item.id, 'refund_pending')}
                        disabled={acting || isProcessing || refundLocked}
                        className="inline-flex items-center justify-center px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mark Pending
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRefundUpdate(item.id, 'refunded')}
                        disabled={acting || isProcessing || refundLocked}
                        className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mark Refunded
                      </button>
                      {refundLocked ? (
                        <span className="text-xs text-gray-500 self-center">Locked</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">{isMainAdmin ? 'Total' : 'Your portion'}</span>
          <span className="text-2xl font-bold text-green-700">₹{displayPrimaryAmount}</span>
        </div>
      </div>

      {showBulkActions && (
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
            Accept all pending lines
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
            Reject all pending lines
          </button>
        </div>
      )}

      {showProcessedFooter && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">{processedMessage}</p>
        </div>
      )}

      <Modal isOpen={rejectModalItemId != null} onClose={closeRejectModal} title="Reject line item" size="sm">
        <p className="text-sm text-gray-600 mb-3">Optional note (shown internally / for records):</p>
        <textarea
          value={rejectReasonDraft}
          onChange={(e) => setRejectReasonDraft(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Reason for rejection"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeRejectModal}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmRejectItem}
            disabled={submittingItemId != null}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {submittingItemId != null ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Rejecting…
              </span>
            ) : (
              'Confirm reject'
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrderDetail;
