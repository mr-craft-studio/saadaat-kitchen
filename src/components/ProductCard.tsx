import React, { useState } from 'react';
import { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Plus, Minus, Flame, Star, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);

  const isSoldOut = !product.isAvailable;
  const isUnconfirmed = !product.priceConfirmed || product.price === null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut || isUnconfirmed) return;
    addToCart(product, qty);
    showToast(`Added ${qty}x ${product.name} to cart!`, 'success');
    setQty(1);
  };

  const increment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQty(q => q + 1);
  };

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQty(q => Math.max(1, q - 1));
  };

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(product)}
      className={`group relative rounded-2xl overflow-hidden glass-panel border border-zinc-800/80 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl flex flex-col justify-between cursor-pointer ${
        isSoldOut ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Status & Indicators */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {product.isBestseller && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/90 text-zinc-950 font-bold text-[10px] rounded shadow-md uppercase tracking-wide">
              <Star className="w-3 h-3 fill-zinc-950" />
              <span>Bestseller</span>
            </div>
          )}
          {product.isSpicy && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-600/90 text-white font-bold text-[10px] rounded shadow-md uppercase tracking-wide">
              <Flame className="w-3 h-3" />
              <span>Spicy</span>
            </div>
          )}
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-red-600/90 text-white font-bold text-xs rounded-md shadow-lg uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}

        {isUnconfirmed && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-center p-3">
            <span className="px-2.5 py-1 bg-zinc-800 text-amber-300 font-medium text-xs rounded">
              Price to Confirm in Admin
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-amber-400 transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-zinc-500 block uppercase font-medium">Price</span>
            <span className="text-lg font-display font-bold gold-gradient-text tabular-nums">
              {product.price !== null ? `Rs. ${product.price}` : 'Unconfirmed'}
            </span>
          </div>

          {!isSoldOut && !isUnconfirmed ? (
            <div className="flex items-center gap-2">
              {/* Quantity Stepper */}
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={decrement}
                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-semibold text-zinc-200 tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={increment}
                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="p-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg shadow-sm hover:scale-105 transition-all cursor-pointer"
                title="Add to cart"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-zinc-500 font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};
