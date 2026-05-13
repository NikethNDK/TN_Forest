/**
 * Shop backend API client (Django TN_Forest_Shop).
 * Uses axios with Firebase ID token for Authorization: Bearer.
 * Public client (no auth) for checkout and contact form.
 */

import axios, { AxiosError } from 'axios';
import { getIdToken } from '../firebase/authService';
import type { ShopDivision } from '../../types';

export const getShopApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_SHOP_API_URL;
  if (!url || typeof url !== 'string') {
    throw new Error('VITE_SHOP_API_URL is not set. Add it to your .env file.');
  }
  let normalized = url.trim().replace(/\/$/, '');
  // Paths already include `/api/...`. If env is `http://host:port/api`, requests would hit `/api/api/...` (404).
  if (normalized.endsWith('/api')) {
    normalized = normalized.slice(0, -4);
  }
  return normalized.replace(/\/$/, '');
};

const getBaseUrl = getShopApiBaseUrl;

const shopClient = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

/** Client for public endpoints (no auth): order create, contact form */
const publicShopClient = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

shopClient.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('Not authenticated. Please sign in again.');
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Thrown by shopClient on error responses; includes HTTP status when available. */
export class ShopApiError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ShopApiError';
    this.status = status;
  }
}

export function isShopApiError(err: unknown): err is ShopApiError {
  return err instanceof ShopApiError;
}

shopClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string; name?: string[]; message?: string }>) => {
    const data = error.response?.data;
    const status = error.response?.status;
    const message =
      data?.detail ?? (Array.isArray(data?.name) ? data?.name[0] : undefined) ?? data?.message ?? error.message ?? 'Request failed';
    throw new ShopApiError(typeof message === 'string' ? message : 'Request failed', status);
  }
);

publicShopClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string; name?: string[]; message?: string }>) => {
    const data = error.response?.data;
    const status = error.response?.status;
    const message =
      data?.detail ?? (Array.isArray(data?.name) ? data?.name[0] : undefined) ?? data?.message ?? error.message ?? 'Request failed';
    throw new ShopApiError(typeof message === 'string' ? message : 'Request failed', status);
  }
);

export type { ShopDivision };

// --- Me (current user + admin profile) ---

export interface MeResponse {
  id: number;
  firebase_uid: string;
  email: string;
  admin_type: string | null;
  division_ids: number[];
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await shopClient.get<MeResponse>('/api/users/me/');
  return data;
}

// --- Division admins (main admin only) ---

export interface DivisionAdminDivisionRef {
  id: number;
  name: string;
}

export interface DivisionAdminListItem {
  firebase_uid: string;
  admin_type: string;
  division_ids: number[];
  email: string | null;
  divisions: DivisionAdminDivisionRef[];
}

export interface DivisionAdminsListResponse {
  results: DivisionAdminListItem[];
  count: number;
}

export interface CreateDivisionAdminPayload {
  email: string;
  password: string;
  division_ids: number[];
}

export interface CreateDivisionAdminResponse {
  firebase_uid: string;
  admin_type: string;
  division_ids: number[];
  email: string;
}

export async function getDivisionAdmins(limit = 100): Promise<DivisionAdminsListResponse> {
  const { data } = await shopClient.get<DivisionAdminsListResponse>('/api/users/division-admins/', {
    params: { limit },
  });
  return data;
}

export async function createDivisionAdmin(
  payload: CreateDivisionAdminPayload
): Promise<CreateDivisionAdminResponse> {
  const { data } = await shopClient.post<CreateDivisionAdminResponse>(
    '/api/users/division-admins/',
    payload
  );
  return data;
}

export interface UpdateDivisionAdminPayload {
  email: string;
  /** Omit or empty to leave password unchanged. */
  password?: string;
  division_ids: number[];
}

export async function updateDivisionAdmin(
  firebaseUid: string,
  payload: UpdateDivisionAdminPayload
): Promise<CreateDivisionAdminResponse> {
  const { data } = await shopClient.patch<CreateDivisionAdminResponse>(
    `/api/users/division-admins/${encodeURIComponent(firebaseUid)}/`,
    {
      email: payload.email,
      password: payload.password ?? '',
      division_ids: payload.division_ids,
    }
  );
  return data;
}

