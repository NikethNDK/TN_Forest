/** Step for +/- buttons in the cart (kg). */
export const CART_QTY_STEP = 0.1;

/** Minimum line quantity (kg). */
export const CART_QTY_MIN = 0.01;

export function roundCartQty(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Clamp quantity to [min, maxStock]; returns 0 if invalid / out of range. */
export function clampCartQuantity(qty: number, maxStock: number): number {
  if (maxStock <= 0) return 0;
  const r = roundCartQty(qty);
  if (r < CART_QTY_MIN) return 0;
  return Math.min(maxStock, Math.max(CART_QTY_MIN, r));
}

/** Display without unnecessary trailing zeros (max 2 decimals). */
export function formatCartQtyForDisplay(q: number): string {
  if (!Number.isFinite(q)) return '0';
  const s = roundCartQty(q).toFixed(2);
  return s.replace(/\.?0+$/, '') || '0';
}

/** Rupee amounts (2 decimal places). */
export function formatCartMoney(n: number): string {
  if (!Number.isFinite(n)) return '0.00';
  return roundCartQty(n).toFixed(2);
}
