import React, { useState } from 'react';
import { Product, Deal, ProductCategory } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { DealsBanner } from '../components/DealsBanner.tsx';
import { Search, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';

interface MenuViewProps {
  products: Product[];
  deals: Deal[];
  initialCategory?: ProductCategory;
  onOpenDetails: (product: Product) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  products,
  deals,
  initialCategory = 'all',
  onOpenDetails
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'tikka-bbq', label: 'Chicken Tikka & BBQ' },
    { id: 'rolls', label: 'Rolls & Wraps' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'fried-chicken', label: 'Fried Chicken' },
    { id: 'fries-sides', label: 'Fries & Sides' },
    { id: 'deals', label: 'Special Deals' }
  ];

  // Filter published products with confirmed prices
  let filteredProducts = products.filter(p => p.isPublished && p.priceConfirmed && p.price !== null);

  if (selectedCategory !== 'all' && selectedCategory !== 'deals') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  const showDeals = selectedCategory === 'all' || selectedCategory === 'deals';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          Authentic Flavors · Fresh Every Day
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Our Complete Menu
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          All prices in Pakistani Rupees (PKR). Cooked fresh upon order with pure ingredients.
        </p>
      </div>

      {/* Controls Bar: Category Tabs, Search, Sort */}
      <div className="space-y-4">
        {/* Category Filter Tabs (Zero-pill discipline: quiet segmented buttons with active styling) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-900 no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dishes or ingredients..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Special Deals Section (if deals tab or all tab) */}
      {showDeals && deals.length > 0 && !searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <span>Special Promotional Deals & Combos</span>
          </div>
          <div className="space-y-4">
            {deals.map(deal => (
              <DealsBanner key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {selectedCategory !== 'deals' && (
        <div>
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 rounded-3xl bg-zinc-900/40 border border-zinc-900">
              <UtensilsCrossed className="w-10 h-10 text-zinc-600 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">No dishes found</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? `No matching items found for "${searchQuery}". Try a different keyword.`
                    : 'This category currently has no published items.'}
                </p>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs font-semibold text-amber-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={onOpenDetails}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
