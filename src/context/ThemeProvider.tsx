'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MotionConfig } from 'motion/react';

export type BaseTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: BaseTheme;
  isCodeMode: boolean;
  setTheme: (theme: BaseTheme) => void;
  toggleCodeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to 'dark' on both server and client to avoid hydration mismatch.
  // The beforeInteractive script already sets the correct class on <html>,
  // so there's no flash. We sync state from localStorage in useEffect.
  const [theme, setThemeState] = useState<BaseTheme>('dark');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync from localStorage after mount (client only)
  useEffect(() => {
    const saved = localStorage.getItem('theme') as BaseTheme;
    if (saved && ['light', 'dark'].includes(saved)) {
      setThemeState(saved);
    } else {
      const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(preferred);
    }
    setIsCodeMode(localStorage.getItem('isCodeMode') === 'true');
    setMounted(true);
  }, []);

  // Apply theme/code classes and persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'code');
    root.classList.add(theme);
    if (isCodeMode) root.classList.add('code');
    localStorage.setItem('theme', theme);
    localStorage.setItem('isCodeMode', String(isCodeMode));
  }, [theme, isCodeMode, mounted]);

  const toggleCodeMode = () => setIsCodeMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme, isCodeMode, setTheme: setThemeState, toggleCodeMode }}>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
