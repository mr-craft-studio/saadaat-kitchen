import React, { useState } from 'react';
import { Product } from '../types/index.ts';
import { Search, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const filtered = searchTerm.trim() === ''
    ? []
    : products.filter(p =>
        p.isPublished &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-900 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Chicken Tikka, Malai Boti, Zinger, Broast, Rolls..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Box */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {searchTerm.trim() === '' ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Type something to search our entire fresh menu...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching dishes found for "{searchTerm}".
            </div>
          ) : (
            filtered.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-950 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 truncate">
                      {p.name}
                    </h4>
                    <span className="text-xs gold-gradient-text font-bold tabular-nums">
                      Rs. {p.price}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p, 1);
                    showToast(`Added ${p.name} to cart!`, 'success');
                  }}
                  className="p-2 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 rounded-lg transition-colors"
                  title="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
