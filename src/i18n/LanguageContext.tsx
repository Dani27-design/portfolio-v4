import React, { createContext, useContext, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { en } from './translations/en';
import { id } from './translations/id';
import type { Language, LanguageContextType } from './types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const language = (lang as Language) || 'en';

  useEffect(() => {
    localStorage.setItem('portfolio_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLang: Language) => {
    const currentPath = location.pathname;
    const currentHash = location.hash;

    // Replace language prefix in path
    const pathWithoutLang = currentPath.replace(/^\/(en|id)/, '');
    const newPath = `/${newLang}${pathWithoutLang || '/'}`;

    navigate(newPath + currentHash);
  };

  const t = (key: string): string => {
    const translations = language === 'en' ? en : id;
    const keys = key.split('.');
    let result: unknown = translations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key; // Fallback to key itself when missing
      }
    }

    return typeof result === 'string' ? result : key;
  };

  const tArray = (key: string): string[] => {
    const translations = language === 'en' ? en : id;
    const keys = key.split('.');
    let result: unknown = translations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return [];
      }
    }

    return Array.isArray(result) ? result : [];
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    tArray,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export type { Language };
