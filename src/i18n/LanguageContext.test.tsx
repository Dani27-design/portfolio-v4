import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage, Language } from './LanguageContext';

// Helper to capture current location
const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

// Wrapper for testing useLanguage hook with router context
const createWrapper = (initialEntries: string[] = ['/en/']) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/:lang/*" element={<LanguageProvider>{children}</LanguageProvider>} />
      </Routes>
    </MemoryRouter>
  );
  return Wrapper;
};

describe('LanguageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (localStorage.getItem as Mock).mockReturnValue(null);
    (localStorage.setItem as Mock).mockClear();
  });

  describe('useLanguage hook', () => {
    it('should throw error when used outside LanguageProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow('useLanguage must be used within LanguageProvider');

      consoleSpy.mockRestore();
    });

    it('should return language "en" when URL path is /en/', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      expect(result.current.language).toBe('en');
    });

    it('should return language "id" when URL path is /id/', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/id/']),
      });

      expect(result.current.language).toBe('id');
    });

    it('should return language "en" when URL path is /en/blog', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/blog']),
      });

      expect(result.current.language).toBe('en');
    });

    it('should return language "id" when URL path is /id/blog/some-slug', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/id/blog/some-slug']),
      });

      expect(result.current.language).toBe('id');
    });
  });

  describe('localStorage persistence', () => {
    it('should persist language to localStorage when URL contains /en/', () => {
      renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'en');
    });

    it('should persist language to localStorage when URL contains /id/', () => {
      renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/id/']),
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'id');
    });
  });

  describe('setLanguage function', () => {
    it('should be a function', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      expect(typeof result.current.setLanguage).toBe('function');
    });
  });

  describe('t function (translation)', () => {
    it('should be a function', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      expect(typeof result.current.t).toBe('function');
    });

    it('should return English translation for nav.about when language is en', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      expect(result.current.t('nav.about')).toBe('About');
    });

    it('should return Indonesian translation for nav.about when language is id', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/id/']),
      });

      expect(result.current.t('nav.about')).toBe('Tentang');
    });

    it('should return the key itself when translation is missing', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      expect(result.current.t('nonexistent.key.path')).toBe('nonexistent.key.path');
    });

    it('should handle nested translation keys', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      // Testing a deeply nested key
      expect(result.current.t('hero.tagline')).toBe('System Architect Core');
    });

    it('should return Indonesian hero tagline when language is id', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/id/']),
      });

      expect(result.current.t('hero.tagline')).toBe('Inti Arsitek Sistem');
    });
  });

  describe('tArray function', () => {
    it('should be a function', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      expect(typeof result.current.tArray).toBe('function');
    });

    it('should return English phrases array when language is en', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      const phrases = result.current.tArray('phrases');
      expect(Array.isArray(phrases)).toBe(true);
      expect(phrases).toContain('Systems Architect');
      expect(phrases).toContain('Fullstack Engineer');
    });

    it('should return Indonesian phrases array when language is id', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/id/']),
      });

      const phrases = result.current.tArray('phrases');
      expect(Array.isArray(phrases)).toBe(true);
      expect(phrases).toContain('Arsitek Sistem');
      expect(phrases).toContain('Insinyur Fullstack');
    });

    it('should return empty array when key does not exist', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      const result_array = result.current.tArray('nonexistent.array');
      expect(result_array).toEqual([]);
    });

    it('should return empty array when key points to non-array value', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      // nav.about is a string, not an array
      const result_array = result.current.tArray('nav.about');
      expect(result_array).toEqual([]);
    });
  });

  describe('document.documentElement.lang attribute', () => {
    it('should set html lang attribute to "en" when language is English', () => {
      renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/en/']),
      });

      expect(document.documentElement.lang).toBe('en');
    });

    it('should set html lang attribute to "id" when language is Indonesian', () => {
      renderHook(() => useLanguage(), {
        wrapper: createWrapper(['/id/']),
      });

      expect(document.documentElement.lang).toBe('id');
    });
  });
});

describe('Language type', () => {
  it('should only allow "en" or "id" as valid Language values', () => {
    // TypeScript compile-time check - this test documents the constraint
    const validEn: Language = 'en';
    const validId: Language = 'id';

    expect(validEn).toBe('en');
    expect(validId).toBe('id');
  });
});