export async function deleteDivisionAdmin(firebaseUid: string): Promise<void> {
  await shopClient.delete(`/api/users/division-admins/${encodeURIComponent(firebaseUid)}/`);
}

// --- Divisions ---

export async function getDivisions(): Promise<ShopDivision[]> {
  const { data } = await shopClient.get<ShopDivision[]>('/api/divisions/');
  return data;
}

export async function getDivision(id: number): Promise<ShopDivision> {
  const { data } = await shopClient.get<ShopDivision>(`/api/divisions/${id}/`);
  return data;
}

export async function createDivision(name: string): Promise<ShopDivision> {
  const { data } = await shopClient.post<ShopDivision>('/api/divisions/', { name: name.trim() });
  return data;
}

export async function updateDivision(id: number, payload: { name: string }): Promise<ShopDivision> {
  const { data } = await shopClient.patch<ShopDivision>(`/api/divisions/${id}/`, { name: payload.name.trim() });
  return data;
}

export async function deleteDivision(id: number): Promise<void> {
  await shopClient.delete(`/api/divisions/${id}/`);
}

// --- Products (Django API snake_case → camelCase for UI) ---

export interface ShopProductApi {
  /** Supplier listing id (URLs and checkout use this). */
  id: number;
  /** Global catalog product id. */
  product_id: number;
  division: number;
  division_name: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  image_url: string | null;
  image_public_id: string | null;
  image_icon: string;
  visible_on_shop: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopProductFromApi {
  id: number;
  productId: number;
  division: number;
  divisionName: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  imageIcon: string;
  visibleOnShop: boolean;
  createdAt: string;
  updatedAt: string;
}

function normalizeProduct(raw: ShopProductApi): ShopProductFromApi {
  return {
    id: raw.id,
    productId: raw.product_id,
    division: raw.division,
    divisionName: raw.division_name,
    name: raw.name,
    description: raw.description,
    price: parseFloat(raw.price),
    stock: raw.stock,
    category: raw.category,
    imageUrl: raw.image_url || null,
    imagePublicId: raw.image_public_id || null,
    imageIcon: raw.image_icon || '',
    visibleOnShop: raw.visible_on_shop ?? true,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/** One row for multi-division create: division + stock (kg). */
export interface CreateProductListingRow {
  division: number;
  stock: number;
  listing_price?: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string | null;
  image_public_id?: string | null;
  image_icon?: string | null;
  /** Multi-supplier create: N division rows (preferred for main admin). */
  listings?: CreateProductListingRow[];
  /** Legacy single listing (same as one row in `listings`). */
  division?: number;
  stock?: number;
  visible_on_shop?: boolean;
}

/** Response from POST /api/inventory/products/ after multi-listing support. */
export interface CreateProductResult {
  productId: number;
  listings: ShopProductFromApi[];
}

export interface UpdateProductPayload {
  division?: number;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  image_url?: string | null;
  image_public_id?: string | null;
  image_icon?: string | null;
  visible_on_shop?: boolean;
}

/** Paginated list response from GET /api/inventory/products/ */
export interface ProductsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ShopProductFromApi[];
}

export interface ProductsListParams {
  division?: number;
  /** Global catalog product id — returns all supplier rows for that product (admin). */
  product?: number;
  category?: string;
  ordering?: string;
}

/** Returns first page of products (backward compat). Prefer getProductsPaginated for list UI. */
export async function getProducts(): Promise<ShopProductFromApi[]> {
  const res = await getProductsPaginated(1, 100);
  return res.results;
}

export async function getProductsPaginated(
  page: number = 1,
  pageSize: number = 10,
  params?: ProductsListParams
): Promise<ProductsPaginatedResponse> {
  const requestParams: Record<string, string | number | undefined> = {
    page,
    page_size: pageSize,
  };
  if (params?.division !== undefined) requestParams.division = params.division;
  if (params?.product !== undefined) requestParams.product = params.product;
  if (params?.category !== undefined && params.category !== '') requestParams.category = params.category;
  if (params?.ordering !== undefined && params.ordering !== '') requestParams.ordering = params.ordering;
  const { data } = await shopClient.get<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ShopProductApi[];
  }>('/api/inventory/products/', { params: requestParams });
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results.map(normalizeProduct),
  };
}

