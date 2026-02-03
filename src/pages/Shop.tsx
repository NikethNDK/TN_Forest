/**
 * Shop Page
 * 
 * Displays products (Seeds & Bio Fertilizers) with search, filtering,
 * cart functionality, and fertilizer order form.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Sprout,
  Leaf,
  Star,
  FlaskConical,
  Loader2,
} from 'lucide-react';
import type { ShopProduct } from '../types';
import ProductCard from '../components/shop/ProductCard';
import CartSidebar from '../components/shop/CartSidebar';
import Pagination from '../components/shop/Pagination';
import BioFertilizerOrderForm from '../components/shop/BioFertilizerOrderForm';
import { getPublicProducts } from '../services/api/publicShopApi';
import { subscribeToShopProducts } from '../services/firebase/shopProductService';
import { useCart } from '../hooks/useCart';
import { useFertilizerOrderForm, FertilizerCheckoutData } from '../hooks/useFertilizerOrderForm';

/** When true, fetch from server DB and fall back to Firestore on error. When false, use Firestore only. */
const USE_SERVER_DB = false;

const ITEMS_PER_PAGE = 12;

// Public folder images for bio fertilizers (used when tab is Bio Fertilizers)
const BIO_FERTILIZER_IMAGES = [
  { name: 'Azospirillum', path: '/azospirillum.jpg' },
  { name: 'Phospho Bacteria', path: encodeURI('/phospo bacteria.jpg') },
  { name: 'Vermicasting', path: '/vermicasting.jpeg' },
  { name: 'Vesicular Arbuscular Mycorrhizae', path: encodeURI('/Vesicular Arbuscular Mycorrhizae.jpg') },
] as const;

function getBioFertilizerImageUrl(productName: string): string | undefined {
  const n = productName.toLowerCase();
  if (n.includes('azospirillum')) return BIO_FERTILIZER_IMAGES[0].path;
  if ((n.includes('phospo') || n.includes('phospho')) && n.includes('bacteria')) return BIO_FERTILIZER_IMAGES[1].path;
  if (n.includes('vermicasting')) return BIO_FERTILIZER_IMAGES[2].path;
  if ((n.includes('vesicular') && n.includes('mycorrhizae')) || n.includes('vam')) return BIO_FERTILIZER_IMAGES[3].path;
  return undefined;
}

