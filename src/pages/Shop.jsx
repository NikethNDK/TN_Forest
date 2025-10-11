import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, Sprout, Leaf, Zap, Star } from 'lucide-react';

// --- MOCK DATA (Self-contained for canvas runnability) ---
const mockShopProducts = [
  // Saplings (6 items)
  { id: 1, name: 'Clonal Teak Sapling (High-Density)', description: 'High-quality clonal teak known for fast growth and superior wood density. Ideal for long-term timber investment in tropical climates.', price: 150, category: 'Saplings', inStock: true, imageIcon: '🌳' },
  { id: 2, name: 'Red Sanders Sapling', description: 'Rare and protected red sanders sapling. Requires specific soil conditions and permits for commercial growth.', price: 500, category: 'Saplings', inStock: true, imageIcon: '🌲' },
  { id: 3, name: 'Neem Sapling (Azadirachta indica)', description: 'Medicinal and shade-providing neem sapling. Tolerant of drought conditions and poor soil quality.', price: 40, category: 'Saplings', inStock: true, imageIcon: '🌿' },
  { id: 4, name: 'African Mahogany Sapling', description: 'Tropical hardwood mahogany sapling. Excellent for furniture and construction, known for its rapid growth rate.', price: 120, category: 'Saplings', inStock: true, imageIcon: '🌳' },
  { id: 5, name: 'Grafted Mango Tree Sapling (Alphonso)', description: 'Grafted mango sapling (Alphonso variety) for quick fruit bearing and high commercial value.', price: 250, category: 'Saplings', inStock: true, imageIcon: '🥭' },
  { id: 6, name: 'Bamboo Clump Starter (Giant Dendrocalamus)', description: 'Fast-growing giant bamboo species for erosion control and heavy construction.', price: 90, category: 'Saplings', inStock: false, imageIcon: '🎍' },

  // Seeds (6 items)
  { id: 7, name: 'Premium Sandalwood Seeds', description: 'Premium grade sandalwood seeds for propagation and perfumery. Requires host plants for successful germination.', price: 300, category: 'Seeds', inStock: true, imageIcon: '🌰' },
  { id: 8, name: 'Eucalyptus Grandis Seeds (Industrial Grade)', description: 'Fast-growing industrial eucalyptus seeds for pulp, paper, and biofuel production.', price: 50, category: 'Seeds', inStock: true, imageIcon: '🌱' },
  { id: 9, name: 'Acacia Nilotica Seeds (Babul)', description: 'Vachellia nilotica seeds used for traditional medicine, tannin extraction, and animal fodder.', price: 40, category: 'Seeds', inStock: true, imageIcon: '🌾' },
  { id: 10, name: 'High-Yield Tamarind Seeds', description: 'Certified high-yield tamarind seeds for commercial cultivation and excellent fruit production.', price: 60, category: 'Seeds', inStock: true, imageIcon: '🍋' },
  { id: 11, name: 'Rare Medicinal Herb Seed Mix', description: 'A curated mix of rare medicinal herb seeds for home gardens and research purposes.', price: 180, category: 'Seeds', inStock: true, imageIcon: '🌼' },
  { id: 12, name: 'Banyan Tree Seeds (Ficus benghalensis)', description: 'Seeds of the majestic and culturally significant banyan tree, ideal for large landscapes.', price: 100, category: 'Seeds', inStock: false, imageIcon: '🌳' },
];
// --- END MOCK DATA ---

const INITIAL_LIMIT = 4;

const ProductCard = ({ product, addToCart }) => (
  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-lime-400 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
    <div className="h-36 bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="text-5xl mb-2">{product.imageIcon}</div>
      <div className="text-green-700 font-semibold text-center text-sm">{product.category}</div>
    </div>
    <div className="p-6">
      <div className="h-20 mb-4"> 
        <h3 className="text-lg font-bold text-green-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs line-clamp-2">
          {product.description}
        </p>
      </div>
      
      <div className="flex items-center justify-between mb-4 border-t border-gray-100 pt-3">
        <span className="text-2xl font-extrabold text-green-700">
          ₹{product.price}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
          product.inStock 
              ? 'bg-lime-100 text-lime-800' 
              : 'bg-red-100 text-red-800'
        }`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <button
        onClick={() => addToCart(product)}
        disabled={!product.inStock}
        className={`w-full py-3 px-4 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center shadow-lg ${
          product.inStock
              ? 'bg-lime-500 hover:bg-lime-600 text-green-900 disabled:bg-gray-300'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Plus className="h-4 w-4 mr-2" />
        {product.inStock ? 'Add to Order' : 'Notify Me'}
      </button>
    </div>
  </div>
);

