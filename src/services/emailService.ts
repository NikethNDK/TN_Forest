/**
 * Email Service
 * 
 * Handles sending emails via EmailJS
 */

import emailjs from '@emailjs/browser';
import type { CartItem, CheckoutDeliveryDetails } from '../types';

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_ORDER_ACCEPTED_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ORDER_ACCEPTED_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Admin email to receive order notifications
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'forestresearch6@gmail.com';

// Base URL for admin order management (uses current origin)
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

/**
 * Format cart items for email
 */
const formatOrderItems = (items: CartItem[]): string => {
  return items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}\n   Quantity: ${item.quantity} ${item.unit}\n   Price: ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}`
    )
    .join('\n\n');
};

/**
 * Format delivery address for email
 */
const formatDeliveryAddress = (details: CheckoutDeliveryDetails): string => {
  return `${details.address}
${details.city}, ${details.state} - ${details.pincode}`;
};

export interface SendOrderEmailParams {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryDetails: CheckoutDeliveryDetails;
  transactionId: string;
}

/**
 * Send order confirmation email to admin
 */
export const sendOrderEmailToAdmin = async (
  params: SendOrderEmailParams
): Promise<{ success: boolean; error?: string }> => {
  const { orderId, items, totalAmount, deliveryDetails, transactionId } = params;

  // Check if EmailJS is configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS not configured. Skipping email send.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    // Generate action URL for admin to view/manage order
    const actionUrl = `${getBaseUrl()}/admin/orders/${orderId}`;

    const templateParams = {
      to_email: ADMIN_EMAIL,
      order_id: orderId,
      customer_name: deliveryDetails.name,
      customer_email: deliveryDetails.email,
      customer_phone: deliveryDetails.phone,
      delivery_address: formatDeliveryAddress(deliveryDetails),
      order_items: formatOrderItems(items),
      items_count: items.length,
      total_amount: `₹${totalAmount}`,
      transaction_id: transactionId,
      order_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
      action_url: actionUrl,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200) {
      console.log('Order email sent successfully');
      return { success: true };
    } else {
      console.error('Failed to send email:', response);
      return {
        success: false,
        error: 'Failed to send email',
      };
    }
  } catch (error: any) {
    console.error('Error sending order email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
};

/**
 * Parameters for sending order accepted email to user
 */
export interface SendOrderAcceptedEmailParams {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryDetails: CheckoutDeliveryDetails;
  transactionId: string;
  orderDate: string;
}

/**
 * Send order accepted confirmation email to user
 */
export const sendOrderAcceptedEmail = async (
  params: SendOrderAcceptedEmailParams
): Promise<{ success: boolean; error?: string }> => {
  const { orderId, items, totalAmount, deliveryDetails, transactionId, orderDate } = params;

  // Check if EmailJS is configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_ORDER_ACCEPTED_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS Order Accepted template not configured. Skipping email send.');
    return {
      success: false,
      error: 'Email service not configured for order acceptance',
    };
  }

  try {
    const templateParams = {
      to_email: deliveryDetails.email,
      order_id: orderId,
      customer_name: deliveryDetails.name,
      delivery_address: formatDeliveryAddress(deliveryDetails),
      order_items: formatOrderItems(items),
      items_count: items.length,
      total_amount: `₹${totalAmount}`,
      transaction_id: transactionId,
      order_date: orderDate,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORDER_ACCEPTED_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200) {
      console.log('Order accepted email sent successfully to user');
      return { success: true };
    } else {
      console.error('Failed to send order accepted email:', response);
      return {
        success: false,
        error: 'Failed to send order accepted email',
      };
    }
  } catch (error: any) {
    console.error('Error sending order accepted email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send order accepted email',
    };
  }
};
