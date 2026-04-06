import React, { useEffect, useMemo, useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import type { ShopProduct } from '../../types';
import { pickDefaultListing } from '../../utils/shopCatalogGroups';

export interface CatalogProductCardProps {
  offers: ShopProduct[];
  addToCart: (product: ShopProduct) => void;
  /** Optional image URL resolver (e.g. bio-fertilizer public assets). */
  resolveImageUrl?: (product: ShopProduct) => string | undefined;
}

const CatalogProductCard: React.FC<CatalogProductCardProps> = ({
  offers,
  addToCart,
  resolveImageUrl,
}) => {
  const defaultOffer = useMemo(() => pickDefaultListing(offers), [offers]);

  const [selectedId, setSelectedId] = useState<string>(() => String(defaultOffer.id ?? ''));

  useEffect(() => {
    const def = pickDefaultListing(offers);
    setSelectedId(String(def.id ?? ''));
  }, [offers]);

  const selected =
    offers.find((o) => String(o.id) === selectedId) ?? pickDefaultListing(offers);

  const displayImage = resolveImageUrl
    ? resolveImageUrl(selected) ?? selected.imageUrl
    : selected.imageUrl;

  const inStock = selected.stock > 0;
  const stockDisplay = inStock ? `${selected.stock} ${selected.unit}` : 'Out of Stock';
  const multiSupplier = offers.length > 1;

  return (
    <div className="group font-shop-body flex flex-col bg-background-paper rounded-2xl shadow-[0_8px_30px_rgba(22,59,38,0.08)] overflow-hidden border border-border-lightest/80 ring-1 ring-black/[0.03] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(22,59,38,0.12)] hover:-translate-y-0.5">
      <div className="relative h-44 bg-gradient-to-br from-primary-lightest via-background-page to-primary-lightest overflow-hidden">
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={selected.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end gap-2">
              <span className="bg-background-paper/92 backdrop-blur-sm text-primary-main font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm border border-border-lightest/60">
                {selected.category}
              </span>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_30%_20%,rgba(45,90,61,0.12),transparent_50%)]">
            <div className="text-5xl mb-2 drop-shadow-sm">{selected.imageIcon || '🌿'}</div>
            <div className="text-primary-main font-shop-display font-semibold text-center text-sm tracking-wide">
              {selected.category}
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-shop-display text-lg font-semibold text-content-heading mb-3 leading-snug tracking-tight">
          {selected.name}
        </h3>

        {multiSupplier ? (
          <label className="block mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-content-muted mb-1.5 block">
              Supplier
            </span>
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full appearance-none pl-3 pr-9 py-2.5 rounded-xl border border-form-inputBorder bg-background-paper text-content-primary text-sm font-medium focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus transition-shadow"
                aria-label="Select supplier"
              >
                {offers.map((o) => (
                  <option key={String(o.id)} value={String(o.id)}>
                    {o.divisionName ?? 'Supplier'}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted pointer-events-none" />
            </div>
          </label>
        ) : (
          <p className="text-sm text-content-secondary mb-3">
            <span className="text-content-muted font-medium">Supplier: </span>
            {selected.divisionName ?? '—'}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2 border-t border-border-lightest">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-content-muted font-semibold mb-0.5">
              Price
            </p>
            <span className="text-2xl font-shop-display font-bold text-primary-main tabular-nums">
              ₹{selected.price}
            </span>
          </div>
          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
              inStock
                ? 'bg-badge-inStockBg text-badge-inStockText'
                : 'bg-badge-outOfStockBg text-badge-outOfStockText'
            }`}
          >
            {stockDisplay}
          </span>
        </div>

        <button
          type="button"
          onClick={() => addToCart(selected)}
          disabled={!inStock}
          className={`mt-4 w-full py-3 px-4 rounded-xl font-shop-body font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-md ${
            inStock
              ? 'bg-interactive-secondaryDefault hover:bg-interactive-secondaryHover text-interactive-secondaryText active:scale-[0.98]'
              : 'bg-interactive-disabled text-interactive-disabledText cursor-not-allowed'
          }`}
        >
          <Plus className="h-4 w-4" />
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default CatalogProductCard;
