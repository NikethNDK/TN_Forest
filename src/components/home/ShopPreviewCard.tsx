import React from 'react';
import { Link } from 'react-router-dom';
import type { ShopProduct } from '../../types';

interface ShopPreviewCardProps {
  product: ShopProduct;
}

const ShopPreviewCard: React.FC<ShopPreviewCardProps> = ({ product }) => {
  return (
    <Link
      to="/shop"
      className="block bg-background-paper rounded-xl shadow-lg overflow-hidden border-t-4 border-card-borderAccent hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-36 sm:h-40 bg-primary-lightest relative overflow-hidden">
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
          <div className="h-full flex flex-col items-center justify-center p-3">
            <div className="text-4xl mb-1">{product.imageIcon || '🌿'}</div>
            <div className="text-primary-main font-semibold text-center text-xs">{product.category}</div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-content-heading mb-2 line-clamp-2">
          <span className="italic">{product.name}</span>
        </h3>
        <span className="text-xl font-extrabold text-primary-main">₹{product.price}</span>
      </div>
    </Link>
  );
};

export default ShopPreviewCard;
