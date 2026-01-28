import React from 'react';
import { Plus } from 'lucide-react';
import type { ShopProduct } from '../../types';

interface ProductCardProps {
  product: ShopProduct;
  addToCart: (product: ShopProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  // Derive inStock from stock > 0
  const inStock = product.stock > 0;
  
  // Format stock display
  const stockDisplay = inStock ? `${product.stock} ${product.unit}` : 'Out of Stock';

  return (
    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-lime-400 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="h-36 bg-green-50 flex flex-col items-center justify-center p-4">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-24 w-24 object-cover rounded-lg mb-2"
          />
        ) : (
          <div className="text-5xl mb-2">{product.imageIcon || '🌿'}</div>
        )}
        <div className="text-green-700 font-semibold text-center text-sm">{product.category}</div>
      </div>
      <div className="p-6">
        <div className="h-20 mb-4"> 
          <h3 className="text-lg font-bold text-green-900 mb-1 line-clamp-2">
            <span className="italic">{product.name}</span>
          </h3>
          <p className="text-gray-600 text-xs line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4 border-t border-gray-100 pt-3">
          <span className="text-2xl font-extrabold text-green-700">
            ₹{product.price}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            inStock 
                ? 'bg-lime-100 text-lime-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {stockDisplay}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={!inStock}
          className={`w-full py-3 px-4 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center shadow-lg ${
            inStock
                ? 'bg-lime-500 hover:bg-lime-600 text-green-900'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

