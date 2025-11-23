import React from 'react';
import { Leaf, Zap, LucideIcon } from 'lucide-react';
import type { ShopProduct } from '../../types';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  icon: LucideIcon;
  products: ShopProduct[];
  limit: number;
  setLimit: (limit: number) => void;
  addToCart: (product: ShopProduct) => void;
}

const INITIAL_LIMIT = 4;

const ProductSection: React.FC<ProductSectionProps> = ({ title, icon: Icon, products, limit, setLimit, addToCart }) => {
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

export default ProductSection;

