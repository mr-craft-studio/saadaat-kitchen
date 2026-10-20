import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderItem } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  ShoppingBag, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  Search, 
  RefreshCw, 
  Package, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  AlertTriangle, 
  ExternalLink, 
  MessageCircle, 
  Phone,
  Sparkles,
  Shield,
  UtensilsCrossed,
  Award
} from 'lucide-react';
import { LoyaltyPointsTracker } from '../components/LoyaltyPointsTracker.tsx';

interface RecentOrdersViewProps {
  onNavigate: (view: string) => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const RecentOrdersView: React.FC<RecentOrdersViewProps> = ({
  onNavigate,
  onTrackOrder
}) => {
  const { reorderItems } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated, adminEmail } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [orderNumSearch, setOrderNumSearch] = useState('');
  const [showLoyalty, setShowLoyalty] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  // Load orders on initial mount
  const fetchOrders = async (phoneFilter?: string, specificNum?: string) => {
    setLoading(true);
    try {
      // 1. Get stored order numbers from localStorage
      let storedNums: string[] = [];
      try {
        storedNums = JSON.parse(localStorage.getItem('saadaat_recent_order_nums') || '[]');
      } catch (e) {
        storedNums = [];
      }

      // Check saved phone
      const savedPhone = phoneFilter !== undefined 
        ? phoneFilter 
        : (phoneSearch || localStorage.getItem('saadaat_customer_phone') || '');

      if (!phoneSearch && savedPhone && phoneFilter === undefined) {
        setPhoneSearch(savedPhone);
      }

      const lookupPayload: { orderNumbers?: string[]; phone?: string } = {};

      if (specificNum?.trim()) {
        lookupPayload.orderNumbers = [specificNum.trim()];
      } else if (savedPhone.trim()) {
        lookupPayload.phone = savedPhone.trim();
        if (storedNums.length > 0) {
          lookupPayload.orderNumbers = storedNums;
        }
      } else if (storedNums.length > 0) {
        lookupPayload.orderNumbers = storedNums;
      } else if (isAuthenticated) {
        // If logged in as admin/staff, fetch all recent orders from admin API or batch
        const res = await fetch('/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('saadaat_admin_token') || ''}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
          setLoading(false);
          return;
        }
      }

      if (!lookupPayload.orderNumbers?.length && !lookupPayload.phone) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/orders/lookup-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lookupPayload)
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to load recent orders:', err);
      showToast('Could not load recent orders. Check connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneSearch.trim()) {
      localStorage.setItem('saadaat_customer_phone', phoneSearch.trim());
    }
    fetchOrders(phoneSearch.trim(), orderNumSearch.trim());
  };

