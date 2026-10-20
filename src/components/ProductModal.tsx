import React, { useState } from 'react';
import { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { X, Plus, Minus, ShoppingBag, Flame, Star, ShieldCheck } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  if (!product) return null;

  const isSoldOut = !product.isAvailable;
  const isUnconfirmed = !product.priceConfirmed || product.price === null;

  const handleAdd = () => {
    if (isSoldOut || isUnconfirmed) return;
    addToCart(product, quantity, instructions);
    showToast(`Added ${quantity}x ${product.name} to cart!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white bg-black/60 rounded-full hover:bg-black transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Column */}
        <div className="md:w-1/2 relative aspect-square md:aspect-auto bg-zinc-950">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent md:hidden" />
        </div>

        {/* Details Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  {product.category.replace('-', ' & ')}
                </span>
                {product.isBestseller && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
                    <Star className="w-3 h-3 fill-amber-300" /> Bestseller
                  </span>
                )}
                {product.isSpicy && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
                    <Flame className="w-3 h-3" /> Spicy
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-display font-bold text-white">
                {product.name}
              </h2>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Halal Certified & Freshly Cooked</span>
            </div>

            {/* Special Instructions Note */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Special Instructions (Optional)
              </label>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Mild spice, extra onions, no sauce..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Pricing & Add to Cart Module */}
          <div className="pt-4 border-t border-zinc-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-500 block">Unit Price</span>
                <span className="text-2xl font-display font-bold gold-gradient-text tabular-nums">
                  {product.price !== null ? `Rs. ${product.price}` : 'Price to Confirm'}
                </span>
              </div>

              {!isSoldOut && !isUnconfirmed && (
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-zinc-200 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {!isSoldOut && !isUnconfirmed ? (
              <button
                onClick={handleAdd}
                className="w-full py-3.5 px-6 font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Order — Rs. {(product.price || 0) * quantity}</span>
              </button>
            ) : (
              <div className="w-full py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-zinc-500 text-xs font-medium">
                {isSoldOut ? 'Currently Out of Stock' : 'Unconfirmed Draft Item'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
