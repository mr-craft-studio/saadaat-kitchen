import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-display font-bold text-white">Your Order</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 text-amber-400 font-semibold border border-zinc-800">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <ShoppingBag className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Explore our sizzling Chicken Tikka, Paratha Rolls, and Zinger Burgers to get started.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-zinc-950 gold-gradient-bg rounded-xl shadow cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 items-start"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-zinc-950 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs gold-gradient-text font-bold tabular-nums mt-0.5">
                      Rs. {item.price} each
                    </div>

                    {item.specialInstructions && (
                      <div className="text-[11px] text-zinc-400 italic mt-1 bg-zinc-950/60 p-1 rounded">
                        Note: {item.specialInstructions}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-zinc-200 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-zinc-200 tabular-nums">
                        Rs. {item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-900 bg-zinc-950/80 space-y-4">
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold tabular-nums text-white">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Fee</span>
                  <span>Calculated at Checkout (Rs. 100)</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between text-base font-display font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="gold-gradient-text tabular-nums">Rs. {subtotal} + Delivery</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cash on Delivery & Easypaisa available</span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 text-sm font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