export async function getProduct(id: number): Promise<ShopProductFromApi> {
  const { data } = await shopClient.get<ShopProductApi>(`/api/inventory/products/${id}/`);
  return normalizeProduct(data);
}

export async function createProduct(payload: CreateProductPayload): Promise<CreateProductResult> {
  const body: Record<string, unknown> = {
    name: payload.name.trim(),
    description: payload.description,
    price: payload.price,
    category: payload.category.trim(),
    image_url: payload.image_url ?? null,
    image_public_id: payload.image_public_id ?? null,
    image_icon: payload.image_icon ?? '',
  };
  if (payload.visible_on_shop !== undefined) body.visible_on_shop = payload.visible_on_shop;
  if (payload.listings && payload.listings.length > 0) {
    body.listings = payload.listings.map((row) => ({
      division: row.division,
      stock: row.stock,
      ...(row.listing_price != null ? { listing_price: row.listing_price } : {}),
    }));
  } else if (payload.division !== undefined && payload.stock !== undefined) {
    body.division = payload.division;
    body.stock = payload.stock;
  }
  const { data } = await shopClient.post<{ product_id: number; listings: ShopProductApi[] }>(
    '/api/inventory/products/',
    body
  );
  return {
    productId: data.product_id,
    listings: data.listings.map(normalizeProduct),
  };
}

/** Add another division supplier row to an existing global product (main admin). */
export async function addProductListing(
  productId: number,
  payload: { division: number; stock: number; listing_price?: number }
): Promise<ShopProductFromApi> {
  const body: Record<string, unknown> = {
    division: payload.division,
    stock: payload.stock,
  };
  if (payload.listing_price != null) body.listing_price = payload.listing_price;
  const { data } = await shopClient.post<ShopProductApi>(
    `/api/inventory/products/${productId}/listings/`,
    body
  );
  return normalizeProduct(data);
}

export async function updateProduct(id: number, payload: UpdateProductPayload): Promise<ShopProductFromApi> {
  const body: Record<string, unknown> = {};
  if (payload.division !== undefined) body.division = payload.division;
  if (payload.name !== undefined) body.name = payload.name.trim();
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.price !== undefined) body.price = payload.price;
  if (payload.stock !== undefined) body.stock = payload.stock;
  if (payload.category !== undefined) body.category = payload.category.trim();
  if (payload.image_url !== undefined) body.image_url = payload.image_url;
  if (payload.image_public_id !== undefined) body.image_public_id = payload.image_public_id;
  if (payload.image_icon !== undefined) body.image_icon = payload.image_icon ?? '';
  if (payload.visible_on_shop !== undefined) body.visible_on_shop = payload.visible_on_shop;
  const { data } = await shopClient.patch<ShopProductApi>(`/api/inventory/products/${id}/`, body);
  return normalizeProduct(data);
}

export async function deleteProduct(id: number): Promise<void> {
  await shopClient.delete(`/api/inventory/products/${id}/`);
}

// --- Orders (POST create is public; list/detail/accept/decline require auth) ---

export interface CreateOrderPayload {
  items: { listing_id: number; quantity: number; unit?: string }[];
  /** Ignored by server; totals are computed from listings. */
  total_amount?: string;
  delivery_name: string;
  delivery_email: string;
  delivery_phone?: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_pincode: string;
  transaction_id?: string;
}

export type OrderDecisionRollup =
  | 'awaiting_decisions'
  | 'fully_accepted'
  | 'fully_rejected'
  | 'partially_accepted';

export type OrderItemDecisionStatus = 'pending' | 'accepted' | 'rejected';
export type OrderItemFulfillmentStatus =
  | 'not_started'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';
export type OrderItemRefundStatus =
  | 'not_applicable'
  | 'refund_pending'
  | 'refunded'
  | 'refund_failed';

export interface OrderItemApi {
  id: number;
  product_name: string;
  quantity: number;
  unit: string;
  price: string;
  division: number | null;
  division_name?: string | null;
  listing: number | null;
  decision_status: OrderItemDecisionStatus;
  decision_source?: string | null;
  decided_at?: string | null;
  decided_by?: number | null;
  rejection_reason?: string;
  fulfillment_status?: OrderItemFulfillmentStatus;
  fulfillment_updated_at?: string | null;
  fulfillment_updated_by?: number | null;
  shipped_at?: string | null;
  out_for_delivery_at?: string | null;
  delivered_at?: string | null;
  refund_status?: OrderItemRefundStatus;
  refund_updated_at?: string | null;
  refund_updated_by?: number | null;
  refunded_at?: string | null;
  refund_reference?: string;
  refund_note?: string;
}

