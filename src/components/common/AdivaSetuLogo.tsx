import React from 'react';

interface AdivaSetuLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  light?: boolean;
  subtitle?: boolean;
  className?: string;
  useImage?: boolean;
}

const sizeMap = {
  xs: { icon: 24, text: 'text-sm', sub: 'text-[9px]' },
  sm: { icon: 32, text: 'text-base', sub: 'text-[10px]' },
  md: { icon: 40, text: 'text-lg', sub: 'text-[11px]' },
  lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
  xl: { icon: 68, text: 'text-3xl', sub: 'text-sm' },
};

export const AdivaSetuLogo: React.FC<AdivaSetuLogoProps> = ({
  size = 'md',
  showText = true,
  light = false,
  subtitle = false,
  className = '',
  useImage = false,
}) => {
  const dims = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon Mark */}
      {useImage ? (
        <img
          src="/logo.jpg"
          alt="AdivaSetu Logo"
          className="rounded-xl object-contain shadow-sm border border-slate-200/60"
          style={{ width: dims.icon, height: dims.icon }}
        />
      ) : (
        <div
          className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-1.5 shadow-md shadow-emerald-950/20 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all shrink-0"
          style={{ width: dims.icon, height: dims.icon }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="emeraldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
              <linearGradient id="glowGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#67e8f9" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Setu Bridge Outer Arc */}
            <path
              d="M 12 76 A 42 42 0 0 1 88 76"
              stroke="url(#tealGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Setu Foundation Base Pillars */}
            <line x1="10" y1="76" x2="24" y2="76" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            <line x1="76" y1="76" x2="90" y2="76" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />

            {/* Left Chevron Leg (Letter 'A' contour) */}
            <path
              d="M 24 74 L 42 34 L 50 48"
              stroke="url(#emeraldGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right Curve Interlock (Letter 'S' contour) */}
            <path
              d="M 46 62 Q 62 58 66 48 Q 70 38 58 34"
              stroke="url(#tealGrad)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 58 74 Q 72 74 76 64"
              stroke="url(#emeraldGrad)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Upward Ascending Arrow / Beacon of Aspirations */}
            <path
              d="M 50 70 L 50 18"
              stroke="url(#glowGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <path
              d="M 40 28 L 50 14 L 60 28"
              stroke="url(#glowGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight leading-none ${dims.text} ${
                light ? 'text-white' : 'text-slate-900'
              }`}
            >
              Adiva<span className="text-emerald-500">Setu</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
              National
            </span>
          </div>
          {subtitle && (
            <span
              className={`font-medium tracking-tight mt-0.5 ${dims.sub} ${
                light ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Tribal Higher Education & Fellowship Gateway
            </span>
          )}
        </div>
      )}
    </div>
  );
};
