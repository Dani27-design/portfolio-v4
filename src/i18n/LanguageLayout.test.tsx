import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { LanguageLayout } from './LanguageLayout';
import { useLanguage } from './LanguageContext';

// Helper component to display current location
const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}{location.hash}</div>;
};

// Component that uses the language context
const LanguageConsumer: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="current-language">{language}</span>
      <span data-testid="translated-nav">{t('nav.about')}</span>
      <button data-testid="switch-to-en" onClick={() => setLanguage('en')}>EN</button>
      <button data-testid="switch-to-id" onClick={() => setLanguage('id')}>ID</button>
      <LocationDisplay />
    </div>
  );
};

// Test app with LanguageLayout
const TestApp: React.FC<{ initialPath?: string }> = ({ initialPath = '/en/' }) => (
  <MemoryRouter initialEntries={[initialPath]}>
    <Routes>
      <Route path="/:lang/*" element={<LanguageLayout />}>
        <Route index element={<LanguageConsumer />} />
        <Route path="blog" element={<LanguageConsumer />} />
        <Route path="blog/:slug" element={<LanguageConsumer />} />
        <Route path="projects" element={<LanguageConsumer />} />
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('LanguageLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (localStorage.getItem as Mock).mockReturnValue(null);
    (localStorage.setItem as Mock).mockClear();
  });

  describe('AC4: URL Structure and Routing', () => {
    it('should render children when URL path is /en/', () => {
      render(<TestApp initialPath="/en/" />);

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    });

    it('should render children when URL path is /id/', () => {
      render(<TestApp initialPath="/id/" />);

      expect(screen.getByTestId('current-language')).toHaveTextContent('id');
    });

    it('should render children when URL path is /en/blog', () => {
      render(<TestApp initialPath="/en/blog" />);

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(screen.getByTestId('location')).toHaveTextContent('/en/blog');
    });

    it('should render children when URL path is /id/blog/some-slug', () => {
      render(<TestApp initialPath="/id/blog/some-slug" />);

      expect(screen.getByTestId('current-language')).toHaveTextContent('id');
      expect(screen.getByTestId('location')).toHaveTextContent('/id/blog/some-slug');
    });

    it('should render children when URL path is /en/projects', () => {
      render(<TestApp initialPath="/en/projects" />);

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(screen.getByTestId('location')).toHaveTextContent('/en/projects');
    });
  });

  describe('Invalid language code handling (Edge Case 2)', () => {
    // Note: These tests verify redirect behavior for invalid locales
    const TestAppWithFallback: React.FC<{ initialPath?: string }> = ({ initialPath = '/en/' }) => (
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/:lang/*" element={<LanguageLayout />}>
            <Route index element={<LanguageConsumer />} />
          </Route>
          {/* Fallback route catches invalid redirects */}
          <Route path="*" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    it('should redirect to /en/ when language code is invalid (fr)', () => {
      render(<TestAppWithFallback initialPath="/fr/" />);

      // Should redirect to /en/ or show fallback
      expect(screen.getByTestId('location')).toHaveTextContent('/en/');
    });

    it('should redirect to /en/ when language code is invalid (de)', () => {
      render(<TestAppWithFallback initialPath="/de/about" />);

      expect(screen.getByTestId('location')).toHaveTextContent('/en/');
    });

    it('should redirect to /en/ when language code is invalid (es)', () => {
      render(<TestAppWithFallback initialPath="/es/blog/test" />);

      expect(screen.getByTestId('location')).toHaveTextContent('/en/');
    });
  });

  describe('AC2: Language Toggle Behavior - setLanguage navigation', () => {
    it('should navigate from /en/ to /id/ when setLanguage("id") is called', () => {
      render(<TestApp initialPath="/en/" />);

      expect(screen.getByTestId('location')).toHaveTextContent('/en/');

      fireEvent.click(screen.getByTestId('switch-to-id'));

      expect(screen.getByTestId('location')).toHaveTextContent('/id/');
    });

    it('should navigate from /id/ to /en/ when setLanguage("en") is called', () => {
      render(<TestApp initialPath="/id/" />);

      expect(screen.getByTestId('location')).toHaveTextContent('/id/');

      fireEvent.click(screen.getByTestId('switch-to-en'));

      expect(screen.getByTestId('location')).toHaveTextContent('/en/');
    });

    it('should preserve route path when switching from /en/blog to /id/blog', () => {
      render(<TestApp initialPath="/en/blog" />);

      expect(screen.getByTestId('location')).toHaveTextContent('/en/blog');

      fireEvent.click(screen.getByTestId('switch-to-id'));

      expect(screen.getByTestId('location')).toHaveTextContent('/id/blog');
    });

    it('should preserve nested route when switching from /en/blog/test-slug to /id/blog/test-slug', () => {
      render(<TestApp initialPath="/en/blog/test-slug" />);

      expect(screen.getByTestId('location')).toHaveTextContent('/en/blog/test-slug');

      fireEvent.click(screen.getByTestId('switch-to-id'));

      expect(screen.getByTestId('location')).toHaveTextContent('/id/blog/test-slug');
    });

    it('should preserve hash when switching language (AC2 scroll position)', () => {
      render(<TestApp initialPath="/en/#about" />);

      expect(screen.getByTestId('location')).toHaveTextContent('/en/#about');

      fireEvent.click(screen.getByTestId('switch-to-id'));

      expect(screen.getByTestId('location')).toHaveTextContent('/id/#about');
    });
  });

  describe('AC20: localStorage Persistence', () => {
    it('should save language to localStorage when URL is /en/', () => {
      render(<TestApp initialPath="/en/" />);

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'en');
    });

    it('should save language to localStorage when URL is /id/', () => {
      render(<TestApp initialPath="/id/" />);

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'id');
    });

    it('should update localStorage when language is switched', () => {
      render(<TestApp initialPath="/en/" />);

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'en');

      fireEvent.click(screen.getByTestId('switch-to-id'));

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'id');
    });
  });

  describe('document.documentElement.lang', () => {
    it('should set document lang to "en" when on English route', () => {
      render(<TestApp initialPath="/en/" />);

      expect(document.documentElement.lang).toBe('en');
    });

    it('should set document lang to "id" when on Indonesian route', () => {
      render(<TestApp initialPath="/id/" />);

      expect(document.documentElement.lang).toBe('id');
    });

    it('should update document lang when language is switched', () => {
      render(<TestApp initialPath="/en/" />);

      expect(document.documentElement.lang).toBe('en');

      fireEvent.click(screen.getByTestId('switch-to-id'));

      expect(document.documentElement.lang).toBe('id');
    });
  });

  describe('Edge Case 1: URL Mismatch with localStorage', () => {
    it('should use URL language over localStorage preference', () => {
      // localStorage says "id" but URL is /en/
      (localStorage.getItem as Mock).mockReturnValue('id');

      render(<TestApp initialPath="/en/" />);

      // URL takes precedence
      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      // localStorage should be updated to match URL
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'en');
    });

    it('should update localStorage when URL differs from saved preference', () => {
      // localStorage says "en" but URL is /id/
      (localStorage.getItem as Mock).mockReturnValue('en');

      render(<TestApp initialPath="/id/" />);

      // URL takes precedence
      expect(screen.getByTestId('current-language')).toHaveTextContent('id');
      // localStorage should be updated to match URL
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'id');
    });
  });

  describe('Edge Case 7: Deep Link with Locale', () => {
    it('should display Indonesian content when deep link is /id/blog/prisma-orm-performance', () => {
      render(<TestApp initialPath="/id/blog/prisma-orm-performance" />);

      expect(screen.getByTestId('current-language')).toHaveTextContent('id');
      expect(screen.getByTestId('translated-nav')).toHaveTextContent('Tentang');
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'id');
    });

    it('should display English content when deep link is /en/projects', () => {
      render(<TestApp initialPath="/en/projects" />);

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(screen.getByTestId('translated-nav')).toHaveTextContent('About');
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio_language', 'en');
    });
  });
});
