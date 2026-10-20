import React, { useState, useRef } from 'react';
import { ArrowRight, Flame, Sparkles, Clock, Award } from 'lucide-react';

interface Hero3DProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({ onOrderNow, onExploreMenu }) => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950">
      {/* Background Atmosphere Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[300px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Copy & Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Editorial Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400/90">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Authentic Pakistani Charcoal Grill & Fast Food</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-tight text-balance">
              Welcome to <br />
              <span className="gold-gradient-text drop-shadow-sm">Saadaat Kitchen</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-300 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
              Good Food ❤️ Happy Mood — Fresh, Hot and Delicious. Handcrafted with traditional marinades, live charcoal flames, and premium ingredients.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl transition-all cursor-pointer"
              >
                Explore Our Menu
              </button>
            </div>

            {/* Trust Proof Badges */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-amber-400 font-bold text-base flex items-center justify-center lg:justify-start gap-1">
                  <Award className="w-4 h-4" /> 100% Halal
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Fresh daily meat</div>
              </div>
              <div>
                <div className="text-amber-400 font-bold text-base flex items-center justify-center lg:justify-start gap-1">
                  <Flame className="w-4 h-4" /> Live BBQ
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Smoky charcoal flame</div>
              </div>
              <div>
                <div className="text-amber-400 font-bold text-base flex items-center justify-center lg:justify-start gap-1">
                  <Clock className="w-4 h-4" /> Hot Delivery
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Prompt & hygienic</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Food Showcase */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: 1000
              }}
              className="relative w-full max-w-lg cursor-pointer"
            >
              {/* 3D Floating Platter Card */}
              <div
                style={{
                  transform: reduceMotion
                    ? 'none'
                    : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="relative rounded-3xl overflow-hidden glass-panel-gold p-3 shadow-2xl shadow-black/80 gold-border-glow group"
              >
                {/* Floating Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-white/10 pointer-events-none rounded-3xl" />

                {/* Primary Platter Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-950">
                  <img
                    src="/src/assets/images/saadaat_hero_feast_1792494252618.jpg"
                    alt="Saadaat Kitchen Signature Charcoal BBQ & Fast Food Platter"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Scrim for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Card Bottom Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        Signature Collection
                      </div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-white drop-shadow">
                        Charcoal Tikka, Boti, Rolls & Zingers
                      </h3>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-amber-500/40 text-xs font-bold text-amber-400 tabular-nums">
                      Starting Rs. 200
                    </div>
                  </div>
                </div>

                {/* Interactive Card Footnote & Reduced Motion Toggle */}
                <div className="mt-3 px-2 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Move cursor to inspect in 3D
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReduceMotion(!reduceMotion);
                    }}
                    className="text-[11px] text-zinc-500 hover:text-amber-400 underline"
                  >
                    {reduceMotion ? 'Enable 3D Tilt' : 'Disable 3D'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
