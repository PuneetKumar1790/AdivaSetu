import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppLanguage,
  APP_LANGUAGES,
  LanguageOption,
  TRANSLATIONS,
  TranslationDictionary,
} from '../i18n/translations';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  currentLanguage: LanguageOption;
  languages: LanguageOption[];
  t: (keyPath: string, fallback?: string) => string;
  translations: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'adivasetu_app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AppLanguage;
      if (saved && APP_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage read errors
    }
    return 'en';
  });

  const setLanguage = (newLang: AppLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
      // Broadcast custom event so independent widgets / chatbots can synchronize
      window.dispatchEvent(new CustomEvent('adivasetu_language_changed', { detail: { language: newLang } }));
    } catch {
      // Ignore localStorage write errors
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentLanguage =
    APP_LANGUAGES.find((l) => l.code === language) || APP_LANGUAGES[0];

  const currentTranslations = TRANSLATIONS[language] || TRANSLATIONS.en;

  const t = (keyPath: string, fallback?: string): string => {
    const keys = keyPath.split('.');
    let result: any = currentTranslations;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        result = undefined;
        break;
      }
    }

    if (result !== undefined && typeof result === 'string') {
      return result;
    }

    // Fallback to English
    let enResult: any = TRANSLATIONS.en;
    for (const key of keys) {
      if (enResult && typeof enResult === 'object' && key in enResult) {
        enResult = enResult[key];
      } else {
        enResult = undefined;
        break;
      }
    }

    if (enResult !== undefined && typeof enResult === 'string') {
      return enResult;
    }

    return fallback || keyPath;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguage,
        languages: APP_LANGUAGES,
        t,
        translations: currentTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