  // Re-order entire order
  const handleReorderAll = (order: Order) => {
    if (!order.items || order.items.length === 0) return;

    const itemsToReorder = order.items.map(i => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      instructions: i.instructions
    }));

    reorderItems(itemsToReorder);
    showToast(`Added ${order.items.length} item(s) from #${order.orderNumber} to your cart!`, 'success');
  };

  // Re-order a single item
  const handleReorderSingleItem = (item: OrderItem, orderNum: string) => {
    reorderItems([{
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      instructions: item.instructions
    }]);
    showToast(`Added 1x ${item.name} to cart!`, 'success');
  };

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return {
          label: 'Received',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: Clock
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: CheckCircle2
        };
      case 'preparing':
        return {
          label: 'On Grill / Cooking',
          bg: 'bg-amber-400/20 text-amber-300 border-amber-400/40 animate-pulse',
          icon: ChefHat
        };
      case 'ready':
        return {
          label: 'Ready / Packed',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: Package
        };
      case 'dispatched':
        return {
          label: 'Out for Delivery',
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: Bike
        };
      case 'delivered':
        return {
          label: 'Delivered',
          bg: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
          icon: CheckCircle2
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bg: 'bg-red-950/80 text-red-400 border-red-500/40',
          icon: AlertTriangle
        };
      default:
        return {
          label: status,
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          icon: Clock
        };
    }
  };

  // Filter orders by tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      return !['delivered', 'cancelled'].includes(order.orderStatus);
    }
    if (activeTab === 'completed') {
      return ['delivered', 'cancelled'].includes(order.orderStatus);
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order History & 1-Click Re-ordering</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Recent Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            View your order history, check live cooking timestamps, and quickly re-order your favorite BBQ, burgers, and rolls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLoyalty(!showLoyalty)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showLoyalty 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{showLoyalty ? 'Hide Loyalty Tracker' : 'View Loyalty Points'}</span>
          </button>
          <button
            onClick={() => fetchOrders()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Refresh order history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gold-gradient-bg text-zinc-950 text-xs font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Order Fresh Dishes</span>
          </button>
        </div>
      </div>

      {/* Embedded Loyalty Points Tracker with Animated Progress Bar */}
      {showLoyalty && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <LoyaltyPointsTracker
            orders={orders}
            onNavigateToMenu={() => onNavigate('menu')}
            onNavigateToCheckout={() => onNavigate('checkout')}
          />
        </motion.div>
      )}

      {/* Authenticated Admin Notice Banner if logged in */}
      {isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Administrator Mode Active ({adminEmail})</span>
              <span className="text-zinc-400 text-[11px]">
                Showing customer orders stream. You can also manage live statuses from the Admin Dashboard.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold text-xs border border-amber-500/40 shrink-0 cursor-pointer"
          >
            Admin Dashboard →
          </button>
        </div>
      )}

      {/* Phone / Reference Search Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={phoneSearch}
              onChange={e => setPhoneSearch(e.target.value)}
              placeholder="Search by Pakistani Phone (e.g. 0300-1234567)"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="sm:w-60 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={orderNumSearch}
              onChange={e => setOrderNumSearch(e.target.value)}
              placeholder="Order # (e.g. SK-2026-4821)"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Tab Filter (All / In-Progress / Completed) */}
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
        {(['all', 'active', 'completed'] as const).map(tab => {
          const isActive = activeTab === tab;
          const count = tab === 'all' 
            ? orders.length 
            : tab === 'active' 
            ? orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus)).length
            : orders.filter(o => ['delivered', 'cancelled'].includes(o.orderStatus)).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'gold-gradient-bg text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>{tab === 'active' ? 'In Progress' : tab}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-zinc-950 text-amber-400' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List Container */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl gold-gradient-bg text-zinc-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Fetching recent order history from Saadaat Kitchen database...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800 p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-amber-400/60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-display font-bold text-white">
              No Orders Found
            </h3>
            <p className="text-xs text-zinc-400">
              {phoneSearch || orderNumSearch
                ? 'No past orders matched your search criteria. Check your phone number or order reference.'
                : 'You have not placed any orders from this device yet.'}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl gold-gradient-bg text-zinc-950 text-xs font-bold hover:scale-105 transition-all shadow-md cursor-pointer"
            >
              Browse Food Menu
            </button>
            <button
              onClick={() => onNavigate('track-order')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Track Specific Order
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders.map(order => {
              const statusBadge = getStatusBadge(order.orderStatus);
              const StatusIcon = statusBadge.icon;
              const orderDate = new Date(order.createdAt);
              const formattedDate = orderDate.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const formattedTime = orderDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <motion.div
                  key={order.id || order.orderNumber}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="rounded-3xl glass-panel border border-zinc-800/80 hover:border-amber-500/30 transition-all p-6 sm:p-7 shadow-xl bg-zinc-950 space-y-6"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-900">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg sm:text-xl font-display font-bold text-white tracking-wide">
                          {order.orderNumber}
                        </span>
                        
                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusBadge.bg}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusBadge.label}</span>
                        </span>

                        {/* Order Type Badge */}
                        <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 capitalize">
                          {order.orderType === 'delivery' ? 'Home Delivery' : 'Takeaway Pickup'}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-500 flex items-center gap-2">
                        <span>Placed on {formattedDate} at {formattedTime}</span>
                        <span>•</span>
                        <span className="text-zinc-400">{order.customerName}</span>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-zinc-500 block uppercase tracking-wider">Total Amount</span>
                      <span className="text-2xl font-display font-bold gold-gradient-text tabular-nums">
                        Rs. {order.totalAmount}
                      </span>
                      <span className="text-[11px] text-zinc-400 block">
                        {order.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'Cash on Delivery'} · {order.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                      Ordered Items ({order.items?.length || 0})
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                                {item.quantity}x
                              </span>
                              <span className="font-semibold text-white truncate">
                                {item.name}
                              </span>
                            </div>
                            {item.instructions && (
                              <p className="text-[11px] text-zinc-500 italic mt-0.5 pl-7 truncate">
                                Note: {item.instructions}
                              </p>
                            )}
                            <div className="text-[11px] text-zinc-400 mt-1 pl-7">
                              Rs. {item.price} each · <strong className="text-zinc-200">Rs. {item.itemTotal}</strong>
                            </div>
                          </div>

                          <button
                            onClick={() => handleReorderSingleItem(item, order.orderNumber)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 hover:text-amber-300 text-[11px] font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                            title="Add 1 more of this item to cart"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address Note if available */}
                  {order.deliveryAddress && order.orderType === 'delivery' && (
                    <div className="text-xs text-zinc-400 bg-zinc-900/30 p-3 rounded-xl border border-zinc-900 flex items-center gap-2">
                      <span className="text-zinc-500 font-medium">Destination:</span>
                      <span className="text-zinc-300">{order.deliveryAddress}</span>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* Track Button */}
                      <button
                        onClick={() => onTrackOrder(order.orderNumber)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Track Live Status</span>
                      </button>

                      {/* WhatsApp Inquiry */}
                      <a
                        href={`https://wa.me/923710238821?text=Assalam-o-Alaikum%20Saadaat%20Kitchen!%20Inquiring%20about%20my%20order%20${order.orderNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 transition-colors"
                        title="Chat about this order on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Re-order Entire Order Button */}
                    <button
                      onClick={() => handleReorderAll(order)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-bg text-zinc-950 text-xs font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-order Entire Order (Rs. {order.totalAmount})</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
