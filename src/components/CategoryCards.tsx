import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoryCardsProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'tikka-bbq',
      title: 'Chicken Tikka & BBQ',
      description: 'Charcoal grilled skewers, Malai Boti, Balochi Tikka & Seekh Kababs.',
      image: '/src/assets/images/chicken_malai_tikka_1792494253354.jpg',
      count: '11 Items'
    },
    {
      id: 'rolls',
      title: 'Paratha Rolls & Wraps',
      description: 'Flaky parathas rolled with BBQ boti, garlic mayo, cheese & crisp salad.',
      image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg',
      count: '16 Items'
    },
    {
      id: 'burgers',
      title: 'Burgers & Zingers',
      description: 'Signature crispy zinger burgers, double decker, and beef patties.',
      image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg',
      count: '9 Items'
    },
    {
      id: 'sandwiches',
      title: 'Club Sandwiches',
      description: 'Multi-layer toasted club sandwiches, BBQ malai chicken, and cheese.',
      image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg',
      count: '7 Items'
    },
    {
      id: 'fried-chicken',
      title: 'Crispy Broast & Fried Chicken',
      description: 'Golden fried chicken quarters with signature crust and dinner buns.',
      image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg',
      count: '4 Items'
    },
    {
      id: 'fries-sides',
      title: 'Crispy Fries & Sides',
      description: 'Freshly cut potato fries dusted with chat masala and garlic mayo.',
      image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg',
      count: '2 Items'
    },
    {
      id: 'deals',
      title: 'Deals & Family Combos',
      description: 'Chinese macaroni, steamed momos, and family feast platters.',
      image: '/src/assets/images/special_deal_momos_combo_1792494255549.jpg',
      count: '2 Combos'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-900 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Fresh From The Kitchen
          </span>
          <h2 className="text-3xl font-display font-bold text-white mt-1">
            Browse By Category
          </h2>
        </div>
        <p className="text-sm text-zinc-400 max-w-md">
          Explore our wide range of authentic Pakistani charcoal grills, gourmet rolls, burgers, and curated combos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative rounded-2xl overflow-hidden glass-panel border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between"
          >
            {/* Image Header */}
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[11px] font-semibold text-amber-400 border border-zinc-800">
                {cat.count}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
              <div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>View Menu</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
