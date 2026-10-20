import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  Clock, 
  Award, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

interface MobileBottomBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentView,
  onNavigate
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: UtensilsCrossed
    },
    {
      id: 'recent-orders',
      label: 'Orders',
      icon: Clock
    },
    {
      id: 'profile',
      label: 'Loyalty',
      icon: Award
    },
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: isAuthenticated ? 'Admin' : undefined
    }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-850 px-2 py-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {navItems.map(item => {
          const isActive = currentView === item.id || 
            (item.id === 'profile' && currentView === 'loyalty') ||
            (item.id === 'admin-dashboard' && (currentView === 'admin-dashboard' || currentView === 'admin-login')) ||
            (item.id === 'menu' && ['tikka-bbq', 'rolls', 'burgers', 'sandwiches', 'fried-chicken', 'deals'].includes(currentView));
          
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-amber-400' : 'stroke-[1.8px]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-emerald-500 text-zinc-950 text-[8px] font-extrabold uppercase">
                    •
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Floating Cart Button in Bottom Bar */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-zinc-400 hover:text-white relative cursor-pointer"
        >
          <div className="relative">
            <div className="p-1 rounded-lg gold-gradient-bg text-zinc-950 shadow-sm">
              <ShoppingBag className="w-4 h-4 stroke-[2.2px]" />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-extrabold text-[9px] tabular-nums shadow">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 text-amber-400 font-bold tracking-tight">
            Cart
          </span>
        </button>
      </div>
    </nav>
  );
};
