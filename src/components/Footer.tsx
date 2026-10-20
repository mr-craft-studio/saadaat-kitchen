import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { Phone, MessageCircle, Clock, MapPin, Shield, CreditCard } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mt-3">
              Saadaat Kitchen brings you the finest Pakistani charcoal grills, sizzling Chicken Malai Tikka, authentic Paratha Rolls, and gourmet Zinger Burgers. Made with 100% fresh halal chicken & meat.
            </p>
            <div className="pt-2 flex items-center gap-4 text-zinc-300">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <CreditCard className="w-4 h-4" />
                COD & Easypaisa
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Shield className="w-4 h-4" />
                100% Halal
              </span>
            </div>
          </div>

          {/* Col 2: Menu Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-sans">
              Culinary Menu
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('tikka-bbq')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Chicken Tikka & BBQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rolls')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Chicken & Beef Rolls
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('burgers')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Zinger & Beef Burgers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sandwiches')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Club Sandwiches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fried-chicken')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Crispy Broast & Fried Chicken
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deals')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-amber-300 font-medium"
                >
                  Chinese & Momos Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-sans">
              Customer Care
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Track My Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('recent-orders')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-amber-300 font-medium"
                >
                  My Recent Orders & Re-order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  About Saadaat Kitchen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Contact & Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('refund')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Refund & Cancellation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Timing */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-sans">
              Visit & Contact
            </h4>
            <div className="space-y-2 text-zinc-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>4:00 PM – 2:00 AM (Mon - Sun)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+923710238821" className="hover:text-amber-400">
                  +92 371 0238821
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/923710238821"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  WhatsApp Ordering
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 text-zinc-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Main Food Street, Karachi, Pakistan</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-900">
              <button
                onClick={() => onNavigate('admin-login')}
                className="text-[11px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3" />
                <span>Restaurant Management Portal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Saadaat Kitchen. All rights reserved. Good Food ❤️ Happy Mood.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-zinc-300">Privacy</button>
            <span>·</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-zinc-300">Terms</button>
            <span>·</span>
            <button onClick={() => onNavigate('refund')} className="hover:text-zinc-300">Refunds</button>
            <span>·</span>
            <button onClick={() => onNavigate('admin-login')} className="hover:text-amber-400">Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