export interface OrderFromApi {
  id: number;
  order_no?: string | null;
  status: string;
  /** Aggregate of line-level accept/reject decisions. */
  decision_rollup: OrderDecisionRollup;
  /** Aggregate of accepted-line fulfillment progress. */
  fulfillment_rollup?: string;
  /** Aggregate of rejected-line refund progress. */
  refund_rollup?: string;
  /** Full order total (main admin). */
  total_amount: string;
  /** Sum of line totals for this admin’s divisions only (division admin); null for main admin. */
  portion_subtotal?: string | null;
  /** Signed token for guest payment APIs when Razorpay is enabled on the backend. */
  order_access_token?: string;
  /** Backend signals Razorpay checkout flow. */
  payment_required?: boolean;
  transaction_id: string;
  delivery_name: string;
  delivery_email: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_pincode: string;
  created_at: string;
  updated_at: string;
  items: OrderItemApi[];
}

/** Create order (guest or auth). No token required. */
export async function createOrder(payload: CreateOrderPayload): Promise<OrderFromApi> {
  const { data } = await publicShopClient.post<OrderFromApi>('/api/orders/', payload);
  return data;
}

export interface CreateRazorpayOrderResponse {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key: string;
  receipt: string;
}

/** Public: create Razorpay order for an existing shop order (authorize, manual capture). */
export async function createRazorpayPaymentOrder(
  orderId: number,
  orderAccessToken: string
): Promise<CreateRazorpayOrderResponse> {
  const { data } = await publicShopClient.post<CreateRazorpayOrderResponse>(
    '/api/payments/create-order/',
    { order_id: orderId, order_access_token: orderAccessToken }
  );
  return data;
}

