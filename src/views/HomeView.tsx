import React from 'react';
import { Hero3D } from '../components/Hero3D.tsx';
import { DealsBanner } from '../components/DealsBanner.tsx';
import { CategoryCards } from '../components/CategoryCards.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { Product, Deal } from '../types/index.ts';
import { ShieldCheck, Flame, Utensils, Award, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  deals: Deal[];
  onSelectCategory: (categoryId: string) => void;
  onOpenDetails: (product: Product) => void;
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  deals,
  onSelectCategory,
  onOpenDetails,
  onNavigate
}) => {
  // Best sellers: filter marked bestsellers or top popular items
  const bestsellers = products.filter(p => p.isBestseller && p.isPublished && p.priceConfirmed).slice(0, 8);
  const mainDeal = deals[0] || null;

  return (
    <div className="space-y-16 pb-20">
      {/* 3D Hero Section */}
      <Hero3D
        onOrderNow={() => onNavigate('menu')}
        onExploreMenu={() => onNavigate('menu')}
      />

      {/* Special Deals Banner (Chinese & Momos Deal Rs. 750) */}
      {mainDeal && (
        <DealsBanner deal={mainDeal} />
      )}

      {/* Categories Grid */}
      <CategoryCards onSelectCategory={onSelectCategory} />

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-900 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold">
              <Award className="w-4 h-4" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-white mt-1">
              Popular Bestsellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </section>

      {/* Customer Trust Section (Strictly Verified Claims, No Fabrications) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Our Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              Quality Ingredients · Hygienic Preparation · Fast Delivery
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Every skewer and burger is cooked to order on real charcoal grills with pure spices and uncompromised hygiene.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-950/60 border border-zinc-850">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">100% Fresh Halal Meat</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Hand-cut premium poultry and beef delivered daily. Strictly free from artificial tenderizers.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-950/60 border border-zinc-850">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Live Charcoal Smoke</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Traditional coal pits providing authentic Pakistani BBQ aroma, charred perfection, and juicy texture.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-950/60 border border-zinc-850">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Food Safety & Hygiene</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Temperature-controlled kitchen stations, sealed thermal delivery packaging, and prompt dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
