import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQView: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What are Saadaat Kitchen opening hours?',
      answer: 'Our kitchen operates from 4:00 PM to 2:00 AM every day (Monday through Sunday), serving freshly prepared dinner and late-night cravings.'
    },
    {
      question: 'How do I place an order online?',
      answer: 'You can browse our menu on this website, add your favorite BBQ, rolls, or burgers to your cart, and click Checkout. Choose either Cash on Delivery or Easypaisa payment. Alternatively, you can order directly through our official WhatsApp at +92 371 0238821.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We support two simple payment options: 1) Cash on Delivery (COD), where you pay our rider upon receiving your fresh meal; 2) Easypaisa Transfer directly to account Syeda Iqraa (+92 371 0238821).'
    },
    {
      question: 'How do I track my food order?',
      answer: 'Once you place an order, you receive a unique Order Reference (e.g. SK-2026-XXXX). Go to the "Track Order" page in the navigation menu, enter your Order Number, and view the live cooking and dispatch timeline.'
    },
    {
      question: 'Can I customize the spice level or request extras?',
      answer: 'Yes! When viewing any product or at checkout, you can add Special Instructions (e.g. "Mild spice", "Extra crispy paratha", "Separate mint raita", or "Extra garlic mayo").'
    },
    {
      question: 'What is your delivery fee and minimum order?',
      answer: 'Our standard delivery fee is Rs. 100 within our delivery zones, and our minimum order value is Rs. 400 for delivery. Pickup orders have zero minimum and zero fee.'
    },
    {
      question: 'Is all your chicken and beef 100% Halal?',
      answer: 'Yes, 100% of our chicken and beef is certified Halal and sourced fresh each morning from trusted suppliers.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>Help & Answers</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Everything you need to know about ordering, payment, delivery, and ingredients.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-850"
              >
                <span className="text-sm font-semibold text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 bg-zinc-950/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-center space-y-3">
        <h3 className="text-base font-display font-bold text-white">
          Still have questions?
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Our friendly customer support is available every evening on WhatsApp.
        </p>
        <a
          href="https://wa.me/923710238821"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp (+92 371 0238821)</span>
        </a>
      </div>
    </div>
  );
};
