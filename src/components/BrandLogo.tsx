import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* 3D Gold Chef Hat Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-2 border border-amber-500/40 shadow-lg shadow-amber-500/10`}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#goldGradientIcon)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]"
        >
          <defs>
            <linearGradient id="goldGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
          </defs>
          {/* Chef Hat with 3D Pleats */}
          <path d="M6 13.8a4 4 0 0 1-2-3.4 4 4 0 0 1 6.5-3.1A5 5 0 0 1 18 8a4 4 0 0 1 2 3.4 3.5 3.5 0 0 1-2 3.2" />
          <path d="M6 17h12" />
          <path d="M7 17v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" />
          <path d="M10 17v-3" />
          <path d="M14 17v-3" />
        </svg>
      </div>

      {/* Brand Title & Tagline */}
      <div className="flex flex-col">
        <span className={`font-display font-bold tracking-tight text-white ${textSizes[size]} leading-none`}>
          SAADAAT <span className="gold-gradient-text">KITCHEN</span>
        </span>
        {showTagline && (
          <span className="text-[11px] text-zinc-400 font-sans tracking-wide mt-1 flex items-center gap-1">
            Good Food <span className="text-red-500 animate-pulse">❤️</span> Happy Mood
          </span>
        )}
      </div>
    </div>
  );
};
