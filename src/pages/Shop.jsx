import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, Sprout, Leaf, Zap, Star, FlaskConical, Mail, MapPin, Truck, X, CheckCircle, User, Phone, Package } from 'lucide-react';

// --- MOCK DATA (Self-contained for canvas runnability) ---
const mockShopProducts = [
  // Seeds & Saplings (12 items)
  { id: 1, name: 'Clonal Teak Sapling (High-Density)', description: 'High-quality clonal teak known for fast growth and superior wood density. Ideal for long-term timber investment in tropical climates.', price: 150, category: 'Seeds & Saplings', inStock: true, imageIcon: '🌳' },
  { id: 2, name: 'Red Sanders Sapling', description: 'Rare and protected red sanders sapling. Requires specific soil conditions and permits for commercial growth.', price: 500, category: 'Seeds & Saplings', inStock: true, imageIcon: '🌲' },
  { id: 3, name: 'Neem Sapling (Azadirachta indica)', description: 'Medicinal and shade-providing neem sapling. Tolerant of drought conditions and poor soil quality.', price: 40, category: 'Seeds & Saplings', inStock: true, imageIcon: '🌿' },
  { id: 4, name: 'African Mahogany Sapling', description: 'Tropical hardwood mahogany sapling. Excellent for furniture and construction, known for its rapid growth rate.', price: 120, category: 'Seeds & Saplings', inStock: true, imageIcon: '🌳' },
  { id: 5, name: 'Grafted Mango Tree Sapling (Alphonso)', description: 'Grafted mango sapling (Alphonso variety) for quick fruit bearing and high commercial value.', price: 250, category: 'Seeds & Saplings', inStock: true, imageIcon: '🥭' },
  { id: 6, name: 'Bamboo Clump Starter (Giant Dendrocalamus)', description: 'Fast-growing giant bamboo species for erosion control and heavy construction.', price: 90, category: 'Seeds & Saplings', inStock: false, imageIcon: '🎍' },
  { id: 7, name: 'Premium Sandalwood Seeds', description: 'Premium grade sandalwood seeds for propagation and perfumery. Requires host plants for successful germination.', price: 300, category: 'Seeds & Saplings', inStock: true, imageIcon: '🌰' },
  { id: 8, name: 'Eucalyptus Grandis Seeds (Industrial Grade)', description: 'Fast-growing industrial eucalyptus seeds for pulp, paper, and biofuel production.', price: 50, category: 'Seeds & Saplings', inStock: true, imageIcon: '🌱' },
  { id: 9, name: 'Acacia Nilotica Seeds (Babul)', description: 'Vachellia nilotica seeds used for traditional medicine, tannin extraction, and animal fodder.', price: 40, category: 'Seeds & Saplings', inStock: true, imageIcon: '🌾' },
  { id: 10, name: 'High-Yield Tamarind Seeds', description: 'Certified high-yield tamarind seeds for commercial cultivation and excellent fruit production.', price: 60, category: 'Seeds & Saplings', inStock: true, imageIcon: '🍋' },
  { id: 11, name: 'Rare Medicinal Herb Seed Mix', description: 'A curated mix of rare medicinal herb seeds for home gardens and research purposes.', price: 180, category: 'Seeds & Saplings', inStock: true, imageIcon: '🌼' },
  { id: 12, name: 'Banyan Tree Seeds (Ficus benghalensis)', description: 'Seeds of the majestic and culturally significant banyan tree, ideal for large landscapes.', price: 100, category: 'Seeds & Saplings', inStock: false, imageIcon: '🌳' },

  // Bio Fertilizers (6 items)
  { id: 13, name: 'Vermicompost (Organic)', description: 'High-quality organic vermicompost produced using earthworms. Enhances soil structure, fertility, and microbial activity for optimal plant growth.', price: 80, category: 'Bio Fertilizers', inStock: true, imageIcon: '🐛' },
  { id: 14, name: 'VAM (Vesicular Arbuscular Mycorrhizae)', description: 'Beneficial mycorrhizal fungi that form symbiotic relationships with plant roots, improving nutrient and water absorption.', price: 120, category: 'Bio Fertilizers', inStock: true, imageIcon: '🍄' },
  { id: 15, name: 'Azospirillum (Nitrogen-Fixing Bacteria)', description: 'Premium nitrogen-fixing bacteria that enhance soil nitrogen levels naturally, reducing the need for chemical fertilizers.', price: 95, category: 'Bio Fertilizers', inStock: true, imageIcon: '🦠' },
  { id: 16, name: 'Phosphobacteria (Phosphate Solubilizing)', description: 'Phosphate-solubilizing bacteria that convert insoluble phosphates into plant-available forms, promoting root development.', price: 100, category: 'Bio Fertilizers', inStock: true, imageIcon: '🔬' },
  { id: 17, name: 'Pseudomonas sp. (Root-Rot Suppressing)', description: 'Beneficial bacteria that suppress soil-borne pathogens and root rot diseases, protecting plant health naturally.', price: 110, category: 'Bio Fertilizers', inStock: true, imageIcon: '🛡️' },
  { id: 18, name: 'Trichoderma viride (Fungal Biocontrol)', description: 'Beneficial fungus that acts as a biocontrol agent against harmful pathogens while promoting plant growth and root health.', price: 105, category: 'Bio Fertilizers', inStock: false, imageIcon: '🌱' },
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
  
  const [seedsSaplingsLimit, setSeedsSaplingsLimit] = useState(INITIAL_LIMIT);
  const [bioFertilizersLimit, setBioFertilizersLimit] = useState(INITIAL_LIMIT);

  // Form state for on-demand fertilizers
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    selectedFertilizer: '',
    quantity: '',
    transportation: '',
    address: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [nearestLocation, setNearestLocation] = useState(null);

  // Mock locations (research centers)
  const locations = [
    { name: 'Thoppur Modern Nursery Centre', address: 'Thoppur RF, Dharmapuri', distance: '5 km' },
    { name: 'Harur Modern Nursery Centre', address: 'Harur RF, Dharmapuri', distance: '8 km' },
    { name: 'Kalamavoor Modern Nursery Centre', address: 'Kalamavoor Patthai RF, Pudukottai', distance: '12 km' },
    { name: 'Valkaradu Modern Nursery Centre', address: 'Valkaradu RF, Theni', distance: '15 km' },
    { name: 'Alwarmalai Modern Nursery Centre', address: 'Alwarmalai RF, Villupuram', distance: '20 km' },
  ];

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

  const seedsSaplings = filteredProducts.filter(p => p.category === 'Seeds & Saplings');
  const bioFertilizers = filteredProducts.filter(p => p.category === 'Bio Fertilizers');
  
  // Get available bio-fertilizers for the dropdown
  const availableFertilizers = bioFertilizers;

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

  // Handle transportation option change
  const handleTransportationChange = (value) => {
    setFormData({ ...formData, transportation: value, address: '' });
    setNearestLocation(null);
    
    if (value === 'no') {
      // Find nearest location (mock - just use first location)
      setNearestLocation(locations[0]);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.selectedFertilizer || !formData.quantity || !formData.transportation || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    // Show toast message
    setShowToast(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        selectedFertilizer: '',
        quantity: '',
        transportation: '',
        address: ''
      });
      setNearestLocation(null);
    }, 5000);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
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
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .animate-fadeOut {
          animation: fadeOut 0.5s ease-out;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
            <Leaf className="h-10 w-10 text-lime-600 mx-auto mb-3" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4">
                Forest Products Research Supply
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover high-quality saplings, seeds, and bio-fertilizers, genetically verified by our research centers, 
                for sustainable cultivation and afforestation projects in India.
            </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-5 mb-12 sticky top-20 z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Teak, Sandalwood, Mango seeds, Bio-fertilizers..."
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
                {seedsSaplings.length > 0 && (
                  <ProductSection 
                      title="Seeds & Saplings"
                      icon={Sprout}
                      products={seedsSaplings}
                      limit={seedsSaplingsLimit}
                      setLimit={setSeedsSaplingsLimit}
                      addToCart={addToCart}
                  />
                )}

                {bioFertilizers.length > 0 && (
                  <ProductSection 
                      title="Bio Fertilizers"
                      icon={FlaskConical}
                      products={bioFertilizers}
                      limit={bioFertilizersLimit}
                      setLimit={setBioFertilizersLimit}
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
                      Try a broader search term (e.g., 'tree', 'fertilizer') or check the Seeds & Saplings and Bio Fertilizers sections.
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

        {/* On-Demand Fertilizer Order Form */}
        <div className="mt-20 bg-white rounded-xl p-8 shadow-2xl border-t-4 border-lime-500">
          <div className="text-center mb-8">
            <FlaskConical className="h-12 w-12 text-lime-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-900 mb-2">
              Order Custom Bio-Fertilizers (Made on Demand)
            </h2>
            <p className="text-gray-600">
              Some of our specialized bio-fertilizers are produced on-demand. Place your order below and we'll prepare it for you.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-green-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-green-900 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-green-900 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Fertilizer Selection */}
            <div>
              <label htmlFor="fertilizer" className="block text-sm font-semibold text-green-900 mb-2">
                Select Bio-Fertilizer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FlaskConical className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <select
                  id="fertilizer"
                  required
                  value={formData.selectedFertilizer}
                  onChange={(e) => setFormData({ ...formData, selectedFertilizer: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700 appearance-none bg-white"
                >
                  <option value="">-- Select a Bio-Fertilizer --</option>
                  {availableFertilizers.map((fertilizer) => (
                    <option key={fertilizer.id} value={fertilizer.id}>
                      {fertilizer.name}
                    </option>
                  ))}
                </select>
              </div>
              {formData.selectedFertilizer && (
                <p className="mt-2 text-sm text-gray-600">
                  {availableFertilizers.find(f => f.id.toString() === formData.selectedFertilizer)?.description}
                </p>
              )}
            </div>

            {/* Quantity Field */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold text-green-900 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="quantity"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700"
                  placeholder="Enter quantity (e.g., 50 kgs, 100 liters)"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Please specify the quantity you need (in kgs or liters)</p>
            </div>

            {/* Transportation Radio Buttons */}
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-3">
                Do you need transportation? <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-green-50 border-gray-200 hover:border-lime-500">
                  <input
                    type="radio"
                    name="transportation"
                    value="yes"
                    checked={formData.transportation === 'yes'}
                    onChange={(e) => handleTransportationChange(e.target.value)}
                    className="mr-3 h-5 w-5 text-lime-600 focus:ring-lime-500"
                    required
                  />
                  <Truck className="h-5 w-5 mr-2 text-green-700" />
                  <span className="font-medium text-green-900">Yes, deliver to my address</span>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-green-50 border-gray-200 hover:border-lime-500">
                  <input
                    type="radio"
                    name="transportation"
                    value="no"
                    checked={formData.transportation === 'no'}
                    onChange={(e) => handleTransportationChange(e.target.value)}
                    className="mr-3 h-5 w-5 text-lime-600 focus:ring-lime-500"
                    required
                  />
                  <MapPin className="h-5 w-5 mr-2 text-green-700" />
                  <span className="font-medium text-green-900">No, I'll pick it up</span>
                </label>
              </div>
            </div>

            {/* Address Field */}
            {formData.transportation && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-green-900 mb-2">
                    {formData.transportation === 'yes' ? 'Delivery Address' : 'Your Address (for finding nearest location)'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-shadow text-gray-700 resize-none"
                    rows="3"
                    placeholder={formData.transportation === 'yes' ? 'Enter your complete delivery address' : 'Enter your address to find the nearest pickup location'}
                  />
                </div>

                {/* Nearest Location for Pickup */}
                {formData.address && formData.transportation === 'no' && nearestLocation && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-green-900">Nearest Pickup Location:</span>
                    </div>
                    <p className="text-lg font-bold text-blue-800 mb-1">{nearestLocation?.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{nearestLocation?.address}</p>
                    <p className="text-sm text-gray-600">Distance: Approximately {nearestLocation?.distance}</p>
                  </div>
                )}
                
                {/* Delivery Confirmation */}
                {formData.address && formData.transportation === 'yes' && (
                  <div className="p-4 rounded-lg bg-lime-50 border border-lime-200">
                    <p className="text-sm text-gray-700">
                      <strong className="text-green-900">Delivery will be arranged</strong> upon order confirmation. Our team will contact you to finalize delivery details and pricing.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Summary */}
            {formData.selectedFertilizer && formData.quantity && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Product:</span>
                    <span className="font-medium text-green-900">
                      {availableFertilizers.find(f => f.id.toString() === formData.selectedFertilizer)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Quantity:</span>
                    <span className="font-medium text-green-900">{formData.quantity}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-green-200">
                    <p className="text-xs text-gray-600 italic">
                      Pricing will be provided by our team after reviewing your order requirements.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!formData.name || !formData.email || !formData.phone || !formData.selectedFertilizer || !formData.quantity || !formData.transportation || !formData.address}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors duration-300 shadow-lg ${
                  formData.name && formData.email && formData.phone && formData.selectedFertilizer && formData.quantity && formData.transportation && formData.address
                    ? 'bg-lime-500 hover:bg-lime-600 text-green-900'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Place Order
              </button>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white p-6 rounded-xl shadow-2xl z-50 max-w-md animate-slideUp border-l-4 border-lime-400">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Order Received Successfully!</h3>
                <p className="text-green-50 mb-2">
                  Thank you for your order. Our team has received your request and will be contacting you soon to discuss pricing and delivery details.
                </p>
                <p className="text-green-50 text-sm">
                  We'll reach out to you at <strong>{formData.email}</strong> or <strong>{formData.phone}</strong> within 2-3 business days.
                </p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="ml-4 text-white hover:text-green-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
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
                All seeds, saplings, and bio-fertilizers are verified for superior quality and traceability by our accredited labs.
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
