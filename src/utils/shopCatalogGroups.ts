import type { ShopProduct } from '../types';

export interface CatalogProductGroup {
  key: string;
  title: string;
  items: ShopProduct[];
}

/** Group flat listing rows by global catalog product (multi-supplier marketplace). */
export function groupProductsByCatalogId(list: ShopProduct[]): CatalogProductGroup[] {
  const map = new Map<string, ShopProduct[]>();
  const order: string[] = [];
  for (const p of list) {
    const key = String(p.productId ?? p.id ?? p.name);
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(p);
  }
  return order.map((key) => {
    const items = map.get(key)!;
    return { key, title: items[0]?.name ?? key, items };
  });
}

/** Prefer first in-stock offer; otherwise first row. */
export function pickDefaultListing(offers: ShopProduct[]): ShopProduct {
  if (offers.length === 0) {
    throw new Error('pickDefaultListing: empty offers');
  }
  const inStock = offers.find((o) => o.stock > 0);
  return inStock ?? offers[0];
}

export function paginateGroups<T>(groups: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return groups.slice(start, start + pageSize);
}

export function totalPagesForGroups(groupCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(groupCount / pageSize));
}
