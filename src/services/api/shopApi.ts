/**
 * Shop backend API client (Django TN_Forest_Shop).
 * Uses Firebase ID token for Authorization: Bearer.
 */

import { getIdToken } from '../firebase/authService';
import type { ShopDivision } from '../../types';

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_SHOP_API_URL;
  if (!url || typeof url !== 'string') {
    throw new Error('VITE_SHOP_API_URL is not set. Add it to your .env file.');
  }
  return url.replace(/\/$/, '');
};

async function authenticatedFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getIdToken();
  if (!token) {
    throw new Error('Not authenticated. Please sign in again.');
  }
  const base = getBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  return res;
}

async function handleJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = text ? JSON.parse(text) : {};
      message = data.detail ?? data.name?.[0] ?? data.message ?? message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export type { ShopDivision };

export async function getDivisions(): Promise<ShopDivision[]> {
  const res = await authenticatedFetch('/api/divisions/');
  return handleJsonResponse<ShopDivision[]>(res);
}

export async function getDivision(id: number): Promise<ShopDivision> {
  const res = await authenticatedFetch(`/api/divisions/${id}/`);
  return handleJsonResponse<ShopDivision>(res);
}

export async function createDivision(name: string): Promise<ShopDivision> {
  const res = await authenticatedFetch('/api/divisions/', {
    method: 'POST',
    body: JSON.stringify({ name: name.trim() }),
  });
  return handleJsonResponse<ShopDivision>(res);
}

export async function updateDivision(
  id: number,
  payload: { name: string }
): Promise<ShopDivision> {
  const res = await authenticatedFetch(`/api/divisions/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ name: payload.name.trim() }),
  });
  return handleJsonResponse<ShopDivision>(res);
}

export async function deleteDivision(id: number): Promise<void> {
  const res = await authenticatedFetch(`/api/divisions/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const text = await res.text();
    let message = res.statusText;
    try {
      const data = text ? JSON.parse(text) : {};
      message = data.detail ?? data.name?.[0] ?? data.message ?? message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }
}
