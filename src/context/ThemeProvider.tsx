'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type BaseTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: BaseTheme;
  isCodeMode: boolean;
  setTheme: (theme: BaseTheme) => void;
  toggleCodeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<BaseTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as BaseTheme;
      if (saved && ['light', 'dark'].includes(saved)) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [isCodeMode, setIsCodeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isCodeMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'code');
    root.classList.add(theme);
    if (isCodeMode) {
      root.classList.add('code');
    }
    localStorage.setItem('theme', theme);
    localStorage.setItem('isCodeMode', String(isCodeMode));
  }, [theme, isCodeMode]);

  const toggleCodeMode = () => setIsCodeMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme, isCodeMode, setTheme: setThemeState, toggleCodeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
