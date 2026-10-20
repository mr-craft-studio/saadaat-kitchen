import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Order, PaymentMethod } from '../types/index.ts';
import { ShieldCheck, Truck, Store, CreditCard, Banknote, AlertCircle, ArrowLeft, Tag, Sparkles, Award } from 'lucide-react';

interface CheckoutViewProps {
  onBackToMenu: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBackToMenu, onOrderSuccess }) => {
  const { cart, subtotal, clearCart } = useCart();
  const { showToast } = useToast();

  // Load saved profile data if available
  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem('saadaat_user_profile') || '{}');
    } catch {
      return {};
    }
  })();

  const [customerName, setCustomerName] = useState(savedProfile.name || '');
  const [customerPhone, setCustomerPhone] = useState(savedProfile.phone || localStorage.getItem('saadaat_customer_phone') || '');
  const [deliveryAddress, setDeliveryAddress] = useState(savedProfile.address || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(savedProfile.preferredPayment || 'cod');
  const [easypaisaRef, setEasypaisaRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Loyalty Voucher State
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const deliveryFee = orderType === 'delivery' ? 100 : 0;
  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);
  const pointsToEarn = Math.floor(totalAmount / 50);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'LOYALTY250' || code === 'LOYALTY100') {
      const discount = Math.min(250, subtotal);
      setAppliedVoucher({ code, discount });
      setVoucherMsg({ text: 'Loyalty Voucher Applied! Rs. 250 deducted from your subtotal.', isError: false });
      showToast('Rs. 250 Loyalty Discount applied!', 'success');
    } else if (code === 'LOYALTY600') {
      const discount = Math.min(600, subtotal);
      setAppliedVoucher({ code, discount });
      setVoucherMsg({ text: 'Silver Connoisseur Voucher Applied! Rs. 600 deducted.', isError: false });
      showToast('Rs. 600 Loyalty Discount applied!', 'success');
    } else if (code === 'LOYALTY1500') {
      const discount = Math.min(1500, subtotal);
      setAppliedVoucher({ code, discount });
      setVoucherMsg({ text: 'Gold VIP Voucher Applied! Rs. 1,500 deducted.', isError: false });
      showToast('Rs. 1,500 Loyalty Discount applied!', 'success');
    } else if (code === 'WELCOME25') {
      const discount = Math.min(150, subtotal);
      setAppliedVoucher({ code, discount });
      setVoucherMsg({ text: 'Welcome Coupon Applied! Rs. 150 deducted.', isError: false });
      showToast('Rs. 150 Welcome Discount applied!', 'success');
    } else {
      setVoucherMsg({ text: 'Invalid or expired voucher code. Check your Loyalty Club codes.', isError: true });
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherMsg(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add delicious items before checking out.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Pakistani phone number validation (e.g., 03001234567, 03xx-xxxxxxx, or +923001234567)
    const cleanPhone = customerPhone.replace(/\s+/g, '').replace(/-/g, '');
    if (!cleanPhone.match(/^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/)) {
      setErrorMsg('Please enter a valid Pakistani phone number (e.g. 0300-1234567 or +92 371 0238821).');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Please provide a complete delivery address (Street, House/Flat No, Area).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryInstructions: deliveryInstructions.trim(),
        orderType,
        paymentMethod,
        easypaisaRef: paymentMethod === 'easypaisa' ? easypaisaRef.trim() : undefined,
        discountCode: appliedVoucher ? appliedVoucher.code : undefined,
        discount: discountAmount,
        items: cart.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          instructions: i.specialInstructions
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      clearCart();
      try {
        const stored = JSON.parse(localStorage.getItem('saadaat_recent_order_nums') || '[]');
        const updated = Array.from(new Set([data.order.orderNumber, ...stored])).slice(0, 25);
        localStorage.setItem('saadaat_recent_order_nums', JSON.stringify(updated));
        localStorage.setItem('saadaat_customer_phone', customerPhone.trim());
      } catch (storageErr) {
        console.warn('Could not save order to localStorage:', storageErr);
      }
      showToast(`Order #${data.order.orderNumber} placed successfully!`, 'success');
      onOrderSuccess(data.order);
    } catch (err: any) {
      console.error('Order placement error:', err);
      setErrorMsg(err.message || 'Server error. Please check your network or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Food Menu</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">
          Complete Your Order
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Provide your details for prompt preparation and delivery.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Order Type: Delivery vs Pickup */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              1. Fulfillment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Home Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Takeaway / Pickup</span>
              </button>
            </div>
          </div>

          {/* Customer Contact */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              2. Contact Information
            </label>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Phone Number (Pakistani Mobile) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0300 1234567 or +92 371 0238821"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Used for delivery coordination and WhatsApp status updates.
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address (only for delivery) */}
          {orderType === 'delivery' && (
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                3. Delivery Address
              </label>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Street & House / Apartment Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="House/Apartment #, Floor, Street, Landmark, Area / Sector"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={e => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Ring the bell twice, leave with security..."
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {orderType === 'delivery' ? '4. Payment Method' : '3. Payment Method'}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'easypaisa'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Easypaisa Transfer</span>
              </button>
            </div>

            {/* Easypaisa Official Instructions Box */}
            {paymentMethod === 'easypaisa' && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-3">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span>Easypaisa Payment Details</span>
                </div>
                
                <div className="space-y-1 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Account Name:</span>
                    <span className="font-bold text-white">Syeda Iqraa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Account / Mobile Number:</span>
                    <span className="font-bold text-amber-400 tabular-nums">+92 371 0238821</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Amount Due:</span>
                    <span className="font-bold text-white tabular-nums">Rs. {totalAmount}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Easypaisa Transaction (TRX) ID / Reference (Optional at checkout)
                  </label>
                  <input
                    type="text"
                    value={easypaisaRef}
                    onChange={e => setEasypaisaRef(e.target.value)}
                    placeholder="Enter 11-digit TRX ID (e.g. 19283746501)"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    You can also send the payment receipt directly to our official WhatsApp after ordering.
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-5 sticky top-28">
            <h3 className="text-base font-display font-bold text-white">
              Order Summary
            </h3>

            {/* Itemized List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between text-xs text-zinc-300">
                  <div className="flex-1 truncate mr-2">
                    <span className="font-semibold text-white">{item.quantity}x</span> {item.name}
                    {item.specialInstructions && (
                      <span className="text-[10px] text-zinc-500 block italic truncate">
                        ({item.specialInstructions})
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-white tabular-nums">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Loyalty Voucher / Promo Code Box */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Loyalty Discount Voucher</span>
                </span>
                {appliedVoucher && (
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-red-400 hover:text-red-300 text-[10px] capitalize cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </label>

              {!appliedVoucher ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={e => setVoucherInput(e.target.value)}
                    placeholder="Enter code (e.g. LOYALTY250)"
                    className="flex-1 px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 hover:text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-300 uppercase">
                      {appliedVoucher.code}
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      (-Rs. {appliedVoucher.discount})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px] font-bold">
                    Applied
                  </span>
                </div>
              )}

              {voucherMsg && (
                <p className={`text-[11px] ${voucherMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {voucherMsg.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-200 tabular-nums">Rs. {subtotal}</span>
              </div>
              
              {appliedVoucher && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Loyalty Voucher ({appliedVoucher.code})</span>
                  </span>
                  <span className="tabular-nums">-Rs. {appliedVoucher.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>Delivery Fee</span>
                <span className="font-semibold text-zinc-200 tabular-nums">
                  {orderType === 'delivery' ? `Rs. ${deliveryFee}` : 'Free (Pickup)'}
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-between text-base font-display font-bold text-white">
                <span>Total Amount</span>
                <span className="gold-gradient-text tabular-nums">Rs. {totalAmount}</span>
              </div>

              {/* Loyalty Points Earned Incentive */}
              <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>You will earn on this order:</span>
                </span>
                <strong className="font-bold text-amber-400 tabular-nums">+{pointsToEarn} PTS</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-850 text-[11px] text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Live tracking link and WhatsApp receipt provided upon submission.</span>
            </div>

            {/* Submit Button with Anti-duplicate-click Protection */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-4 text-sm font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Placing Order...' : `Confirm Order — Rs. ${totalAmount}`}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
