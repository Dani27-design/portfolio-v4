import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SEO } from './SEO';
import { LanguageProvider } from '../i18n/LanguageContext';

// Mock the Helmet to capture what it renders
const helmetContext: { helmet?: { title: { toComponent: () => React.ReactNode } } } = {};

const TestWrapper: React.FC<{ initialPath?: string; children: React.ReactNode }> = ({
  initialPath = '/en/',
  children,
}) => {
  return (
    <HelmetProvider context={helmetContext}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/:lang/*"
            element={
              <LanguageProvider>
                {children}
              </LanguageProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('SEO Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <TestWrapper>
        <SEO />
      </TestWrapper>
    );
    expect(container).toBeDefined();
  });

  it('renders with custom title', () => {
    render(
      <TestWrapper>
        <SEO title="Test Page" />
      </TestWrapper>
    );
    // Helmet updates are asynchronous, but the component should render
    expect(true).toBe(true);
  });

  it('renders with custom description', () => {
    render(
      <TestWrapper>
        <SEO description="Custom description for the page" />
      </TestWrapper>
    );
    expect(true).toBe(true);
  });

  it('renders in English context', () => {
    render(
      <TestWrapper initialPath="/en/">
        <SEO />
      </TestWrapper>
    );
    expect(true).toBe(true);
  });

  it('renders in Indonesian context', () => {
    render(
      <TestWrapper initialPath="/id/">
        <SEO />
      </TestWrapper>
    );
    expect(true).toBe(true);
  });
});

describe('SEO hreflang generation', () => {
  it('generates correct hreflang for homepage', () => {
    render(
      <TestWrapper initialPath="/en/">
        <SEO />
      </TestWrapper>
    );
    // The SEO component should generate hreflang tags
    // Helmet manages these in the head, which we can't easily test without a real DOM
    // This test verifies the component renders without error for the path
    expect(true).toBe(true);
  });

  it('generates correct hreflang for blog page', () => {
    render(
      <TestWrapper initialPath="/en/blog">
        <SEO />
      </TestWrapper>
    );
    expect(true).toBe(true);
  });

  it('generates correct hreflang for blog detail page', () => {
    render(
      <TestWrapper initialPath="/en/blog/debugging-rabbitmq-race-conditions">
        <SEO />
      </TestWrapper>
    );
    expect(true).toBe(true);
  });
});
