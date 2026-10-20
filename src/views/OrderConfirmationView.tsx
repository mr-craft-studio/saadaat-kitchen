import React from 'react';
import { Order } from '../types/index.ts';
import { CheckCircle2, MessageCircle, MapPin, ArrowRight, Printer, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface OrderConfirmationViewProps {
  order: Order;
  onTrackOrder: (orderNumber: string) => void;
  onBackToMenu: () => void;
  onViewRecentOrders?: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onTrackOrder,
  onBackToMenu,
  onViewRecentOrders
}) => {
  const [copied, setCopied] = useState(false);

  // Generate prefilled WhatsApp message
  const itemsText = order.items.map(i => `• ${i.quantity}x ${i.name} (Rs. ${i.itemTotal})`).join('%0A');
  const whatsappMsg = `Assalam-o-Alaikum Saadaat Kitchen!%0A%0A*NEW ORDER: ${order.orderNumber}*%0AName: ${encodeURIComponent(order.customerName)}%0APhone: ${encodeURIComponent(order.customerPhone)}%0AAddress: ${encodeURIComponent(order.deliveryAddress)}%0APayment: ${order.paymentMethod === 'easypaisa' ? 'Easypaisa (Syeda Iqraa)' : 'Cash on Delivery'}%0A${order.easypaisaRef ? `TRX ID: ${encodeURIComponent(order.easypaisaRef)}%0A` : ''}%0A*Items:*%0A${itemsText}%0A%0A*Total Amount:* Rs. ${order.totalAmount}%0A%0APlease confirm my order. Shukriya!`;

  const whatsappUrl = `https://wa.me/923710238821?text=${whatsappMsg}`;

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl glass-panel border border-amber-500/30 p-6 sm:p-10 shadow-2xl space-y-8 bg-zinc-950">
        
        {/* Success Icon & Heading */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block">
            Order Successfully Placed!
          </span>
          <h1 className="text-3xl font-display font-bold text-white">
            Thank you, {order.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Your order has been sent to the Saadaat Kitchen grill team. We have reserved your fresh items and are preparing for cooking.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider block font-medium">
              Order Reference Number
            </span>
            <span className="text-2xl font-display font-bold gold-gradient-text tracking-wide tabular-nums">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyOrderNumber}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Order Summary Button */}
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center justify-center sm:justify-start gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Send Order Summary to WhatsApp</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Notify the kitchen manager directly for faster dispatch and delivery coordination.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-transform hover:scale-105 shrink-0 text-center"
          >
            Send via WhatsApp
          </a>
        </div>

        {/* Breakdown & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Delivery Details
            </h4>
            <div className="text-zinc-200 font-semibold">{order.customerName}</div>
            <div className="text-zinc-400">{order.customerPhone}</div>
            <div className="text-zinc-400 flex items-start gap-1 pt-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
              <span>{order.deliveryAddress}</span>
            </div>
            {order.deliveryInstructions && (
              <div className="text-zinc-500 italic pt-1">
                Note: {order.deliveryInstructions}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Payment Information
            </h4>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment Method:</span>
              <span className="font-bold text-white uppercase">
                {order.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment Status:</span>
              <span className="font-semibold text-amber-400 uppercase">
                {order.paymentStatus.replace('_', ' ')}
              </span>
            </div>
            {order.paymentMethod === 'easypaisa' && (
              <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                Easypaisa Account: <span className="text-white font-bold">Syeda Iqraa (+92 371 0238821)</span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Receipt Table */}
        <div className="border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Dish / Item</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-medium text-white">{item.name}</td>
                  <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                  <td className="p-3 text-right tabular-nums text-zinc-400">Rs. {item.price}</td>
                  <td className="p-3 text-right tabular-nums font-semibold text-white">Rs. {item.itemTotal}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-zinc-900/70 border-t border-zinc-800 text-xs text-zinc-300">
              <tr>
                <td colSpan={3} className="p-2.5 text-right text-zinc-400">Subtotal:</td>
                <td className="p-2.5 text-right font-semibold tabular-nums text-white">Rs. {order.subtotal}</td>
              </tr>
              <tr>
                <td colSpan={3} className="p-2.5 text-right text-zinc-400">Delivery Fee:</td>
                <td className="p-2.5 text-right font-semibold tabular-nums text-white">Rs. {order.deliveryFee}</td>
              </tr>
              <tr className="border-t border-zinc-800 text-sm font-bold text-white">
                <td colSpan={3} className="p-3 text-right">Total Payable:</td>
                <td className="p-3 text-right gold-gradient-text tabular-nums">Rs. {order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBackToMenu}
              className="flex-1 sm:flex-initial px-5 py-3 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              Order More Dishes
            </button>
            {onViewRecentOrders && (
              <button
                onClick={onViewRecentOrders}
                className="flex-1 sm:flex-initial px-5 py-3 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors cursor-pointer"
              >
                View Past Orders
              </button>
            )}
          </div>

          <button
            onClick={() => onTrackOrder(order.orderNumber)}
            className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Track My Order Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