const Shop: React.FC = () => {
  const navigate = useNavigate();

  // Products state from public API (DB)
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCart, setShowCart] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'Seeds' | 'Bio Fertilizers'>('Seeds');

  // Pagination state
  const [seedsPage, setSeedsPage] = useState<number>(1);
  const [bioFertilizersPage, setBioFertilizersPage] = useState<number>(1);
  const [searchPage, setSearchPage] = useState<number>(1);

  // Refs
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  // Custom hooks
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartItemCount,
  } = useCart();

  // Get available fertilizers (needs to be before hook call)
  const availableFertilizers = products.filter(
    (p) => p.category === 'Bio Fertilizers' && p.stock > 0
  );

  /**
   * Handle fertilizer form checkout - adds to cart and navigates to checkout
   */
  const handleFertilizerCheckout = useCallback((data: FertilizerCheckoutData) => {
    // Clear existing cart and add the fertilizer order
    clearCart();
    
    // Add product to cart with specified quantity
    // We need to add it multiple times or modify the cart item directly
    const cartItem = {
      ...data.product,
      quantity: data.quantity,
    };
    
    // Store the cart item directly in localStorage for checkout
    localStorage.setItem('tnforest_shop_cart', JSON.stringify([cartItem]));
    
    // Navigate to checkout with pre-filled delivery details
    navigate('/checkout', {
      state: {
        prefillData: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
        fromFertilizerForm: true,
      },
    });
  }, [clearCart, navigate]);

  const fertilizerForm = useFertilizerOrderForm({
    onCheckout: handleFertilizerCheckout,
    availableFertilizers,
  });

  // Fetch products: server DB (with Firestore fallback) or Firestore only, depending on USE_SERVER_DB
  useEffect(() => {
    let cancelled = false;
    let firestoreUnsubscribe: (() => void) | null = null;

    setIsLoading(true);
    setError(null);

    if (!USE_SERVER_DB) {
      firestoreUnsubscribe = subscribeToShopProducts(
        (fetchedProducts) => {
          if (!cancelled) {
            setProducts(fetchedProducts);
            setError(null);
            setIsLoading(false);
          }
        },
        (err) => {
          if (!cancelled) {
            console.error('Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'Failed to load products. Please try again later.');
            setIsLoading(false);
          }
        }
      );
      return () => {
        cancelled = true;
        firestoreUnsubscribe?.();
      };
    }

    getPublicProducts()
      .then((fetchedProducts) => {
        if (!cancelled) {
          setProducts(fetchedProducts);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Error fetching products (falling back to Firestore):', err);
          firestoreUnsubscribe = subscribeToShopProducts(
            (fetchedProducts) => {
              if (!cancelled) {
                setProducts(fetchedProducts);
                setError(null);
                setIsLoading(false);
              }
            },
            (firestoreErr) => {
              if (!cancelled) {
                setError(firestoreErr instanceof Error ? firestoreErr.message : 'Failed to load products. Please try again later.');
                setIsLoading(false);
              }
            }
          );
        }
      });
    return () => {
      cancelled = true;
      firestoreUnsubscribe?.();
    };
  }, []);

  // Reset pagination when tab or search changes
  useEffect(() => {
    setSeedsPage(1);
    setBioFertilizersPage(1);
    setSearchPage(1);
  }, [activeTab, searchTerm]);

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });

  const seedsSaplings = filteredProducts.filter((p) => p.category === 'Seeds');
  const bioFertilizers = filteredProducts.filter((p) => p.category === 'Bio Fertilizers');
  const combinedSearchResults = searchTerm ? [...seedsSaplings, ...bioFertilizers] : [];

  // Pagination helpers
  const getPaginatedProducts = (productList: ShopProduct[], page: number): ShopProduct[] => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return productList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const getTotalPages = (productList: ShopProduct[]): number => {
    return Math.ceil(productList.length / ITEMS_PER_PAGE);
  };

  return (
    <div className="py-16 bg-background-page min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Leaf className="h-10 w-10 text-accent-darker mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-content-heading mb-4">
          TamilNadu Forest Department's Research Eco-Store
          </h1>
          <p className="text-lg text-content-secondary max-w-4xl mx-auto leading-relaxed">
            Explore high-quality saplings, seeds, and bio-fertilizers
            from our research centers, for sustainable cultivation and
            afforestation projects in India.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-background-paper rounded-xl shadow-xl p-5 mb-12 sticky top-20 z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
              <input
                type="text"
                placeholder="Search for Teak, Sandalwood, Mango seeds, Bio-fertilizers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-form-inputBorder rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-form-inputFocus transition-shadow text-content-primary"
              />
            </div>

            <button
              ref={cartButtonRef}
              onClick={() => setShowCart(!showCart)}
              className="relative bg-interactive-primaryDefault hover:bg-interactive-primaryHover text-interactive-primaryText px-6 py-3 rounded-lg font-bold transition-colors duration-300 flex items-center shadow-lg w-full md:w-auto flex-shrink-0"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {showCart ? 'Hide Order' : 'View Order'}
              {getCartItemCount() > 0 && (
                <span className="absolute -top-3 -right-3 bg-status-error-main text-content-inverse text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold ring-2 ring-background-paper">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-background-paper rounded-xl shadow-xl">
            <Loader2 className="h-12 w-12 text-accent-darker animate-spin mb-4" />
            <p className="text-content-secondary font-medium">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16 bg-background-paper rounded-xl shadow-xl">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-bold text-status-error-main mb-2">
              Unable to Load Products
            </h3>
            <p className="text-content-secondary mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-interactive-primaryDefault text-interactive-primaryText rounded-lg font-semibold hover:bg-interactive-primaryHover transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Display */}
        {!isLoading && !error && (
          <div>
            {searchTerm ? (
              // Search Results View
              combinedSearchResults.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-content-heading mb-2 flex items-center">
                      <Search className="h-7 w-7 mr-3 text-accent-darker" />
                      Search Results
                    </h2>
                    <p className="text-content-secondary">
                      Found {combinedSearchResults.length} product
                      {combinedSearchResults.length !== 1 ? 's' : ''} matching "
                      {searchTerm}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {getPaginatedProducts(combinedSearchResults, searchPage).map(
                      (product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          addToCart={addToCart}
                        />
                      )
                    )}
                  </div>

                  <Pagination
                    currentPage={searchPage}
                    totalPages={getTotalPages(combinedSearchResults)}
                    onPageChange={setSearchPage}
                  />
                </div>
              ) : (
                <div className="text-center py-16 bg-background-paper rounded-xl shadow-xl">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-content-heading mb-2">
                    No Products Match Your Search
                  </h3>
                  <p className="text-content-secondary">
                    Try a broader search term (e.g., 'tree', 'fertilizer') or check
                    the Seeds and Bio Fertilizers sections.
                  </p>
                </div>
              )
            ) : (
              // Tabbed View
              <div>
                {/* Category Tabs */}
                <div className="bg-background-paper rounded-t-xl border-b border-border-light mb-0 flex">
                  <button
                    onClick={() => setActiveTab('Seeds')}
                    className={`flex-1 px-6 py-4 font-semibold text-lg transition-all relative ${
                      activeTab === 'Seeds'
                        ? 'text-primary-main bg-background-paper'
                        : 'text-content-secondary hover:text-primary-main hover:bg-background-page'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Sprout
                        className={`h-5 w-5 mr-2 ${
                          activeTab === 'Seeds' ? 'text-accent-darker' : 'text-content-muted'
                        }`}
                      />
                      Seeds
                      {seedsSaplings.length > 0 && (
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                            activeTab === 'Seeds'
                              ? 'bg-badge-inStockBg text-badge-inStockText'
                              : 'bg-interactive-disabled text-interactive-disabledText'
                          }`}
                        >
                          {seedsSaplings.length}
                        </span>
                      )}
                    </div>
                    {activeTab === 'Seeds' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-main rounded-t-full"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('Bio Fertilizers')}
                    className={`flex-1 px-6 py-4 font-semibold text-lg transition-all relative ${
                      activeTab === 'Bio Fertilizers'
                        ? 'text-primary-main bg-background-paper'
                        : 'text-content-secondary hover:text-primary-main hover:bg-background-page'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <FlaskConical
                        className={`h-5 w-5 mr-2 ${
                          activeTab === 'Bio Fertilizers'
                            ? 'text-accent-darker'
                            : 'text-content-muted'
                        }`}
                      />
                      Bio Fertilizers
                      {bioFertilizers.length > 0 && (
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                            activeTab === 'Bio Fertilizers'
                              ? 'bg-badge-inStockBg text-badge-inStockText'
                              : 'bg-interactive-disabled text-interactive-disabledText'
                          }`}
                        >
                          {bioFertilizers.length}
                        </span>
                      )}
                    </div>
                    {activeTab === 'Bio Fertilizers' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-main rounded-t-full"></div>
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="bg-background-paper rounded-b-xl shadow-xl p-6 border-t-0">
                  {activeTab === 'Seeds' ? (
                    seedsSaplings.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                          {getPaginatedProducts(seedsSaplings, seedsPage).map(
                            (product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                addToCart={addToCart}
                              />
                            )
                          )}
                        </div>
                        <Pagination
                          currentPage={seedsPage}
                          totalPages={getTotalPages(seedsSaplings)}
                          onPageChange={setSeedsPage}
                        />
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <Sprout className="h-16 w-16 text-content-muted mx-auto mb-4" />
                        <p className="text-content-secondary">No seeds available at the moment.</p>
                      </div>
                    )
                  ) : bioFertilizers.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {getPaginatedProducts(bioFertilizers, bioFertilizersPage).map(
                          (product) => (
                            <ProductCard
                              key={product.id}
                              product={{
                                ...product,
                                imageUrl: product.imageUrl || getBioFertilizerImageUrl(product.name),
                              }}
                              addToCart={addToCart}
                            />
                          )
                        )}
                      </div>
                      <Pagination
                        currentPage={bioFertilizersPage}
                        totalPages={getTotalPages(bioFertilizers)}
                        onPageChange={setBioFertilizersPage}
                      />
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <FlaskConical className="h-16 w-16 text-content-muted mx-auto mb-4" />
                      <p className="text-content-secondary">
                        No bio fertilizers available at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Sidebar */}
        <CartSidebar
          cart={cart}
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cartButtonRef={cartButtonRef}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          getTotalPrice={getTotalPrice}
          getCartItemCount={getCartItemCount}
        />

        {/* Bio Fertilizer Order Form */}
        <BioFertilizerOrderForm
          formData={fertilizerForm.formData}
          showToast={fertilizerForm.showToast}
          nearestLocation={fertilizerForm.nearestLocation}
          availableFertilizers={availableFertilizers}
          updateFormField={fertilizerForm.updateFormField}
          handleTransportationChange={fertilizerForm.handleTransportationChange}
          handleSubmit={fertilizerForm.handleSubmit}
          closeToast={fertilizerForm.closeToast}
          isFormValid={fertilizerForm.isFormValid}
        />

        {/* Quality Commitment Section */}
        <div className="mt-20 bg-primary-darker rounded-xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold text-accent-light mb-8 text-center">
            Our Commitment to Quality
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-content-inverse">
            <div className="text-center p-4 rounded-lg bg-primary-dark border border-border-primary">
              <div className="w-16 h-16 bg-accent-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Star className="h-8 w-8 text-content-heading" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Genetic Purity</h3>
              <p className="text-content-inverseSecondary text-sm">
                All seeds, saplings, and bio-fertilizers are verified for superior
                quality and traceability by our accredited labs.
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary-dark border border-border-primary">
              <div className="w-16 h-16 bg-accent-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <ShoppingCart className="h-8 w-8 text-content-heading" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct from Research</h3>
              <p className="text-content-inverseSecondary text-sm">
                Purchases directly fund ongoing forestry research, conservation
                efforts, and climate mitigation studies.
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary-dark border border-border-primary">
              <div className="w-16 h-16 bg-accent-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Leaf className="h-8 w-8 text-content-heading" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-content-inverseSecondary text-sm">
                Gain exclusive access to planting protocols and long-term support
                from our experienced forestry scientists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
