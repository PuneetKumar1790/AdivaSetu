import React from 'react';
import { Globe, Headphones } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AppLanguage } from '../../i18n/translations';

export const GovTricolorBar: React.FC = () => {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <div className="w-full text-xs bg-slate-900 text-slate-300 border-b border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-[11px]">
        {/* Left: Announcement */}
        <div className="flex items-center space-x-2 truncate mr-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="font-medium text-slate-200 truncate">
            {t('header.announcement')}
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden lg:inline text-slate-400 truncate">
            {t('header.ministry')}
          </span>
        </div>

        {/* Right: Quick Utility & Full Language Switcher */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="hidden sm:flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition-colors">
            <Headphones className="w-3 h-3 text-slate-400" />
            <span>{t('header.tollFree')}</span>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center bg-slate-800/90 hover:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 transition-colors">
            <Globe className="w-3 h-3 text-emerald-400 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              aria-label="Select Portal Language"
              className="bg-transparent text-slate-200 text-[11px] font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
