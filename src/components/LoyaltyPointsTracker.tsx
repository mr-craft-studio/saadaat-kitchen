import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Order } from '../types/index.ts';
import { useToast } from '../context/ToastContext.tsx';
import { 
  Award, 
  Sparkles, 
  Gift, 
  Check, 
  Copy, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Crown
} from 'lucide-react';

export interface LoyaltyPointsTrackerProps {
  orders: Order[];
  onNavigateToMenu?: () => void;
  onNavigateToCheckout?: () => void;
  compact?: boolean;
}

export interface LoyaltyTier {
  id: 'bronze' | 'silver' | 'gold' | 'platinum';
  name: string;
  minPoints: number;
  nextThreshold: number;
  discountReward: number;
  voucherCode: string;
  color: string;
  badgeBg: string;
}

const TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Member',
    minPoints: 0,
    nextThreshold: 100,
    discountReward: 250,
    voucherCode: 'LOYALTY250',
    color: 'text-amber-500',
    badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
  },
  {
    id: 'silver',
    name: 'Silver Connoisseur',
    minPoints: 100,
    nextThreshold: 250,
    discountReward: 600,
    voucherCode: 'LOYALTY600',
    color: 'text-slate-300',
    badgeBg: 'bg-slate-400/10 border-slate-400/20 text-slate-200'
  },
  {
    id: 'gold',
    name: 'Gold VIP',
    minPoints: 250,
    nextThreshold: 500,
    discountReward: 1500,
    voucherCode: 'LOYALTY1500',
    color: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
  },
  {
    id: 'platinum',
    name: 'Platinum Ambassador',
    minPoints: 500,
    nextThreshold: 1000,
    discountReward: 2500,
    voucherCode: 'LOYALTY2500',
    color: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
  }
];

