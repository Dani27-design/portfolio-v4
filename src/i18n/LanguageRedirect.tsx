import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Language } from './types';

export const LanguageRedirect: React.FC = () => {
  const location = useLocation();

  const getPreferredLanguage = (): Language => {
    // 1. Check localStorage preference
    const saved = localStorage.getItem('portfolio_language') as Language | null;
    if (saved && (saved === 'en' || saved === 'id')) {
      return saved;
    }

    // 2. Check browser language
    const browserLang = navigator.language?.toLowerCase() || '';
    if (browserLang.startsWith('id')) {
      return 'id';
    }

    // 3. Default to English
    return 'en';
  };

  const preferredLang = getPreferredLanguage();

  // Preserve hash when redirecting
  return <Navigate to={`/${preferredLang}/${location.hash}`} replace />;
};
