import React from 'react';
import { motion } from 'framer-motion';
import { Order, OrderStatus } from '../types/index.ts';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  PackageCheck, 
  Bike, 
  AlertTriangle,
  CreditCard,
  User,
  Sparkles
} from 'lucide-react';

export interface OrderStatusTimelineProps {
  order: Order;
  compact?: boolean;
}

interface StageDefinition {
  status: OrderStatus;
  label: 'Received' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StageDefinition[] = [
  {
    status: 'received',
    label: 'Received',
    description: 'Order placed by customer and logged into Saadaat Kitchen database.',
    icon: Clock
  },
  {
    status: 'confirmed',
    label: 'Confirmed',
    description: 'Order acknowledged and accepted by kitchen staff.',
    icon: CheckCircle2
  },
  {
    status: 'preparing',
    label: 'Preparing',
    description: 'Skewers placed on live charcoal grill, fresh patties on griddle.',
    icon: ChefHat
  },
  {
    status: 'ready',
    label: 'Ready',
    description: 'Food prepared, quality checked, and sealed in thermal packaging.',
    icon: PackageCheck
  },
  {
    status: 'dispatched',
    label: 'Out for Delivery',
    description: 'Rider dispatched with thermal bag heading to your address.',
    icon: Bike
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Order delivered to customer. Good Food ❤️ Happy Mood!',
    icon: CheckCircle2
  }
];

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ order, compact = false }) => {
  const isCancelled = order.orderStatus === 'cancelled';
  const history = order.statusHistory || [];

  // Progression sequence
  const stageOrder: OrderStatus[] = ['received', 'confirmed', 'preparing', 'ready', 'dispatched', 'delivered'];
  const activeStageIndex = stageOrder.indexOf(order.orderStatus);

  // Compute percentage for vertical animated progress bar
  const progressPercent = isCancelled
    ? 100
    : activeStageIndex >= 0
    ? Math.min(100, Math.round((activeStageIndex / (stageOrder.length - 1)) * 100))
    : 10;

  const orderStartTime = new Date(order.createdAt).getTime();

  return (
    <div className="w-full space-y-6">
      {!compact && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-900 gap-2">
          <div>
            <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <span>Order Status Timeline</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h4>
            <p className="text-[11px] text-zinc-400">
              Live updates with verified database timestamps.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Current Status:</span>
            <span className="font-bold uppercase tracking-wider text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px]">
              {order.orderStatus === 'dispatched' ? 'Out for Delivery' : order.orderStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Main Vertical Progress Container */}
      <div className="relative pl-6 sm:pl-8 py-2">
        {/* Animated Background Line */}
        <div className="absolute left-[19px] sm:left-[27px] top-4 bottom-4 w-1 bg-zinc-800 rounded-full overflow-hidden">
          {/* Framer Motion Animated Fill Bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full rounded-full ${
              isCancelled
                ? 'bg-red-500'
                : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-300 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
            }`}
          />
        </div>

        {/* Stages List */}
        <div className="space-y-7">
          {STAGES.map((stage, idx) => {
            const isCompleted = !isCancelled && activeStageIndex >= idx;
            const isCurrent = !isCancelled && activeStageIndex === idx;
            const isUpcoming = !isCancelled && activeStageIndex < idx;

            // Find matching event from database history
            const historyEvent = history.find(h => h.status === stage.status);

            // Calculate timestamp
            const rawTimestamp = historyEvent?.timestamp || (idx === 0 ? order.createdAt : null);
            const eventDate = rawTimestamp ? new Date(rawTimestamp) : null;
            const formattedTime = eventDate
              ? eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : null;
            const formattedDate = eventDate
              ? eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : null;

            // Elapsed time from creation
            const elapsedMins = eventDate
              ? Math.max(0, Math.round((eventDate.getTime() - orderStartTime) / 60000))
              : null;

            const IconComponent = stage.icon;

            return (
              <motion.div
                key={stage.status}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isUpcoming ? 0.45 : 1, x: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className={`relative flex items-start gap-4 sm:gap-6 group transition-all duration-300 ${
                  isUpcoming ? 'grayscale-[30%]' : ''
                }`}
              >
                {/* Node Indicator with Framer Motion pulse ring */}
                <div className="relative z-10 shrink-0">
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.28, 1], opacity: [0.35, 0.8, 0.35] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-2xl bg-amber-400/30 blur-sm pointer-events-none"
                    />
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'gold-gradient-bg text-zinc-950 ring-4 ring-amber-500/30 shadow-lg shadow-amber-500/40 scale-105'
                        : isCompleted
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </motion.div>
                </div>

                {/* Content & Timestamp Details */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className={`text-xs sm:text-sm font-bold tracking-tight ${
                        isCurrent ? 'text-amber-400 font-extrabold' : isCompleted ? 'text-white' : 'text-zinc-500'
                      }`}>
                        {stage.label}
                      </h5>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                          In Progress
                        </span>
                      )}

                      {historyEvent?.by && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 flex items-center gap-1 capitalize">
                          <User className="w-2.5 h-2.5 text-zinc-500" />
                          <span>{historyEvent.by}</span>
                        </span>
                      )}

                      {elapsedMins !== null && elapsedMins > 0 && (
                        <span className="text-[10px] text-amber-400 font-semibold tabular-nums">
                          +{elapsedMins} min
                        </span>
                      )}
                    </div>

                    {/* Exact Database Timestamp */}
                    {formattedTime ? (
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs font-semibold text-white tabular-nums block">
                          {formattedTime}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {formattedDate}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-zinc-600 italic">
                        Pending stage
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {historyEvent?.note || stage.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Cancellation State */}
          {isCancelled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex items-start gap-4 sm:gap-6"
            >
              <div className="relative z-10 shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center ring-4 ring-red-600/30 shadow-lg shadow-red-600/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs sm:text-sm font-bold text-red-400">
                    Cancelled
                  </h5>
                  <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-bold uppercase">
                    Terminated
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  {history.find(h => h.status === 'cancelled')?.note || 'This order was cancelled by customer or restaurant administration.'}
                </p>
                <div className="text-[11px] text-zinc-500 mt-1 tabular-nums">
                  {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : ''}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Easypaisa Payment Verification Node */}
      {order.paymentMethod === 'easypaisa' && order.easypaisaRef && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 p-4 rounded-2xl bg-zinc-900/60 border border-amber-500/20 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Easypaisa Payment Record</span>
              <span className="text-[11px] text-zinc-400">
                TRX ID: <strong className="text-amber-400">{order.easypaisaRef}</strong>
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            {order.paymentStatus.replace('_', ' ')}
          </span>
        </motion.div>
      )}
    </div>
  );
};