export interface VerifyRazorpayPaymentPayload {
  order_id: number;
  order_access_token: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyRazorpayPaymentResponse {
  status: string;
  order_id: number;
  order: OrderFromApi;
  message?: string;
}

export async function verifyRazorpayPayment(
  payload: VerifyRazorpayPaymentPayload
): Promise<VerifyRazorpayPaymentResponse> {
  const { data } = await publicShopClient.post<VerifyRazorpayPaymentResponse>(
    '/api/payments/verify-authorization/',
    payload
  );
  return data;
}

export interface PaymentStatusResponse {
  payment_status: string;
  amount_authorized_paise?: number;
  amount_captured_paise?: number;
  currency?: string;
  authorized_at?: string | null;
  razorpay_enabled?: boolean;
  order?: OrderFromApi;
}

export async function getPaymentStatus(
  orderId: number,
  orderAccessToken: string
): Promise<PaymentStatusResponse> {
  const { data } = await publicShopClient.get<PaymentStatusResponse>(
    `/api/payments/${orderId}/status/`,
    { headers: { Authorization: `Bearer ${orderAccessToken}` } }
  );
  return data;
}

/** List orders (admin). Requires auth. Optional search filters by order_no (partial match). */
export async function getOrders(params?: { search?: string }): Promise<OrderFromApi[]> {
  const config = params?.search?.trim()
    ? { params: { search: params.search.trim() } }
    : {};
  const { data } = await shopClient.get<OrderFromApi[]>('/api/orders/', config);
  return data;
}

/** Get order by id (admin). Requires auth. */
export async function getOrderById(id: number): Promise<OrderFromApi> {
  const { data } = await shopClient.get<OrderFromApi>(`/api/orders/${id}/`);
  return data;
}

/** Accept order and send customer email (admin). Requires auth. */
export async function acceptOrder(id: number): Promise<OrderFromApi> {
  const { data } = await shopClient.post<OrderFromApi>(`/api/orders/${id}/accept/`);
  return data;
}

/** Decline order and send customer email (admin). Requires auth. */
export async function declineOrder(id: number): Promise<OrderFromApi> {
  const { data } = await shopClient.post<OrderFromApi>(`/api/orders/${id}/decline/`);
  return data;
}

export interface OrderItemDecisionPayload {
  item_id: number;
  decision: 'accepted' | 'rejected';
  rejection_reason?: string;
}

/** Accept/reject specific line items (division or main admin). Requires auth. */
export async function postOrderItemDecisions(
  orderId: number,
  items: OrderItemDecisionPayload[]
): Promise<OrderFromApi> {
  const { data } = await shopClient.post<OrderFromApi>(`/api/orders/${orderId}/items/decisions/`, {
    items,
  });
  return data;
}

export interface OrderItemFulfillmentPayload {
  item_id: number;
  fulfillment_status: OrderItemFulfillmentStatus;
}

/** Division admin: update fulfillment states for owned accepted line items. */
export async function postOrderItemFulfillment(
  orderId: number,
  items: OrderItemFulfillmentPayload[]
): Promise<OrderFromApi> {
  const { data } = await shopClient.post<OrderFromApi>(`/api/orders/${orderId}/items/fulfillment/`, {
    items,
  });
  return data;
}

export interface OrderItemRefundPayload {
  item_id: number;
  refund_status: Exclude<OrderItemRefundStatus, 'not_applicable'>;
  refund_reference?: string;
  refund_note?: string;
}

/** Main admin: update refund status for rejected line items. */
export async function postOrderItemRefunds(
  orderId: number,
  items: OrderItemRefundPayload[]
): Promise<OrderFromApi> {
  const { data } = await shopClient.post<OrderFromApi>(`/api/orders/${orderId}/items/refunds/`, {
    items,
  });
  return data;
}

/** Main admin: list refund queue (pending first, refunded below). */
export async function getRefundQueueOrders(params?: { search?: string }): Promise<OrderFromApi[]> {
  const config = params?.search?.trim()
    ? { params: { search: params.search.trim() } }
    : {};
  const { data } = await shopClient.get<OrderFromApi[]>('/api/orders/refunds/', config);
  return data;
}

// --- Contact form (public) ---

export interface ContactConcernPayload {
  name: string;
  email: string;
  phone?: string;
  purpose?: string;
  subject?: string;
  message: string;
}

/** Submit Contact Us form. No auth required. */
export async function submitContactConcern(payload: ContactConcernPayload): Promise<{ id: number; message: string }> {
  const { data } = await publicShopClient.post<{ id: number; message: string }>('/api/notifications/contact/', payload);
  return data;
}

// --- Contact form recipients (admin; who receives Contact Us emails) ---

export interface ContactFormRecipientFromApi {
  id: number | null;
  email: string;
  display_name: string;
  order: number;
  created_at: string | null;
  is_system?: boolean;
}

export interface ContactFormRecipientsResponse {
  recipients: ContactFormRecipientFromApi[];
  default_admin_email: string;
}

/** List contact-form recipients and default admin email from server. Requires auth (main admin). */
export async function getContactFormRecipients(): Promise<ContactFormRecipientsResponse> {
  const { data } = await shopClient.get<ContactFormRecipientsResponse>('/api/notifications/contact-form-recipients/');
  return data;
}

/** Add a contact-form recipient. Requires auth (main admin). */
export async function addContactFormRecipient(payload: {
  email: string;
  display_name?: string;
  order?: number;
}): Promise<ContactFormRecipientFromApi> {
  const { data } = await shopClient.post<ContactFormRecipientFromApi>('/api/notifications/contact-form-recipients/', {
    email: payload.email.trim(),
    display_name: payload.display_name?.trim() ?? '',
    order: payload.order ?? 0,
  });
  return data;
}

/** Remove a contact-form recipient. Requires auth (main admin). No-op if id is null (system admin). */
export async function deleteContactFormRecipient(id: number): Promise<void> {
  if (id == null) return;
  await shopClient.delete(`/api/notifications/contact-form-recipients/${id}/`);
}

// --- Custom order request (e.g. bio-fertilizer) — public ---

export interface CustomOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  details: string;
  items_summary?: string;
}

/** Submit custom order request. No auth. Admin is notified by email. */
export async function createCustomOrder(payload: CustomOrderPayload): Promise<{ id: number; message: string }> {
  const { data } = await publicShopClient.post<{ id: number; message: string }>('/api/orders/custom/', payload);
  return data;
}
