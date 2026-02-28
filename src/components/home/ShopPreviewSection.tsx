import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { getPublicProducts } from '../../services/api/publicShopApi';
import { subscribeToShopProducts } from '../../services/firebase/shopProductService';
import type { ShopProduct } from '../../types';
import ShopPreviewCard from './ShopPreviewCard';

const PREVIEW_LIMIT = 4;

/** When server is available: show only these product names (exact match, case-insensitive). */
const PREVIEW_PRODUCT_NAMES = [
  'Azospirillum',
  'Phosphobacteria',
  'Tectona Grandis',
  'Melia dubia',
];

/** Filter to listed names in order (for server response). */
function filterToPreviewNames(fetchedProducts: ShopProduct[]): ShopProduct[] {
  return PREVIEW_PRODUCT_NAMES.reduce<ShopProduct[]>((acc, name) => {
    const found = fetchedProducts.find(
      (p) => p.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (found) acc.push(found);
    return acc;
  }, []);
}

const ShopPreviewSection: React.FC = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let firestoreUnsubscribe: (() => void) | null = null;

    const tryFirestore = () => {
      firestoreUnsubscribe = subscribeToShopProducts(
        (fetchedProducts) => {
          if (!cancelled) {
            setProducts(fetchedProducts.slice(0, PREVIEW_LIMIT));
            setError(null);
            setIsLoading(false);
          }
        },
        (err) => {
          if (!cancelled) {
            console.error('Error fetching shop preview products:', err);
            setError(err instanceof Error ? err.message : 'Failed to load products.');
            setIsLoading(false);
          }
        }
      );
    };

    // Try server first; when available show the listed products. Else fallback to Firestore (first 4).
    getPublicProducts({ page_size: 20 })
      .then((fetchedProducts) => {
        if (!cancelled) {
          const filtered = filterToPreviewNames(fetchedProducts);
          setProducts(filtered);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) tryFirestore();
      });

    return () => {
      cancelled = true;
      firestoreUnsubscribe?.();
    };
  }, []);

  if (error && products.length === 0) {
    return (
      <section id="shop" className="py-16 px-4 sm:px-6 lg:px-8 bg-shop-preview-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="h-6 w-6 text-home-heading-secondary" />
            <span className="text-home-heading-secondary font-semibold text-sm uppercase tracking-wide">
              Forest Products
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-home-heading mb-2">
            Our Eco-Store
          </h2>
          <div className="w-32 h-1 bg-gradient-gold rounded-full mx-auto mb-6" />
          <p className="text-center text-home-text-secondary text-sm mb-6">
            Seeds and bio fertilizers from the Tamil Nadu Forest Department.
          </p>
          <p className="text-center text-home-text-secondary text-sm mb-6">Unable to load products.</p>
          <div className="text-center">
            <p className="text-home-heading-secondary text-sm font-medium mb-3">More options. More to explore.</p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-shop-button-bg hover:opacity-90 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-soft transition-opacity text-sm sm:text-base"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Visit Shop
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="shop" className="py-16 px-4 sm:px-6 lg:px-8 bg-shop-preview-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="h-6 w-6 text-home-heading-secondary" />
            <span className="text-home-heading-secondary font-semibold text-sm uppercase tracking-wide">
              Forest Products
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-home-heading mb-2">
            Our Eco-Store
          </h2>
          <p className="text-center text-home-text-secondary text-sm mb-6 sm:mb-8">
            Seeds and bio fertilizers from the Tamil Nadu Forest Department.
          </p>
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-home-heading" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="shop" className="py-16 px-4 sm:px-6 lg:px-8 bg-shop-preview-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="h-6 w-6 text-home-heading-secondary" />
            <span className="text-home-heading-secondary font-semibold text-sm uppercase tracking-wide">
              Forest Products
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-home-heading mb-2">
            Our Eco-Store
          </h2>
          <div className="w-32 h-1 bg-gradient-gold rounded-full mx-auto mb-6" />
          <p className="text-center text-home-text-secondary text-sm mb-6">
            Seeds and bio fertilizers from the Tamil Nadu Forest Department.
          </p>
          <p className="text-center text-home-text-secondary text-sm mb-6">Store coming soon.</p>
          <div className="text-center">
            <p className="text-home-heading-secondary text-sm font-medium mb-3">More options. More to explore.</p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-shop-button-bg hover:opacity-90 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-soft transition-opacity text-sm sm:text-base"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Visit Shop
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-16 px-4 sm:px-6 lg:px-8 bg-shop-preview-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShoppingBag className="h-6 w-6 text-home-heading-secondary" />
          <span className="text-home-heading-secondary font-semibold text-sm uppercase tracking-wide">
            Forest Products
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-home-heading mb-2">
          Our Eco-Store
        </h2>
        <div className="w-32 h-1 bg-gradient-gold rounded-full mx-auto mb-6 sm:mb-8" />
        <p className="text-center text-home-text-secondary text-sm mb-6 sm:mb-8">
          Seeds and bio fertilizers from the Tamil Nadu Forest Department.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ShopPreviewCard key={product.id ?? product.name} product={product} />
          ))}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-home-heading-secondary text-sm font-medium mb-3">More options. More to explore.</p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-shop-button-bg hover:opacity-90 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-soft transition-opacity text-sm sm:text-base"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Visit Shop
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopPreviewSection;
