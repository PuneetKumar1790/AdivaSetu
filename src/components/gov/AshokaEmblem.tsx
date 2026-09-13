import React from 'react';

export const AshokaEmblem: React.FC<{ className?: string; size?: number }> = ({ className = 'text-amber-600', size = 38 }) => {
  return (
    <div className={`inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Stylized Indian National Emblem Ashoka Pillar representation */}
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
        <path d="M50 12 L56 26 L70 28 L59 38 L62 52 L50 44 L38 52 L41 38 L30 28 L44 26 Z" fill="currentColor" opacity="0.85" />
        <circle cx="50" cy="65" r="16" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="50" cy="65" r="4" fill="currentColor" />
        {/* 24 spokes representation */}
        <path d="M50 49 L50 81 M34 65 L66 65 M39 54 L61 76 M39 76 L61 54" stroke="currentColor" strokeWidth="1.5" />
        <rect x="28" y="85" width="44" height="5" rx="2" fill="currentColor" />
      </svg>
      <span className="text-[7.5px] font-bold tracking-widest uppercase mt-0.5 text-slate-700">सत्यमेव जयते</span>
    </div>
  );
};
