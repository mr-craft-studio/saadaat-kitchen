import React from 'react';
import { Deal } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Plus, Tag, CheckCircle2 } from 'lucide-react';

interface DealsBannerProps {
  deal: Deal;
}

export const DealsBanner: React.FC<DealsBannerProps> = ({ deal }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddDeal = () => {
    addToCart(deal, 1);
    showToast(`Added "${deal.title}" to cart!`, 'success');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative rounded-3xl overflow-hidden glass-panel-gold border border-amber-500/30 p-6 sm:p-8 lg:p-10 shadow-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Top: Offer Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              <span>{deal.badge || 'Official Poster Special Deal'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
              {deal.title}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300">
              {deal.subtitle}
            </p>

            {/* Included Items Checklist */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-200">
              {deal.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Price & Action */}
            <div className="pt-4 flex flex-wrap items-center gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-display font-bold gold-gradient-text tabular-nums">
                  Rs. {deal.price}
                </span>
                {deal.originalPrice && (
                  <span className="text-base text-zinc-500 line-through tabular-nums">
                    Rs. {deal.originalPrice}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddDeal}
                className="px-6 py-3 text-sm font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Deal to Cart</span>
              </button>
            </div>
          </div>

          {/* Right: Deal Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full max-w-md shadow-2xl border border-zinc-800">
              <img
                src={deal.image}
                alt={deal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 right-3 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-lg shadow">
                Save 20%
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
