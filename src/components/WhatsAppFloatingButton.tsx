import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const whatsappUrl = 'https://wa.me/923710238821?text=Assalam-o-Alaikum%20Saadaat%20Kitchen!%20I%20have%20an%20inquiry%20about%20your%20menu%20and%20orders.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95 group border border-emerald-400/40"
      aria-label="Chat on WhatsApp (+92 371 0238821)"
      title="Chat with Saadaat Kitchen on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
      <span className="text-xs font-bold tracking-wide hidden sm:inline">
        WhatsApp Us
      </span>
      {/* Tooltip on mobile */}
      <span className="sm:hidden text-xs font-bold">
        +92 371 0238821
      </span>
    </a>
  );
};
