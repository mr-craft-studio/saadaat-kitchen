import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Order, Product, Deal, BusinessSettings, AdminAuditLog, ContactMessage, OrderStatus } from '../types/index.ts';
import { BrandLogo } from '../components/BrandLogo.tsx';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  Settings,
  Shield,
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Mail,
  ChevronRight,
  ExternalLink,
  ChefHat
} from 'lucide-react';

interface AdminDashboardViewProps {
  onBackToWebsite: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBackToWebsite }) => {
  const { token, adminEmail, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'deals' | 'ai-studio' | 'settings' | 'messages' | 'audit'>('stats');

  // Live Server Data
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product Edit Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Deal Edit Modal
  const [editingDeal, setEditingDeal] = useState<Partial<Deal> | null>(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  // AI Image Studio State
  const [selectedProductForAI, setSelectedProductForAI] = useState<string>('');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Fetch all live dashboard data
  const loadDashboardData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, ordersRes, productsRes, dealsRes, settingsRes, auditRes, msgRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/deals', { headers }),
        fetch('/api/settings'),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/admin/messages', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (dealsRes.ok) setDeals(await dealsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Error synchronizing with server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  // Order Actions
  const handleUpdateOrderStatus = async (orderNumber: string, status: OrderStatus, paymentStatus?: Order['paymentStatus'], note?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, paymentStatus, note })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`Order ${orderNumber} updated to ${status}`, 'success');
      if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
        setSelectedOrder(data.order);
      }
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update order', 'error');
    }
  };

  // Payment Verification
  const handleVerifyPayment = async (orderNumber: string, verified: boolean) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ verified })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`Payment for order ${orderNumber} ${verified ? 'Verified' : 'Rejected'}`, 'success');
      loadDashboardData();
      if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
        setSelectedOrder(data.order);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update payment status', 'error');
    }
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProduct)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`Product "${data.product.name}" saved!`, 'success');
      setIsProductModalOpen(false);
      setEditingProduct(null);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Error saving product', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete product');

      showToast(`Deleted "${name}"`, 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Error deleting product', 'error');
    }
  };

  // Save Business Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to update settings');

      showToast('Business settings saved successfully!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    }
  };

  // Generate AI Image
  const handleGenerateAIImage = async () => {
    if (!selectedProductForAI) {
      showToast('Please choose a product to generate an image for', 'warning');
      return;
    }

    const prod = products.find(p => p.id === selectedProductForAI);
    if (!prod) return;

    setIsGeneratingAI(true);
    setAiGeneratedImage(null);

    try {
      const res = await fetch('/api/admin/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productName: prod.name,
          category: prod.category,
          customPrompt: aiCustomPrompt.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAiGeneratedImage(data.imageUrl);
      showToast('AI food photography generated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate image', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Assign Generated AI Image to Product
  const handleAssignAIImage = async () => {
    if (!aiGeneratedImage || !selectedProductForAI) return;
    const prod = products.find(p => p.id === selectedProductForAI);
    if (!prod) return;

    const updated: Product = {
      ...prod,
      image: aiGeneratedImage
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Failed to assign image');

      showToast(`Image assigned to "${prod.name}" and saved!`, 'success');
      setAiGeneratedImage(null);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Error saving image', 'error');
    }
  };

  // Filtered orders for table
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-zinc-950 border-b border-zinc-900 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <BrandLogo size="sm" showTagline={false} />
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Management Console</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={onBackToWebsite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </button>

          <div className="text-right hidden md:block">
            <span className="text-xs font-bold text-white block">{adminEmail}</span>
            <span className="text-[10px] text-emerald-400">Authorized Admin</span>
          </div>

          <button
            onClick={logout}
            className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-900 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace with Sidebar Tabs */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar: Horizontal scrollable on mobile, vertical on desktop */}
        <aside className="w-full md:w-64 bg-zinc-950/95 border-b md:border-b-0 md:border-r border-zinc-900 p-2.5 md:p-4 shrink-0 flex md:flex-col overflow-x-auto gap-1.5 md:gap-0 md:space-y-1.5 scrollbar-none sticky top-16 md:static z-20 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap md:w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'stats'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 md:bg-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap md:w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'orders'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 md:bg-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Orders Control</span>
            </div>
            {stats && stats.awaitingConfirmation > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                {stats.awaitingConfirmation}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap md:w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'products'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 md:bg-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UtensilsCrossed className="w-4 h-4 shrink-0" />
              <span>Edit Menu</span>
            </div>
            {stats && stats.unavailableOrDraftCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                {stats.unavailableOrDraftCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('deals')}
            className={`whitespace-nowrap md:w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'deals'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 md:bg-transparent'
            }`}
          >
            <ChefHat className="w-4 h-4 shrink-0" />
            <span>Deals & Combos</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-studio')}
            className={`whitespace-nowrap md:w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'ai-studio'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 md:bg-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AI Food Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap md:w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 md:bg-transparent'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Website Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`whitespace-nowrap md:w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'messages'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 md:bg-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0" />
              <span>Inquiries</span>
            </div>
            {messages.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`whitespace-nowrap md:w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'audit'
                ? 'gold-gradient-bg text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 md:bg-transparent'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Audit Trail</span>
          </button>
        </aside>

        {/* Workspace Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  Live Kitchen Operations & Revenue
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Verified real-time statistics from active orders and database records.
                </p>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-xs text-zinc-400 font-medium">Orders Received Today</span>
                  <div className="text-3xl font-display font-bold text-white tabular-nums">
                    {stats.ordersToday}
                  </div>
                  <span className="text-[11px] text-zinc-500">Total Lifetime: {stats.totalOrders}</span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-xs text-zinc-400 font-medium">Verified Sales</span>
                  <div className="text-3xl font-display font-bold gold-gradient-text tabular-nums">
                    Rs. {stats.totalSales}
                  </div>
                  <span className="text-[11px] text-emerald-400">Collected & Delivered</span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-xs text-zinc-400 font-medium">In Kitchen / Preparing</span>
                  <div className="text-3xl font-display font-bold text-amber-400 tabular-nums">
                    {stats.preparing}
                  </div>
                  <span className="text-[11px] text-zinc-500">{stats.dispatched} currently out on delivery</span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-xs text-zinc-400 font-medium">Awaiting Easypaisa Verification</span>
                  <div className="text-3xl font-display font-bold text-red-400 tabular-nums">
                    {stats.awaitingPaymentVerification}
                  </div>
                  <span className="text-[11px] text-zinc-500">Requires manual confirmation</span>
                </div>
              </div>

              {/* Status Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                    Live Order Pipeline
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-zinc-300">New Orders (Awaiting Confirmation):</span>
                      <span className="font-bold text-white tabular-nums px-2 py-0.5 rounded bg-zinc-800">
                        {stats.awaitingConfirmation}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-zinc-300">Cooking & Charcoal Grill:</span>
                      <span className="font-bold text-amber-400 tabular-nums px-2 py-0.5 rounded bg-zinc-800">
                        {stats.preparing}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-zinc-300">Out for Delivery with Rider:</span>
                      <span className="font-bold text-blue-400 tabular-nums px-2 py-0.5 rounded bg-zinc-800">
                        {stats.dispatched}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-zinc-300">Successfully Delivered:</span>
                      <span className="font-bold text-emerald-400 tabular-nums px-2 py-0.5 rounded bg-zinc-800">
                        {stats.completed}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                    Catalog & Price Status
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-zinc-300">Active Published Menu Dishes:</span>
                      <span className="font-bold text-emerald-400 tabular-nums">
                        {stats.availableProductsCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-zinc-300">Draft / Unconfirmed Prices:</span>
                      <span className="font-bold text-amber-400 tabular-nums">
                        {stats.unavailableOrDraftCount} items (Chicken Double Burger, Beef Burger 650, BBQ Club Cheese)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-zinc-300 text-[11px] leading-relaxed">
                      ðŸ’¡ <strong>Rule Enforced:</strong> Unconfirmed draft dishes are hidden from public visitors until you review and confirm their PKR price in the "Menu & Prices" tab.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    Order Management
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Advance kitchen workflow, confirm orders, and verify Easypaisa payments.
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      placeholder="Search order #, customer, phone..."
                      className="pl-9 pr-3.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">All Statuses</option>
                    <option value="received">Received / New</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready for Dispatch</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40 shadow-xl">
                {filteredOrders.length === 0 ? (
                  <div className="py-16 text-center text-xs text-zinc-500">
                    No orders match your criteria. Place a test order from the public store to see live processing.
                  </div>
                ) : (
                  <>
                    {/* Mobile Card List (block md:hidden) */}
                    <div className="md:hidden divide-y divide-zinc-800 p-3 space-y-4">
                      {filteredOrders.map(order => (
                        <div key={order.id} className="pt-3 first:pt-0 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-white text-sm block">
                                {order.orderNumber}
                              </span>
                              <span className="text-[11px] text-zinc-500">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Â· {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                              </span>
                            </div>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                order.orderStatus === 'delivered'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : order.orderStatus === 'cancelled'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : order.orderStatus === 'dispatched'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : order.orderStatus === 'preparing'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>

                          {/* Customer & Phone with direct Call / WhatsApp */}
                          <div className="flex items-center justify-between bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-850 text-xs">
                            <div>
                              <span className="font-semibold text-white block">{order.customerName}</span>
                              <span className="text-[11px] text-zinc-400">{order.customerPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white"
                                title="Call customer"
                              >
                                ðŸ“ž
                              </a>
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400"
                                title="WhatsApp customer"
                              >
                                ðŸ’¬
                              </a>
                            </div>
                          </div>

                          {/* Items summary */}
                          <div className="text-xs text-zinc-300 bg-zinc-900/30 p-2 rounded-lg">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold block mb-0.5">Dishes:</span>
                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>

                          {/* Amount and Payment */}
                          <div className="flex items-center justify-between text-xs pt-1">
                            <div>
                              <span className="text-[10px] text-zinc-500 block uppercase">Total Amount</span>
                              <span className="font-bold text-white tabular-nums text-sm">
                                Rs. {order.totalAmount}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="uppercase text-[11px] font-semibold text-zinc-300 block">
                                {order.paymentMethod}
                              </span>
                              <span className="text-[10px] text-amber-400 font-bold uppercase">
                                {order.paymentStatus.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Quick 1-Touch Workflow Control Buttons on Mobile */}
                          <div className="flex items-center gap-2 pt-2 border-t border-zinc-850">
                            {order.orderStatus === 'received' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderNumber, 'confirmed', undefined, 'Order confirmed by kitchen staff')}
                                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow cursor-pointer text-center"
                              >
                                Confirm Order
                              </button>
                            )}

                            {order.orderStatus === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderNumber, 'preparing', undefined, 'Skewers placed on live charcoal grill')}
                                className="flex-1 py-2 rounded-xl gold-gradient-bg text-zinc-950 text-xs font-bold shadow cursor-pointer text-center"
                              >
                                Start Cooking
                              </button>
                            )}

                            {order.orderStatus === 'preparing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderNumber, 'ready', undefined, 'Food cooked and sealed in thermal box')}
                                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow cursor-pointer text-center"
                              >
                                Mark Ready
                              </button>
                            )}

                            {order.orderStatus === 'ready' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderNumber, 'dispatched', undefined, 'Rider dispatched with order')}
                                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow cursor-pointer text-center"
                              >
                                Dispatch Rider
                              </button>
                            )}

                            {order.orderStatus === 'dispatched' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderNumber, 'delivered', 'paid', 'Food delivered to customer')}
                                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow cursor-pointer text-center"
                              >
                                Mark Delivered
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer shrink-0"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table (hidden md:block) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-900 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                          <tr>
                            <th className="p-3.5">Order Ref</th>
                            <th className="p-3.5">Customer & Phone</th>
                            <th className="p-3.5">Dishes</th>
                            <th className="p-3.5">Total</th>
                            <th className="p-3.5">Payment</th>
                            <th className="p-3.5">Order Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850 text-zinc-300">
                          {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-zinc-900/60 transition-colors">
                              <td className="p-3.5">
                                <span className="font-bold text-white block tabular-nums">
                                  {order.orderNumber}
                                </span>
                                <span className="text-[10px] text-zinc-500">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>

                              <td className="p-3.5">
                                <span className="font-semibold text-white block">
                                  {order.customerName}
                                </span>
                                <span className="text-[11px] text-zinc-400 block tabular-nums">
                                  {order.customerPhone}
                                </span>
                              </td>

                              <td className="p-3.5 max-w-xs">
                                <div className="truncate text-zinc-300">
                                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                </div>
                              </td>

                              <td className="p-3.5 font-bold text-white tabular-nums">
                                Rs. {order.totalAmount}
                              </td>

                              <td className="p-3.5">
                                <span className="uppercase text-[11px] font-semibold block text-zinc-300">
                                  {order.paymentMethod}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase ${
                                    order.paymentStatus === 'verified' || order.paymentStatus === 'paid'
                                      ? 'text-emerald-400'
                                      : order.paymentStatus === 'awaiting_verification'
                                      ? 'text-amber-400'
                                      : 'text-zinc-500'
                                  }`}
                                >
                                  {order.paymentStatus.replace('_', ' ')}
                                </span>
                                {order.easypaisaRef && (
                                  <span className="text-[10px] text-zinc-400 block">
                                    TRX: {order.easypaisaRef}
                                  </span>
                                )}
                              </td>

                              <td className="p-3.5">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    order.orderStatus === 'delivered'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : order.orderStatus === 'cancelled'
                                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                      : order.orderStatus === 'dispatched'
                                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                      : order.orderStatus === 'preparing'
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                      : 'bg-zinc-800 text-zinc-300'
                                  }`}
                                >
                                  {order.orderStatus}
                                </span>
                              </td>

                              <td className="p-3.5 text-right space-x-1">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="px-2.5 py-1 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg cursor-pointer"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MENU & PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    Menu & Product Management
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Edit prices, toggle sold out status, publish unconfirmed draft dishes.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct({
                      id: 'prod-' + Date.now(),
                      name: '',
                      category: 'tikka-bbq',
                      price: 400,
                      priceConfirmed: true,
                      isPublished: true,
                      isAvailable: true,
                      description: '',
                      image: '/images/saadaat_hero_feast_1792494252618.jpg'
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products List: Mobile Cards + Desktop Table */}
              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40 shadow-xl">
                {/* Mobile Cards View (md:hidden) */}
                <div className="md:hidden divide-y divide-zinc-850 p-3 space-y-3">
                  {products.map(prod => (
                    <div key={prod.id} className="pt-3 first:pt-0 space-y-2.5">
                      <div className="flex items-start gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover bg-zinc-950 shrink-0 border border-zinc-800"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-white text-xs truncate block">
                              {prod.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase shrink-0 ${
                                prod.isPublished && prod.priceConfirmed
                                  ? 'bg-zinc-800 text-zinc-300'
                                  : 'bg-amber-500/20 text-amber-300 font-bold'
                              }`}
                            >
                              {prod.isPublished && prod.priceConfirmed ? 'Published' : 'Draft'}
                            </span>
                          </div>

                          <div className="text-[11px] text-zinc-400 capitalize mt-0.5">
                            {prod.category.replace('-', ' ')}
                          </div>

                          <div className="text-xs font-bold text-amber-400 tabular-nums mt-1">
                            {prod.price !== null ? `Rs. ${prod.price}` : 'Pending Price'}
                          </div>
                        </div>
                      </div>

                      {/* Stock Switch and Actions for Mobile */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-850/60">
                        <button
                          onClick={async () => {
                            const updated = { ...prod, isAvailable: !prod.isAvailable };
                            await fetch('/api/admin/products', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                              },
                              body: JSON.stringify(updated)
                            });
                            loadDashboardData();
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer text-center ${
                            prod.isAvailable
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {prod.isAvailable ? 'âœ“ In Stock' : 'âœ— Sold Out'}
                        </button>

                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsProductModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-red-400 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table (hidden md:block) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                      <tr>
                        <th className="p-3.5">Dish</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price (PKR)</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Draft / Published</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-zinc-900/60 transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-zinc-950 shrink-0"
                            />
                            <div>
                              <span className="font-semibold text-white block">
                                {prod.name}
                              </span>
                              <span className="text-[10px] text-zinc-500 line-clamp-1 max-w-xs">
                                {prod.description}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5 capitalize text-zinc-400">
                            {prod.category.replace('-', ' ')}
                          </td>

                          <td className="p-3.5 font-bold text-white tabular-nums">
                            {prod.price !== null ? (
                              `Rs. ${prod.price}`
                            ) : (
                              <span className="text-amber-400 font-medium">Pending Confirmation</span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={async () => {
                                const updated = { ...prod, isAvailable: !prod.isAvailable };
                                await fetch('/api/admin/products', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`
                                  },
                                  body: JSON.stringify(updated)
                                });
                                loadDashboardData();
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                                prod.isAvailable
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}
                            >
                              {prod.isAvailable ? 'In Stock' : 'Sold Out'}
                            </button>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                prod.isPublished && prod.priceConfirmed
                                  ? 'bg-zinc-800 text-zinc-200'
                                  : 'bg-amber-500/20 text-amber-300 font-bold'
                              }`}
                            >
                              {prod.isPublished && prod.priceConfirmed ? 'Published' : 'Draft'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEALS & COMBOS */}
          {activeTab === 'deals' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    Special Deals & Promotional Combos
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage the Chinese & Momos special offer, prices, and combos.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingDeal({
                      id: 'deal-' + Date.now(),
                      title: '',
                      subtitle: '',
                      items: [''],
                      price: 750,
                      originalPrice: 900,
                      image: '/images/special_deal_momos_combo_1792494255549.jpg',
                      isAvailable: true,
                      isPublished: true,
                      badge: 'Special Deal'
                    });
                    setIsDealModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Deal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deals.map(deal => (
                  <div key={deal.id} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                          {deal.badge || 'Combo'}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-0.5">
                          {deal.title}
                        </h3>
                        <p className="text-xs text-zinc-400">{deal.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold gold-gradient-text tabular-nums block">
                          Rs. {deal.price}
                        </span>
                        {deal.originalPrice && (
                          <span className="text-xs text-zinc-500 line-through tabular-nums">
                            Rs. {deal.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-300">
                      <span className="text-zinc-500 font-semibold block text-[11px]">Included:</span>
                      {deal.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">
                        {deal.isAvailable ? 'Active on Storefront' : 'Hidden'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingDeal(deal);
                          setIsDealModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Deal</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI FOOD IMAGE GENERATOR STUDIO */}
          {activeTab === 'ai-studio' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                  <span>AI Food Image Studio</span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Generate realistic restaurant photography using Gemini model with dark slate backgrounds and golden cinematic lighting, preview, and assign to dishes.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Select Menu Dish
                    </label>
                    <select
                      value={selectedProductForAI}
                      onChange={e => setSelectedProductForAI(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="">-- Choose a dish --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Style Direction
                    </label>
                    <div className="px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300">
                      Black Slate Stone, Golden Charcoal Rim Lighting, 8k Commercial
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Optional Custom Photography Prompt
                  </label>
                  <textarea
                    rows={3}
                    value={aiCustomPrompt}
                    onChange={e => setAiCustomPrompt(e.target.value)}
                    placeholder="Leave blank for automatic studio recipe, or enter specific plating instructions (e.g. served on black rustic tray with mint dip and sliced onions)..."
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAIImage}
                  disabled={isGeneratingAI || !selectedProductForAI}
                  className="w-full py-3.5 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingAI ? 'Generating Realistic Food Photo...' : 'Generate AI Dish Photo'}</span>
                </button>

                {/* AI Image Preview & Action */}
                {aiGeneratedImage && (
                  <div className="p-6 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-4">
                    <span className="text-xs font-bold text-amber-400 block uppercase">
                      Generated Photo Preview
                    </span>
                    <div className="relative aspect-[4/3] max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                      <img
                        src={aiGeneratedImage}
                        alt="AI Generated Food"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleAssignAIImage}
                        className="px-6 py-2.5 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow cursor-pointer hover:scale-105 transition-all"
                      >
                        Approve & Assign to Dish
                      </button>
                      <button
                        onClick={() => setAiGeneratedImage(null)}
                        className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & EASYPAISA CONFIG */}
          {activeTab === 'settings' && settings && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  Restaurant Settings & Easypaisa Configuration
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Configure delivery charges, Easypaisa account details, and kitchen hours.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Delivery Fee (PKR)
                    </label>
                    <input
                      type="number"
                      required
                      value={settings.deliveryFee}
                      onChange={e => setSettings({ ...settings, deliveryFee: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Minimum Order Value (PKR)
                    </label>
                    <input
                      type="number"
                      required
                      value={settings.minOrder}
                      onChange={e => setSettings({ ...settings, minOrder: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Easypaisa Official Payment Configuration
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Account Title / Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.easypaisaAccountName}
                        onChange={e => setSettings({ ...settings, easypaisaAccountName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Easypaisa Account / Mobile Number
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.easypaisaAccountNumber}
                        onChange={e => setSettings({ ...settings, easypaisaAccountNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Checkout Payment Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={settings.easypaisaInstructions}
                      onChange={e => setSettings({ ...settings, easypaisaInstructions: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Official WhatsApp Number
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsapp}
                      onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.openingHours}
                      onChange={e => setSettings({ ...settings, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow cursor-pointer"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  Customer Contact Messages
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Inquiries received from the public website contact form.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
                {messages.length === 0 ? (
                  <div className="py-16 text-center text-xs text-zinc-500">
                    No contact messages yet.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-850">
                    {messages.map(msg => (
                      <div key={msg.id} className="p-4 space-y-2 hover:bg-zinc-900/50">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{msg.name} ({msg.phone})</span>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-amber-400">{msg.subject}</div>
                        <p className="text-xs text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-850">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  Security Audit Trail
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Timestamped records of all price adjustments, status updates, and administrative events.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
                <div className="divide-y divide-zinc-850 text-xs">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-3.5 flex items-start justify-between gap-4">
                      <div>
                        <span className="font-bold text-amber-400 block">{log.action}</span>
                        <span className="text-zinc-300">{log.details}</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">By {log.user}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 tabular-nums shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-zinc-900">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase">Order Inspection</span>
                <h3 className="text-2xl font-display font-bold text-white mt-0.5">
                  {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-zinc-400">
                  Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
              >
                âœ•
              </button>
            </div>

            {/* Address */}
            <div className="p-3 rounded-xl bg-zinc-900 text-xs space-y-1">
              <span className="text-zinc-500 font-bold block">DELIVERY ADDRESS:</span>
              <p className="text-zinc-200">{selectedOrder.deliveryAddress}</p>
              {selectedOrder.deliveryInstructions && (
                <p className="text-zinc-400 italic">Instructions: {selectedOrder.deliveryInstructions}</p>
              )}
            </div>

            {/* Items */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-900 text-zinc-400 font-semibold">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {selectedOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-white">{it.name}</td>
                      <td className="p-2.5 text-center tabular-nums">{it.quantity}</td>
                      <td className="p-2.5 text-right tabular-nums font-semibold">Rs. {it.itemTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status Change Buttons */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Workflow Status Action
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.orderNumber, 'confirmed')}
                  className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg cursor-pointer"
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.orderNumber, 'preparing')}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg cursor-pointer"
                >
                  Cooking & BBQ
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.orderNumber, 'ready')}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg cursor-pointer"
                >
                  Ready for Dispatch
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.orderNumber, 'dispatched')}
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 rounded-lg cursor-pointer"
                >
                  Dispatched with Rider
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.orderNumber, 'delivered', 'paid')}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg cursor-pointer"
                >
                  Mark Delivered (Paid)
                </button>
                <button
                  onClick={() => {
                    const reason = window.prompt('Reason for cancellation:');
                    if (reason) handleUpdateOrderStatus(selectedOrder.orderNumber, 'cancelled', undefined, reason);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg cursor-pointer"
                >
                  Cancel Order
                </button>
              </div>
            </div>

            {/* Easypaisa Payment Verification Buttons */}
            {selectedOrder.paymentMethod === 'easypaisa' && (
              <div className="p-4 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-400">Easypaisa Verification</span>
                  <span className="text-zinc-400">TRX ID: {selectedOrder.easypaisaRef || 'Not provided yet'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerifyPayment(selectedOrder.orderNumber, true)}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer"
                  >
                    Verify Payment
                  </button>
                  <button
                    onClick={() => handleVerifyPayment(selectedOrder.orderNumber, false)}
                    className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-xl cursor-pointer"
                  >
                    Reject Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT EDIT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveProduct}
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <h3 className="text-xl font-display font-bold text-white">
              {editingProduct.id ? 'Edit Dish' : 'Add New Dish'}
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Name</label>
              <input
                type="text"
                required
                value={editingProduct.name || ''}
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                <select
                  value={editingProduct.category || 'tikka-bbq'}
                  onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="tikka-bbq">Chicken Tikka & BBQ</option>
                  <option value="rolls">Rolls & Wraps</option>
                  <option value="burgers">Burgers</option>
                  <option value="sandwiches">Sandwiches</option>
                  <option value="fried-chicken">Fried Chicken</option>
                  <option value="fries-sides">Fries & Sides</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Price (PKR)</label>
                <input
                  type="number"
                  value={editingProduct.price ?? ''}
                  placeholder="Enter numeric PKR"
                  onChange={e => {
                    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                    setEditingProduct({
                      ...editingProduct,
                      price: val,
                      priceConfirmed: val !== null
                    });
                  }}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={editingProduct.description || ''}
                onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-4 text-xs text-zinc-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.isPublished ?? true}
                  onChange={e => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                  className="rounded text-amber-500"
                />
                <span>Published on Storefront</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.isBestseller ?? false}
                  onChange={e => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                  className="rounded text-amber-500"
                />
                <span>Bestseller Tag</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow cursor-pointer"
              >
                Save Dish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DEAL EDIT MODAL */}
      {isDealModalOpen && editingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch('/api/admin/deals', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify(editingDeal)
                });
                if (!res.ok) throw new Error('Failed to save deal');
                showToast(`Deal "${editingDeal.title}" saved!`, 'success');
                setIsDealModalOpen(false);
                setEditingDeal(null);
                loadDashboardData();
              } catch (err: any) {
                showToast(err.message, 'error');
              }
            }}
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <h3 className="text-xl font-display font-bold text-white">
              {editingDeal.id ? 'Edit Combo Deal' : 'New Combo Deal'}
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Deal Title</label>
              <input
                type="text"
                required
                value={editingDeal.title || ''}
                onChange={e => setEditingDeal({ ...editingDeal, title: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Deal Price (PKR)</label>
                <input
                  type="number"
                  required
                  value={editingDeal.price ?? 750}
                  onChange={e => setEditingDeal({ ...editingDeal, price: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Original Price (PKR)</label>
                <input
                  type="number"
                  value={editingDeal.originalPrice ?? 950}
                  onChange={e => setEditingDeal({ ...editingDeal, originalPrice: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Items (Comma separated)
              </label>
              <input
                type="text"
                value={(editingDeal.items || []).join(', ')}
                onChange={e => setEditingDeal({ ...editingDeal, items: e.target.value.split(',').map(s => s.trim()) })}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDealModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow cursor-pointer"
              >
                Save Deal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

