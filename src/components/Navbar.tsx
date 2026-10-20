import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ShoppingBag, MessageCircle, Search, Menu, X, Shield, LayoutDashboard, Award } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'deals', label: 'Deals' },
    { id: 'track-order', label: 'Track Order' },
    { id: 'recent-orders', label: 'My Orders' },
    { id: 'profile', label: 'Loyalty Club' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer shrink-0"
        >
          <BrandLogo size="md" showTagline={true} />
        </div>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          {navLinks.map(link => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Search, WhatsApp, Cart) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
            title="Search menu"
            aria-label="Search food items"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* WhatsApp Direct Order Button */}
          <a
            href="https://wa.me/923710238821?text=Assalam-o-Alaikum%20Saadaat%20Kitchen!%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/60 transition-all hover:scale-[1.02] shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
            <span>WhatsApp Order</span>
          </a>

          {/* Personal Dashboard Button */}
          <button
            onClick={() => handleNavClick('admin-dashboard')}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-850 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
            title="Personal Dashboard: Control orders, edit menu, manage settings"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Dashboard</span>
            {isAuthenticated && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Shopping Bag Button with Live Item Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-950 gold-gradient-bg rounded-lg hover:opacity-95 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xs:inline">Cart</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold bg-zinc-950 text-amber-400 rounded-full ml-0.5 tabular-nums">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 pt-3 pb-6 space-y-3">
          {/* Quick Dashboard Highlight Card on Mobile */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-950 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">Personal Dashboard</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                {isAuthenticated ? 'Admin Active' : 'Staff Access'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Control orders, edit dishes and prices, toggle stock, and control website settings.
            </p>
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className="w-full py-2 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow cursor-pointer text-center block"
            >
              Open Personal Dashboard →
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  currentView === link.id
                    ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
            <a
              href="https://wa.me/923710238821"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-xl"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Kitchen (+92 371 0238821)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
