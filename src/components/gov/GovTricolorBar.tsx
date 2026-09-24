import React, { useState } from 'react';
import { Sparkles, Globe, Headphones, Shield } from 'lucide-react';

export const GovTricolorBar: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  return (
    <div className="w-full text-xs bg-slate-900 text-slate-300 border-b border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-[11px]">
        {/* Left: Announcement */}
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="font-medium text-slate-200">
            AdivaSetu Gateway • Fellowship Sanctions & DBT Direct Transfer Active
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">
            Ministry of Tribal Affairs Initiatives
          </span>
        </div>

        {/* Right: Quick Utility & Language */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition-colors">
            <Headphones className="w-3 h-3 text-slate-400" />
            <span>Toll-Free Helpdesk: 1800-11-7788</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Globe className="w-3 h-3 text-slate-400" />
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
