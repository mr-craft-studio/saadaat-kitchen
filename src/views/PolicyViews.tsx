import React from 'react';
import { ArrowLeft, Shield, FileText, RotateCcw, AlertOctagon } from 'lucide-react';

interface PolicyProps {
  onBackToMenu: () => void;
}

export const PrivacyView: React.FC<PolicyProps> = ({ onBackToMenu }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Food Menu</span>
      </button>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          <span>Security & Transparency</span>
        </span>
        <h1 className="text-3xl font-display font-bold text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500">Last updated: October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-5">
        <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
        <p>
          When you place an online food order at Saadaat Kitchen, we collect basic details necessary to prepare and deliver your meal: your full name, Pakistani contact telephone number, and physical delivery address. If you contact us through our website contact form or AI assistant, we store your message to respond to your inquiry.
        </p>

        <h3 className="text-base font-bold text-white">2. Use of Your Information</h3>
        <p>
          Your information is solely used for:
        </p>
        <ul className="list-disc list-inside space-y-1 text-zinc-400">
          <li>Processing, preparing, and packaging your food order</li>
          <li>Enabling our delivery rider to locate your premises</li>
          <li>Sending WhatsApp order receipts and live status updates</li>
          <li>Verifying advance payments (e.g. Easypaisa transaction ID)</li>
        </ul>

        <h3 className="text-base font-bold text-white">3. Protection & Non-Disclosure</h3>
        <p>
          We do not sell, rent, or trade your contact numbers or addresses to any third-party marketing services. Payment verification is handled manually or via encrypted channels.
        </p>

        <h3 className="text-base font-bold text-white">4. Customer Data Rights</h3>
        <p>
          Customers can request to review or delete their stored delivery contact records at any time by contacting us on WhatsApp at +92 371 0238821.
        </p>
      </div>
    </div>
  );
};

export const TermsView: React.FC<PolicyProps> = ({ onBackToMenu }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Food Menu</span>
      </button>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          <span>Ordering Agreement</span>
        </span>
        <h1 className="text-3xl font-display font-bold text-white">
          Terms and Conditions
        </h1>
        <p className="text-xs text-zinc-500">Effective as of October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-5">
        <h3 className="text-base font-bold text-white">1. Order Placement & Acceptance</h3>
        <p>
          Orders submitted through this website constitute an offer to purchase freshly prepared food. All orders are subject to availability of ingredients. Saadaat Kitchen reserves the right to confirm or reject orders if the address falls outside delivery boundaries or if requested dishes are sold out.
        </p>

        <h3 className="text-base font-bold text-white">2. Prices & Currency</h3>
        <p>
          All product prices are quoted in Pakistani Rupees (PKR) and are final as confirmed during checkout. Menu prices are subject to periodic review by restaurant management.
        </p>

        <h3 className="text-base font-bold text-white">3. Payment Obligation</h3>
        <p>
          For Cash on Delivery (COD) orders, the customer agrees to have the exact or payable cash ready upon arrival of the delivery rider. For Easypaisa payments, orders are processed upon confirmation of transaction ID.
        </p>

        <h3 className="text-base font-bold text-white">4. Delivery Times</h3>
        <p>
          Standard delivery estimates are 35–55 minutes depending on traffic and order size. While we make every effort to deliver hot and fresh food promptly, unforeseen delays due to heavy rain, traffic, or rush hours will be communicated via phone or WhatsApp.
        </p>
      </div>
    </div>
  );
};

export const RefundView: React.FC<PolicyProps> = ({ onBackToMenu }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Food Menu</span>
      </button>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Fair Resolution Guarantee</span>
        </span>
        <h1 className="text-3xl font-display font-bold text-white">
          Refund and Cancellation Policy
        </h1>
        <p className="text-xs text-zinc-500">Commitment to complete satisfaction</p>
      </div>

      <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-5">
        <h3 className="text-base font-bold text-white">1. Order Cancellation</h3>
        <p>
          Because our BBQ and fast food are cooked fresh immediately upon placement, orders can be cancelled free of charge within <strong>5 minutes</strong> of submission by calling our kitchen hotline at +92 371 0238821. Once skewers are on the charcoal fire, cancellation may not be possible.
        </p>

        <h3 className="text-base font-bold text-white">2. Quality or Incorrect Item Complaints</h3>
        <p>
          If your delivery arrives with missing items, incorrect dishes, or quality issues, please notify us within 30 minutes of delivery. Share a photo of the receipt and meal on our WhatsApp at +92 371 0238821.
        </p>

        <h3 className="text-base font-bold text-white">3. Resolution & Reimbursement</h3>
        <p>
          Upon verification of an issue, Saadaat Kitchen will either:
        </p>
        <ul className="list-disc list-inside space-y-1 text-zinc-400">
          <li>Dispatch an immediate replacement item free of charge with priority delivery</li>
          <li>Issue an instant Easypaisa refund for the affected dish</li>
          <li>Provide a restaurant credit for your subsequent order</li>
        </ul>
      </div>
    </div>
  );
};

export const NotFoundView: React.FC<PolicyProps> = ({ onBackToMenu }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
          <AlertOctagon className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold block">
            Error 404
          </span>
          <h1 className="text-3xl font-display font-bold text-white mt-1">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            The dish or page you are looking for might have been moved or does not exist. Let's get you back to our fresh kitchen menu!
          </p>
        </div>
        <button
          onClick={onBackToMenu}
          className="px-8 py-3.5 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Return to Food Menu</span>
        </button>
      </div>
    </div>
  );
};