const ProductSection = ({ title, icon: Icon, products, limit, setLimit, addToCart }) => {
  const isExpanded = limit === products.length;
  const itemsToDisplay = products.slice(0, limit);

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-green-900 mb-8 flex items-center">
        <Icon className="h-7 w-7 mr-3 text-lime-600" />
        {title}
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <Leaf className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No {title.toLowerCase()} currently match your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itemsToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>

          {products.length > INITIAL_LIMIT && (
            <div className="text-center mt-8">
              <button
                onClick={() => setLimit(isExpanded ? INITIAL_LIMIT : products.length)}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md flex items-center justify-center mx-auto"
              >
                {isExpanded ? (
                  <>Show Less</>
                ) : (
                  <>View {products.length - INITIAL_LIMIT} More Products <Zap className="h-4 w-4 ml-2" /></>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};


const Shop = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  
  const [saplingLimit, setSaplingLimit] = useState(INITIAL_LIMIT);
  const [seedLimit, setSeedLimit] = useState(INITIAL_LIMIT);

  // Refs for cart and cart button to detect outside clicks
  const cartRef = useRef(null);
  const cartButtonRef = useRef(null);

  // --- NEW: Outside Click Handler ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (showCart && 
          cartRef.current && 
          !cartRef.current.contains(event.target) &&
          cartButtonRef.current &&
          !cartButtonRef.current.contains(event.target)
      ) {
        setShowCart(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCart]);
  // --- END NEW: Outside Click Handler ---

  const filteredProducts = mockShopProducts.filter(product => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(term) ||
                          product.description.toLowerCase().includes(term);
    return matchesSearch;
  });

  const saplings = filteredProducts.filter(p => p.category === 'Saplings');
  const seeds = filteredProducts.filter(p => p.category === 'Seeds');

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    // FIX: Removed setShowCart(true) here
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="py-16 bg-gray-50 min-h-screen font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background-color: #a7f3d0; border-radius: 3px; }
        .overflow-y-auto::-webkit-scrollbar-track { background-color: #f0fdf4; }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
            <Leaf className="h-10 w-10 text-lime-600 mx-auto mb-3" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4">
                Forest Products Research Supply
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover high-quality saplings and seeds, genetically verified by our research centers, 
                for sustainable cultivation and afforestation projects in India.
            </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-5 mb-12 sticky top-20 z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Teak, Sandalwood, Mango seeds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
              />
            </div>
            
            <button
                ref={cartButtonRef} /* Attach ref to the button */
                onClick={() => setShowCart(!showCart)}
                className="relative bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-300 flex items-center shadow-lg w-full md:w-auto flex-shrink-0"
            >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {showCart ? 'Hide Order' : 'View Order'}
                {getCartItemCount() > 0 && (
                    <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold ring-2 ring-white">
                    {getCartItemCount()}
                    </span>
                )}
            </button>
          </div>
        </div>

        <div>
          {filteredProducts.length > 0 ? (
              <div className="space-y-16">
                {saplings.length > 0 && (
                  <ProductSection 
                      title="Saplings (Planting Material)"
                      icon={Sprout}
                      products={saplings}
                      limit={saplingLimit}
                      setLimit={setSaplingLimit}
                      addToCart={addToCart}
                  />
                )}

                {seeds.length > 0 && (
                  <ProductSection 
                      title="Seeds & Propagules"
                      icon={Leaf}
                      products={seeds}
                      limit={seedLimit}
                      setLimit={setSeedLimit}
                      addToCart={addToCart}
                  />
                )}
              </div>
          ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-xl">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                      No Products Match Your Search
                  </h3>
                  <p className="text-gray-600">
                      Try a broader search term (e.g., 'tree') or check both the Saplings and Seeds sections.
                  </p>
              </div>
          )}
        </div>

        {showCart && (
          <div 
            ref={cartRef} /* Attach ref to the cart panel */
            className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] z-50 animate-slideIn"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 border-t-4 border-lime-500 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
              <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center border-b pb-4 border-gray-100">
                <ShoppingCart className="h-6 w-6 mr-3 text-lime-600" />
                Your Order ({getCartItemCount()})
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-10 bg-green-50 rounded-lg">
                  <Sprout className="h-10 w-10 text-green-500 mx-auto mb-4" />
                  <p className="text-green-700 font-medium">Start your green journey by adding items!</p>
                </div>
              ) : (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                      {cart.map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                              <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-green-800 text-sm flex-1 pr-2 line-clamp-2">
                                      {item.name}
                                  </h4>
                                  <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
                                  >
                                      <Trash2 className="h-4 w-4" />
                                  </button>
                              </div>
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                                      <button
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                                          disabled={item.quantity === 1}
                                      >
                                          <Minus className="h-3 w-3 text-gray-700" />
                                      </button>
                                      <span className="text-sm font-bold text-green-900 w-4 text-center">{item.quantity}</span>
                                      <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="w-6 h-6 rounded-md bg-lime-500 flex items-center justify-center hover:bg-lime-600 transition-colors"
                                      >
                                          <Plus className="h-3 w-3 text-green-900" />
                                      </button>
                                  </div>
                                  <span className="text-lg font-extrabold text-green-700">
                                      ₹{item.price * item.quantity}
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="border-t border-gray-200 pt-5 mt-5">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-xl font-semibold text-green-900">
                        Order Total:
                      </span>
                      <span className="text-3xl font-extrabold text-lime-600">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                    <button className="w-full bg-lime-500 hover:bg-lime-600 text-green-900 py-3 rounded-lg font-bold transition-colors duration-300 shadow-md text-lg">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-20 bg-green-900 rounded-xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold text-lime-400 mb-8 text-center">
            Our Commitment to Quality
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="text-center p-4 rounded-lg bg-green-800 border border-green-700">
              <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Star className="h-8 w-8 text-green-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Genetic Purity
              </h3>
              <p className="text-green-200 text-sm">
                All seeds and saplings are verified for superior genetic quality and traceability by our accredited labs.
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-800 border border-green-700">
              <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <ShoppingCart className="h-8 w-8 text-green-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Direct from Research
              </h3>
              <p className="text-green-200 text-sm">
                Purchases directly fund ongoing forestry research, conservation efforts, and climate mitigation studies.
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-800 border border-green-700">
              <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Leaf className="h-8 w-8 text-green-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Expert Guidance
              </h3>
              <p className="text-green-200 text-sm">
                Gain exclusive access to planting protocols and long-term support from our experienced forestry scientists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
