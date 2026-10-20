import React from 'react';
import { Flame, Heart, Award, Clock, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          Our Heritage & Philosophy
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Good Food <span className="text-red-500">â¤ï¸</span> Happy Mood
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
          At Saadaat Kitchen, we believe that exceptional meals create joy. Every skewer of our Chicken Malai Tikka, every slow-cooked seekh kabab, and every golden crispy zinger is crafted with respect for authentic Pakistani culinary tradition.
        </p>
      </div>

      {/* Visual Showcase Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] glass-panel-gold p-2 shadow-2xl">
          <img
            src="/images/saadaat_hero_feast_1792494252618.jpg"
            alt="Saadaat Kitchen Artisanal BBQ Platter"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              The Secret Behind Our Signature Smoke
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We never cut corners with liquid smoke or pre-cooked batches. When you place an order at Saadaat Kitchen, raw marinated chicken cuts and ground beef are placed immediately over real hardwood charcoal pits.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Our marinades use wholesome traditional spices: freshly crushed cumin, toasted coriander, Kashmiri chili, raw papaya tenderizers, pure curd, and aromatic white pepper for our creamy Malai Boti.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <Flame className="w-5 h-5 text-amber-400 mb-2" />
              <div className="font-bold text-white text-sm">Hardwood Charcoal</div>
              <div className="text-xs text-zinc-400 mt-1">Authentic slow fire cooking</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <Award className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">100% Halal Cuts</div>
              <div className="text-xs text-zinc-400 mt-1">Fresh daily supply</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-2xl font-display font-bold text-white">
            Our Four Kitchen Commitments
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Principles that guide every order we prepare and dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-2">
            <Heart className="w-5 h-5 text-red-400" />
            <h4 className="font-bold text-white text-sm">Customer First</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generous portion sizes, warm customer care, and honest recipes that satisfy the entire family.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Master Grilling</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our pitmasters ensure the perfect sear on the outside while keeping the poultry tender and juicy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Prompt Dispatch</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Thermal packaging designed to keep your parathas crisp and your tikkas steaming hot until arrival.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Hygienic Kitchen</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sanitized prep surfaces, hairnets, and continuous quality checks during all shifts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl glass-panel-gold border border-amber-500/30 text-center space-y-4">
        <h3 className="text-2xl font-display font-bold text-white">
          Taste the Saadaat Kitchen Difference Today
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
          Explore our complete menu with Chicken Tikka, Malai Boti, Zinger Burgers, and Momos.
        </p>
        <button
          onClick={() => onNavigate('menu')}
          className="px-8 py-3.5 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Order From Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

