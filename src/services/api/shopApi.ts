/**
 * Shop backend API client (Django TN_Forest_Shop).
 * Uses axios with Firebase ID token for Authorization: Bearer.
 */

import axios, { AxiosError } from 'axios';
import { getIdToken } from '../firebase/authService';
import type { ShopDivision } from '../../types';

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_SHOP_API_URL;
  if (!url || typeof url !== 'string') {
    throw new Error('VITE_SHOP_API_URL is not set. Add it to your .env file.');
  }
  return url.replace(/\/$/, '');
};

const shopClient = axios.create({
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

export async function getProducts(): Promise<ShopProductFromApi[]> {
  const { data } = await shopClient.get<ShopProductApi[]>('/api/inventory/products/');
  return data.map(normalizeProduct);
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
