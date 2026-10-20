import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Order } from '../types/index.ts';
import { LoyaltyPointsTracker } from '../components/LoyaltyPointsTracker.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  User, 
  Award, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  Sparkles, 
  Save, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  CreditCard,
  ChefHat
} from 'lucide-react';

interface UserProfileViewProps {
  onNavigate: (view: string) => void;
  onTrackOrder: (orderNumber: string) => void;
}

interface UserProfileData {
  name: string;
  phone: string;
  address: string;
  specialNotes?: string;
  preferredPayment: 'cod' | 'easypaisa';
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onNavigate,
  onTrackOrder
}) => {
  const { showToast } = useToast();
  const { isAuthenticated, adminEmail } = useAuth();

  // Profile data from localStorage or default
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('saadaat_user_profile');
      if (saved) return JSON.parse(saved);
      const phone = localStorage.getItem('saadaat_customer_phone') || '';
      return {
        name: '',
        phone,
        address: '',
        preferredPayment: 'cod'
      };
    } catch {
      return {
        name: '',
        phone: '',
        address: '',
        preferredPayment: 'cod'
      };
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'loyalty' | 'orders' | 'settings'>('loyalty');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch orders for this profile
  useEffect(() => {
    async function loadOrders() {
      setLoadingOrders(true);
      try {
        let storedNums: string[] = [];
        try {
          storedNums = JSON.parse(localStorage.getItem('saadaat_recent_order_nums') || '[]');
        } catch {
          storedNums = [];
        }

        const phone = profile.phone || localStorage.getItem('saadaat_customer_phone') || '';
        const payload: { orderNumbers?: string[]; phone?: string } = {};

        if (phone.trim()) payload.phone = phone.trim();
        if (storedNums.length > 0) payload.orderNumbers = storedNums;

        if (!payload.orderNumbers?.length && !payload.phone) {
          setOrders([]);
          setLoadingOrders(false);
          return;
        }

        const res = await fetch('/api/orders/lookup-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error('Failed to load user orders:', e);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [profile.phone]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      localStorage.setItem('saadaat_user_profile', JSON.stringify(profile));
      if (profile.phone.trim()) {
        localStorage.setItem('saadaat_customer_phone', profile.phone.trim());
      }
      showToast('Profile and delivery preferences saved!', 'success');
    } catch {
      showToast('Failed to save profile settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate quick stats
  const totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPoints = 25 + orders.reduce((sum, o) => sum + Math.floor(o.totalAmount / 50), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Profile Luxury Banner Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* User Monogram Avatar */}
            <div className="w-20 h-20 rounded-2xl gold-gradient-bg text-zinc-950 flex items-center justify-center font-display font-extrabold text-2xl shadow-xl shadow-amber-500/20 ring-4 ring-amber-500/20">
              {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {profile.name || 'Saadaat Foodie'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                  {totalPoints >= 500 ? 'Platinum VIP' : totalPoints >= 250 ? 'Gold Member' : totalPoints >= 100 ? 'Silver Member' : 'Bronze Member'}
                </span>
              </div>

              <p className="text-xs text-zinc-400">
                {profile.phone ? profile.phone : 'Pakistani BBQ & Fast Food Enthusiast'}
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs">
                <span className="text-zinc-400">
                  Total Orders: <strong className="text-white font-semibold tabular-nums">{orders.length}</strong>
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">
                  Total Spent: <strong className="text-white font-semibold tabular-nums">Rs. {totalSpend}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Points Highlights Pill */}
          <div className="flex flex-col items-center sm:items-end bg-zinc-950/80 p-4 rounded-2xl border border-amber-500/20 shrink-0">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
              Loyalty Balance
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-display font-bold gold-gradient-text tabular-nums">
                {totalPoints}
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase">PTS</span>
            </div>
            <button
              onClick={() => setActiveTab('loyalty')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold mt-1 flex items-center gap-1 cursor-pointer"
            >
              <span>View Rewards</span>
              <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'loyalty'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Loyalty Points & Discounts</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Recent Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'settings'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Details & Address</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'loyalty' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoyaltyPointsTracker
            orders={orders}
            onNavigateToMenu={() => onNavigate('menu')}
            onNavigateToCheckout={() => onNavigate('checkout')}
          />
        </motion.div>
      )}

      {activeTab === 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-display font-bold text-white">
              Order Activity & Tracking
            </h3>
            <button
              onClick={() => onNavigate('recent-orders')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              Open Full Orders Hub →
            </button>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center text-xs text-zinc-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 space-y-3">
              <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
              <p>No orders linked to this profile yet.</p>
              <button
                onClick={() => onNavigate('menu')}
                className="px-5 py-2 rounded-xl gold-gradient-bg text-zinc-950 font-bold cursor-pointer"
              >
                Start Your Order
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.orderNumber}
                  className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold uppercase border border-amber-500/20">
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} item(s) · {order.deliveryAddress}
                    </div>
                    <div className="text-xs text-amber-400 font-semibold">
                      Earned +{Math.floor(order.totalAmount / 50)} Loyalty Points
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-sm font-bold text-white tabular-nums block">
                        Rs. {order.totalAmount}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <button
                      onClick={() => onTrackOrder(order.orderNumber)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer"
                    >
                      Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-display font-bold text-white">
              Saved Contact & Delivery Details
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Save your default delivery address and phone number for 1-click checkout.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Syed Ali Raza"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Phone Number (Required for Loyalty & Orders)
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder="e.g. 0300 1234567"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Saved Delivery Address
              </label>
              <textarea
                rows={3}
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                placeholder="Street address, apartment or house number, landmark..."
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Preferred Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, preferredPayment: 'cod' })}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    profile.preferredPayment === 'cod'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cash on Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, preferredPayment: 'easypaisa' })}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    profile.preferredPayment === 'easypaisa'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Easypaisa Mobile</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-zinc-950 font-bold text-xs flex items-center gap-2 shadow hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Preferences'}</span>
            </button>
          </form>
        </motion.div>
      )}

    </div>
  );
};
