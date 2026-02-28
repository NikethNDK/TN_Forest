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
  return url.replace(/\/$/, '');
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

shopClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string; name?: string[]; message?: string }>) => {
    const data = error.response?.data;
    const message =
      data?.detail ?? (Array.isArray(data?.name) ? data?.name[0] : undefined) ?? data?.message ?? error.message ?? 'Request failed';
    throw new Error(typeof message === 'string' ? message : 'Request failed');
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
  id: number;
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
  created_at: string;
  updated_at: string;
}

export interface ShopProductFromApi {
  id: number;
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
  createdAt: string;
  updatedAt: string;
}

function normalizeProduct(raw: ShopProductApi): ShopProductFromApi {
  return {
    id: raw.id,
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
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export interface CreateProductPayload {
  division: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
  image_public_id?: string | null;
  image_icon?: string | null;
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

export async function createProduct(payload: CreateProductPayload): Promise<ShopProductFromApi> {
  const body = {
    division: payload.division,
    name: payload.name.trim(),
    description: payload.description,
    price: payload.price,
    stock: payload.stock,
    category: payload.category.trim(),
    image_url: payload.image_url ?? null,
    image_public_id: payload.image_public_id ?? null,
    image_icon: payload.image_icon ?? '',
  };
  const { data } = await shopClient.post<ShopProductApi>('/api/inventory/products/', body);
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
  const { data } = await shopClient.patch<ShopProductApi>(`/api/inventory/products/${id}/`, body);
  return normalizeProduct(data);
}

export async function deleteProduct(id: number): Promise<void> {
  await shopClient.delete(`/api/inventory/products/${id}/`);
}

// --- Orders (POST create is public; list/detail/accept/decline require auth) ---

export interface CreateOrderPayload {
  items: { product_id?: number; product_name: string; quantity: number; unit?: string; price: string | number }[];
  total_amount: string;
  delivery_name: string;
  delivery_email: string;
  delivery_phone?: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_pincode: string;
  transaction_id?: string;
}

export interface OrderItemApi {
  id: number;
  product_name: string;
  quantity: number;
  unit: string;
  price: string;
}

export interface OrderFromApi {
  id: number;
  status: string;
  total_amount: string;
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

/** List orders (admin). Requires auth. */
export async function getOrders(): Promise<OrderFromApi[]> {
  const { data } = await shopClient.get<OrderFromApi[]>('/api/orders/');
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

// --- Contact form (public) ---

export interface ContactConcernPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/** Submit Contact Us form. No auth required. */
export async function submitContactConcern(payload: ContactConcernPayload): Promise<{ id: number; message: string }> {
  const { data } = await publicShopClient.post<{ id: number; message: string }>('/api/notifications/contact/', payload);
  return data;
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
