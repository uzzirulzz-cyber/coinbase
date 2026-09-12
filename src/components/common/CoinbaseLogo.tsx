import React from 'react';

interface CoinbaseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CoinbaseLogo: React.FC<CoinbaseLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  onClick
}) => {
  const iconDimensions = {
    sm: 24,
    md: 32,
    lg: 44,
    xl: 64,
  }[size];

  const textStyles = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-4xl font-black tracking-tight',
  }[size];

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* 3D Glowing Coinbase Emblem */}
      <div 
        className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: iconDimensions, height: iconDimensions }}
      >
        {/* Neon blue underglow */}
        <div 
          className="absolute inset-0 rounded-full bg-blue-500/40 blur-md group-hover:bg-blue-400/60 transition-all"
        />

        <svg
          viewBox="0 0 100 100"
          width={iconDimensions}
          height={iconDimensions}
          className="relative drop-shadow-[0_4px_12px_rgba(0,82,255,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cbGradOuter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="35%" stopColor="#0052FF" />
              <stop offset="85%" stopColor="#002b80" />
              <stop offset="100%" stopColor="#0a1945" />
            </linearGradient>
            <linearGradient id="cbRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#002b80" stopOpacity="0.9" />
            </linearGradient>
            <filter id="cb3DBevel" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Outer circle with bevel */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="url(#cbGradOuter)"
            stroke="url(#cbRim)"
            strokeWidth="3"
            filter="url(#cb3DBevel)"
          />

          {/* Inner cutout forming the iconic 'C' */}
          {/* Inner ring */}
          <circle
            cx="50"
            cy="50"
            r="24"
            fill="#050b18"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.5"
          />

          {/* Opening notch of the 'C' on the right side */}
          <rect
            x="48"
            y="37"
            width="48"
            height="26"
            fill="#050b18"
          />

          {/* High-gloss specular highlight arc on top rim */}
          <path
            d="M 20 40 A 40 40 0 0 1 80 40"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Center glowing eye */}
          <circle
            cx="50"
            cy="50"
            r="10"
            fill="#0052FF"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Sleek Metallic Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span 
            className={`${textStyles} bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,82,255,0.4)] tracking-tight font-sans`}
          >
            coinbase
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-semibold -mt-1">
              Institutional Exchange
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};
