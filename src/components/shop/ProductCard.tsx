import React from 'react';
import { Plus } from 'lucide-react';
import type { ShopProduct } from '../../types';

interface ProductCardProps {
  product: ShopProduct;
  addToCart: (product: ShopProduct) => void;
  /** When the parent shows the product title once for multiple supplier rows, hide the duplicate heading. */
  omitTitle?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, omitTitle = false }) => {
  // Derive inStock from stock > 0
  const inStock = product.stock > 0;
  
  // Format stock display
  const stockDisplay = inStock ? `${product.stock} ${product.unit}` : 'Out of Stock';

  return (
    <div key={product.id} className="bg-background-paper rounded-xl shadow-lg overflow-hidden border-t-4 border-card-borderAccent hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="h-44 bg-primary-lightest relative overflow-hidden">
        {product.imageUrl ? (
          <>
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 bg-background-paper/90 backdrop-blur-sm text-primary-main font-semibold text-xs px-2 py-1 rounded-full shadow-sm">
              {product.category}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="text-5xl mb-2">{product.imageIcon || '🌿'}</div>
            <div className="text-primary-main font-semibold text-center text-sm">{product.category}</div>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="h-20 mb-4"> 
          {!omitTitle && (
            <h3 className="text-lg font-bold text-content-heading mb-1 line-clamp-2">
              <span className="italic">{product.name}</span>
            </h3>
          )}
          {product.divisionName && (
            <p
              className={`text-primary-main font-medium mb-1 ${omitTitle ? 'text-base' : 'text-xs'}`}
            >
              {omitTitle ? product.divisionName : `Sold by: ${product.divisionName}`}
            </p>
          )}
          <p className="text-content-secondary text-xs line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4 border-t border-border-lightest pt-3">
          <span className="text-2xl font-extrabold text-primary-main">
            ₹{product.price}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            inStock 
                ? 'bg-badge-inStockBg text-badge-inStockText' 
                : 'bg-badge-outOfStockBg text-badge-outOfStockText'
          }`}>
            {stockDisplay}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={!inStock}
          className={`w-full py-3 px-4 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center shadow-lg ${
            inStock
                ? 'bg-interactive-secondaryDefault hover:bg-interactive-secondaryHover text-interactive-secondaryText'
                : 'bg-interactive-disabled text-interactive-disabledText cursor-not-allowed'
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