export const LoyaltyPointsTracker: React.FC<LoyaltyPointsTrackerProps> = ({
  orders,
  onNavigateToMenu,
  onNavigateToCheckout,
  compact = false
}) => {
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Welcome bonus for joining Saadaat Kitchen Loyalty Club
  const WELCOME_BONUS_POINTS = 25;

  // Calculate points from orders: 1 point per Rs. 50 spent
  const ordersPoints = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, order) => sum + Math.floor(order.totalAmount / 50), 0);

  const totalPoints = WELCOME_BONUS_POINTS + ordersPoints;
  const totalSpend = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  // Determine current tier
  const currentTier = 
    totalPoints >= 500 ? TIERS[3] :
    totalPoints >= 250 ? TIERS[2] :
    totalPoints >= 100 ? TIERS[1] :
    TIERS[0];

  // Next milestone calculation
  const nextTarget = currentTier.nextThreshold;
  const prevFloor = currentTier.minPoints;
  const pointsInCurrentTier = totalPoints - prevFloor;
  const span = nextTarget - prevFloor;
  const progressPercent = Math.min(100, Math.max(0, Math.round((pointsInCurrentTier / span) * 100)));
  const pointsNeeded = Math.max(0, nextTarget - totalPoints);
  const spendNeededForNextDiscount = pointsNeeded * 50;

  // Copy voucher handler
  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Voucher code "${code}" copied! Apply at checkout for discount.`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Luxury Tracker Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-zinc-950 border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header & Tier Badge */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${currentTier.badgeBg}`}>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentTier.name}</span>
              </span>
              <span className="text-[11px] text-zinc-400">
                Member Status
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2 mt-1">
              <span>Saadaat Kitchen Loyalty Club</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h3>
            <p className="text-xs text-zinc-400">
              Earn 1 Point for every Rs. 50 spent on live grills, burgers, and rolls.
            </p>
          </div>

          {/* Points Big Counter */}
          <div className="flex items-center sm:items-end flex-col sm:text-right bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
              Available Loyalty Points
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-display font-extrabold gold-gradient-text tabular-nums">
                {totalPoints}
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                PTS
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 mt-0.5">
              Equivalent to Rs. {Math.floor(totalPoints * 2.5)} in rewards
            </span>
          </div>
        </div>

        {/* Progress Bar towards Next Discount */}
        <div className="relative z-10 pt-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Next Reward:</span>
              <span className="text-amber-400 font-semibold">
                Rs. {currentTier.discountReward} Discount Voucher
              </span>
              <span className="text-zinc-500">
                ({nextTarget} Points target)
              </span>
            </div>
            <div className="text-right">
              <span className="text-zinc-400 font-medium">
                {pointsNeeded === 0 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Threshold Unlocked!
                  </span>
                ) : (
                  <span>
                    <strong className="text-amber-400 tabular-nums">{pointsNeeded} pts</strong> away ({progressPercent}%)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Simple Animated Gold Progress Bar */}
          <div className="relative w-full h-3.5 bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden p-0.5 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 relative shadow-[0_0_12px_rgba(234,179,8,0.5)]"
            >
              {/* Shimmer light reflection effect */}
              <div className="absolute inset-0 bg-white/20 opacity-40 rounded-full" />
            </motion.div>
          </div>

          {/* Context Explainer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-zinc-400 pt-1">
            <span>
              {pointsNeeded > 0 ? (
                <>
                  Spend <strong className="text-zinc-200">Rs. {spendNeededForNextDiscount}</strong> on upcoming orders to unlock your next discount.
                </>
              ) : (
                <span className="text-emerald-300 font-semibold">
                  Congratulations! You unlocked the {currentTier.voucherCode} discount code.
                </span>
              )}
            </span>

            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>{showHowItWorks ? 'Hide Rules' : 'How Points Work'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Rules / Tier Guide */}
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 space-y-3"
          >
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400 flex items-center gap-1.5">
              <Gift className="w-4 h-4" />
              <span>Loyalty Club Tiers & Rules</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-bold text-white block">1. Earn Points</span>
                <span className="text-[11px] text-zinc-400 mt-0.5 block">
                  Every Rs. 50 spent = 1 Loyalty Point automatically added from confirmed orders.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-bold text-white block">2. Reach Milestones</span>
                <span className="text-[11px] text-zinc-400 mt-0.5 block">
                  100 pts → Rs. 250 off<br />
                  250 pts → Rs. 600 off<br />
                  500 pts → Rs. 1,500 off
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-bold text-white block">3. Easy Redemption</span>
                <span className="text-[11px] text-zinc-400 mt-0.5 block">
                  Apply your voucher code directly on the checkout screen to reduce total payable amount.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Available / Unlocked Rewards Section */}
        <div className="relative z-10 mt-6 pt-6 border-t border-zinc-800/80">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Claimable Vouchers & Discount Codes</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TIERS.map(tier => {
              const isUnlocked = totalPoints >= tier.nextThreshold || (tier.id === 'bronze' && totalPoints >= 100);
              const isCopied = copiedCode === tier.voucherCode;

              return (
                <div
                  key={tier.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-zinc-950/40 border-zinc-800/60 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {tier.name}
                      </span>
                      {isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500">
                          Requires {tier.nextThreshold} pts
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-display font-bold text-white">
                      Rs. {tier.discountReward} OFF
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Valid on all BBQ, platters, burgers, and rolls.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div className="font-mono text-xs font-bold text-amber-300 px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                      {tier.voucherCode}
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleCopyVoucher(tier.voucherCode)}
                        className="px-3 py-1.5 rounded-lg gold-gradient-bg text-zinc-950 text-xs font-bold flex items-center gap-1 hover:scale-105 transition-transform cursor-pointer"
                        title="Copy discount code"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Claim'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500 italic">
                        {Math.max(0, tier.nextThreshold - totalPoints)} pts to unlock
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Points History Breakdown (Recent Orders Calculation) */}
      {!compact && (
        <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Points Calculation & Activity History</span>
            </h4>
            <span className="text-xs text-zinc-500">
              Total Spend: <strong className="text-white">Rs. {totalSpend}</strong>
            </span>
          </div>

          <div className="divide-y divide-zinc-850">
            {/* Welcome Bonus Entry */}
            <div className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <span className="font-semibold text-white block">
                    Welcome Member Gift
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Complimentary bonus for joining Saadaat Kitchen Loyalty Club
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400 tabular-nums block">
                  +{WELCOME_BONUS_POINTS} PTS
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Credited</span>
              </div>
            </div>

            {/* Orders Activity */}
            {orders.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500">
                No orders logged yet. Place your first order to earn points automatically!
              </div>
            ) : (
              orders.map(order => {
                const points = Math.floor(order.totalAmount / 50);
                const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div key={order.orderNumber} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold">
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                            Rs. {order.totalAmount}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500">
                          {orderDate} · {order.items?.length || 0} item(s) · Status: {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400 tabular-nums block">
                        +{points} PTS
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        1 pt / Rs. 50
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {onNavigateToMenu && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={onNavigateToMenu}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>Order More Food to Earn Points</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
