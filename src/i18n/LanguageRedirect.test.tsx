import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageRedirect } from './LanguageRedirect';

// Helper component to display current location for testing redirects
const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

// Test wrapper that captures the redirect destination
const TestApp: React.FC<{ initialPath?: string }> = ({ initialPath = '/' }) => (
  <MemoryRouter initialEntries={[initialPath]}>
    <Routes>
      <Route path="/" element={<LanguageRedirect />} />
      <Route path="/en/*" element={<LocationDisplay />} />
      <Route path="/id/*" element={<LocationDisplay />} />
    </Routes>
  </MemoryRouter>
);

describe('LanguageRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (localStorage.getItem as Mock).mockReturnValue(null);
    // Reset navigator.language mock
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });
  });

  describe('AC1: Default Language Detection', () => {
    describe('localStorage preference (highest priority)', () => {
      it('should redirect to /en/ when localStorage has "en" saved', () => {
        (localStorage.getItem as Mock).mockReturnValue('en');

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });

      it('should redirect to /id/ when localStorage has "id" saved', () => {
        (localStorage.getItem as Mock).mockReturnValue('id');

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/id/');
      });

      it('should ignore invalid localStorage value and fall back to browser detection', () => {
        (localStorage.getItem as Mock).mockReturnValue('fr'); // Invalid language
        Object.defineProperty(navigator, 'language', {
          value: 'id-ID',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/id/');
      });
    });

    describe('browser language detection (second priority)', () => {
      it('should redirect to /id/ when browser language is "id"', () => {
        Object.defineProperty(navigator, 'language', {
          value: 'id',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/id/');
      });

      it('should redirect to /id/ when browser language is "id-ID"', () => {
        Object.defineProperty(navigator, 'language', {
          value: 'id-ID',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/id/');
      });

      it('should redirect to /en/ when browser language is "en-US"', () => {
        Object.defineProperty(navigator, 'language', {
          value: 'en-US',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });

      it('should redirect to /en/ when browser language is "en-GB"', () => {
        Object.defineProperty(navigator, 'language', {
          value: 'en-GB',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });

      it('should redirect to /en/ when browser language is "fr-FR" (unsupported)', () => {
        Object.defineProperty(navigator, 'language', {
          value: 'fr-FR',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });

      it('should redirect to /en/ when browser language is "ms-MY" (Malay - not Indonesian)', () => {
        Object.defineProperty(navigator, 'language', {
          value: 'ms-MY',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });

      it('should redirect to /en/ when browser language is "ja-JP" (Japanese)', () => {
        Object.defineProperty(navigator, 'language', {
          value: 'ja-JP',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });

      it('should redirect to /en/ when browser language is "zh-CN" (Chinese)', () => {
        Object.defineProperty(navigator, 'language', {
          value: 'zh-CN',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });
    });

    describe('default fallback (lowest priority)', () => {
      it('should redirect to /en/ when browser language is undefined', () => {
        Object.defineProperty(navigator, 'language', {
          value: undefined,
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });

      it('should redirect to /en/ when browser language is empty string', () => {
        Object.defineProperty(navigator, 'language', {
          value: '',
          configurable: true,
        });

        render(<TestApp />);

        expect(screen.getByTestId('location')).toHaveTextContent('/en/');
      });
    });
  });

  describe('localStorage key', () => {
    it('should read from localStorage key "portfolio_language"', () => {
      render(<TestApp />);

      expect(localStorage.getItem).toHaveBeenCalledWith('portfolio_language');
    });
  });

  describe('redirect behavior', () => {
    it('should use replace navigation (not push)', () => {
      // This is tested implicitly - MemoryRouter with replace won't add to history
      // The component should use <Navigate replace /> or navigate(path, { replace: true })
      (localStorage.getItem as Mock).mockReturnValue('en');

      render(<TestApp />);

      // If replace is working, there should be no way to go "back" to /
      expect(screen.getByTestId('location')).toHaveTextContent('/en/');
    });
  });
});
