import React, { useState } from 'react';
import { Volume2, Type, Globe } from 'lucide-react';

export const GovTricolorBar: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  return (
    <header role="banner" className="w-full text-xs border-b border-slate-200 bg-slate-100/90 select-none">
      {/* Indian National Tricolor Thin Accent */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]"></div>
        <div className="bg-white"></div>
        <div className="bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between text-slate-600 text-[11px]">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-800">भारत सरकार | Government of India</span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-600">जनजाति कार्य मंत्रालय | Ministry of Tribal Affairs</span>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="#main-content"
            className="hover:text-emerald-800 font-medium transition-colors hidden sm:inline"
          >
            Skip to main content
          </a>
          <span className="hidden sm:inline text-slate-300">|</span>

          {/* Accessibility controls */}
          <div className="flex items-center space-x-1.5" aria-label="Accessibility text options">
            <button
              onClick={() => alert('Screen reader mode enabled.')}
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
              title="Screen Reader Access"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center border border-slate-300 rounded px-1.5 py-0.5 bg-white text-[10px] space-x-1 font-semibold">
              <span className="cursor-pointer hover:text-emerald-800" title="Decrease Font">A-</span>
              <span className="cursor-pointer hover:text-emerald-800" title="Normal Font">A</span>
              <span className="cursor-pointer hover:text-emerald-800" title="Increase Font">A+</span>
            </div>
          </div>

          <span className="text-slate-300">|</span>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 font-semibold text-emerald-800 hover:text-emerald-950 px-1 py-0.5"
            title="Toggle Hindi/English"
          >
            <Globe className="w-3 h-3" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
