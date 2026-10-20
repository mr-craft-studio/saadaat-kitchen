import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types/index.ts';
import { Search, Clock, CheckCircle2, AlertTriangle, ChefHat, Bike, PackageCheck, Send, MessageCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline.tsx';

interface TrackOrderViewProps {
  initialOrderNumber?: string;
  onBackToMenu: () => void;
  onViewRecentOrders?: () => void;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  initialOrderNumber = '',
  onBackToMenu,
  onViewRecentOrders
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [trxId, setTrxId] = useState('');
  const [trxSubmitting, setTrxSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleTrack = async (targetOrderNumber?: string) => {
    const num = (targetOrderNumber || orderNumber).trim();
    if (!num) {
      setErrorMsg('Please enter your Order Reference Number (e.g. SK-2026-XXXX).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const queryUrl = `/api/orders/track/${encodeURIComponent(num)}${phone.trim() ? `?phone=${encodeURIComponent(phone.trim())}` : ''}`;
      const res = await fetch(queryUrl);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Order not found.');
      }

      setOrder(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to find order. Please verify your details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrack(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSubmitTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim() || !order) return;

    setTrxSubmitting(true);
    try {
      const res = await fetch('/api/payment-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          easypaisaRef: trxId.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit TRX.');

      showToast('Easypaisa transaction reference submitted! Our manager will verify it.', 'success');
      setTrxId('');
      handleTrack(order.orderNumber);
    } catch (err: any) {
      showToast(err.message || 'Error submitting TRX', 'error');
    } finally {
      setTrxSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          Live Kitchen & Dispatch Updates
        </span>
        <h1 className="text-3xl font-display font-bold text-white">
          Track My Order
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Enter your Order Number and phone number to monitor live cooking, packing, and rider dispatch.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl max-w-xl mx-auto">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleTrack();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Order Number *
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="e.g. SK-2026-4821"
              className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Phone Number (Optional verification)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 0300 1234567 or last 4 digits"
              className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching Kitchen Feed...' : 'Track Status'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="rounded-3xl glass-panel border border-zinc-800 p-6 sm:p-10 shadow-2xl space-y-8 bg-zinc-950">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-900 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Live Status for
                </span>
                <button
                  onClick={() => handleTrack()}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors p-1 rounded hover:bg-zinc-900 cursor-pointer"
                  title="Refresh order status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2.5 mt-0.5">
                <span>{order.orderNumber}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase">
                  {order.orderStatus === 'dispatched' ? 'Out for Delivery' : order.orderStatus.replace('_', ' ')}
                </span>
              </h2>
              <span className="text-xs text-zinc-400 block mt-1">
                Placed by {order.customerName} on {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-zinc-500 block">Total Amount</span>
              <span className="text-2xl font-display font-bold gold-gradient-text tabular-nums">
                Rs. {order.totalAmount}
              </span>
              <span className="text-[11px] text-zinc-400 block uppercase mt-0.5">
                {order.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'Cash on Delivery'} · {order.paymentStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Vertical Animated Progress Bar & History with Framer Motion */}
          <div className="py-2">
            <OrderStatusTimeline order={order} />
          </div>

          {/* Easypaisa TRX Verification Submission Form (if pending verification) */}
          {order.paymentMethod === 'easypaisa' && order.paymentStatus !== 'verified' && order.paymentStatus !== 'paid' && (
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">
                  Easypaisa Payment Verification
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                  {order.paymentStatus === 'awaiting_verification' ? 'Awaiting Kitchen Verification' : 'Pending Payment'}
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Please transfer Rs. {order.totalAmount} to <span className="font-bold text-white">Syeda Iqraa (+92 371 0238821)</span> and enter your transaction ID.
              </p>

              <form onSubmit={handleSubmitTrx} className="flex gap-2 pt-1">
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={e => setTrxId(e.target.value)}
                  placeholder="Enter Easypaisa TRX Reference (e.g. 192837465)"
                  className="flex-1 px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={trxSubmitting}
                  className="px-4 py-2 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{trxSubmitting ? 'Submitting...' : 'Submit TRX'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Quick Support Links */}
          <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToMenu}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ← Back to Food Menu
              </button>
              {onViewRecentOrders && (
                <button
                  onClick={onViewRecentOrders}
                  className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  My Recent Orders →
                </button>
              )}
            </div>
            <a
              href={`https://wa.me/923710238821?text=Assalam-o-Alaikum!%20I%20am%20inquiring%20about%20my%20Order%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Need help? WhatsApp Manager (+92 371 0238821)</span>
            </a>
          </div>

        </div>
      )}
    </div>
  );
};
