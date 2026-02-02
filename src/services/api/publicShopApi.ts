/**
 * Public shop API client (no auth).
 * For the public Shop page to fetch products from GET /api/public/products/.
 */

import axios, { AxiosError } from 'axios';
import type { ShopProduct } from '../../types';

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_SHOP_API_URL;
  if (!url || typeof url !== 'string') {
    throw new Error('VITE_SHOP_API_URL is not set. Add it to your .env file.');
  }
  return url.replace(/\/$/, '');
};

const publicClient = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

/** Raw product from GET /api/public/products/ (snake_case). */
interface PublicProductRaw {
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

function mapToShopProduct(raw: PublicProductRaw): ShopProduct {
  return {
    id: String(raw.id),
    name: raw.name,
    description: raw.description ?? '',
    price: parseFloat(raw.price) || 0,
    category: (raw.category === 'Bio Fertilizers' ? 'Bio Fertilizers' : 'Seeds') as ShopProduct['category'],
    stock: raw.stock,
    unit: 'packets',
    imageUrl: raw.image_url ?? undefined,
    imagePublicId: raw.image_public_id ?? undefined,
    imageIcon: raw.image_icon ?? undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export interface GetPublicProductsParams {
  category?: string;
  ordering?: string;
}

/**
 * Fetches products from the public API (no auth).
 * Uses page_size=100 and returns the first page of results.
 */
export async function getPublicProducts(
  params?: GetPublicProductsParams
): Promise<ShopProduct[]> {
  const requestParams: Record<string, string | number | undefined> = {
    page: 1,
    page_size: 100,
  };
  if (params?.category) requestParams.category = params.category;
  if (params?.ordering) requestParams.ordering = params.ordering;

  try {
    const { data } = await publicClient.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: PublicProductRaw[];
    }>('/api/public/products/', { params: requestParams });
    return data.results.map(mapToShopProduct);
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    const message =
      axiosError.response?.data?.detail ??
      axiosError.response?.data?.message ??
      axiosError.message ??
      'Failed to load products';
    throw new Error(typeof message === 'string' ? message : 'Failed to load products');
  }
}
