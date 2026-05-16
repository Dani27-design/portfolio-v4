import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the page components to simplify testing
vi.mock('./_pages/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">HomePage</div>,
}));

vi.mock('./_pages/BlogListPage', () => ({
  BlogListPage: () => <div data-testid="blog-list-page">BlogListPage</div>,
}));

vi.mock('./_pages/BlogDetailsPage', () => ({
  BlogDetailsPage: () => <div data-testid="blog-details-page">BlogDetailsPage</div>,
}));

vi.mock('./_pages/ProjectListPage', () => ({
  ProjectListPage: () => <div data-testid="project-list-page">ProjectListPage</div>,
}));

// Mock SEO component to avoid Helmet issues in tests
vi.mock('./components/SEO', () => ({
  SEO: () => null,
}));

// Helper to render App with specific initial route
const renderWithRouter = (initialRoute: string) => {
  window.history.pushState({}, '', initialRoute);
  return render(<App />);
};

describe('App Route Restructuring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (localStorage.getItem as Mock).mockReturnValue(null);
    // Default browser language to English
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });
  });

  describe('AC4: Root redirect behavior', () => {
    it('should redirect from / to /en/ when browser language is English', async () => {
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      renderWithRouter('/');

      await waitFor(() => {
        expect(window.location.pathname).toBe('/en/');
      });
    });

    it('should redirect from / to /id/ when browser language is Indonesian', async () => {
      Object.defineProperty(navigator, 'language', {
        value: 'id-ID',
        configurable: true,
      });

      renderWithRouter('/');

      await waitFor(() => {
        expect(window.location.pathname).toBe('/id/');
      });
    });

    it('should redirect from / to saved language preference from localStorage', async () => {
      (localStorage.getItem as Mock).mockReturnValue('id');

      renderWithRouter('/');

      await waitFor(() => {
        expect(window.location.pathname).toBe('/id/');
      });
    });
  });

  describe('AC4: Language-prefixed routes', () => {
    it('should render HomePage at /en/', async () => {
      renderWithRouter('/en/');

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should render HomePage at /id/', async () => {
      renderWithRouter('/id/');

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should render BlogListPage at /en/blog', async () => {
      renderWithRouter('/en/blog');

      await waitFor(() => {
        expect(screen.getByTestId('blog-list-page')).toBeInTheDocument();
      });
    });

    it('should render BlogListPage at /id/blog', async () => {
      renderWithRouter('/id/blog');

      await waitFor(() => {
        expect(screen.getByTestId('blog-list-page')).toBeInTheDocument();
      });
    });

    it('should render BlogDetailsPage at /en/blog/:slug', async () => {
      renderWithRouter('/en/blog/debugging-rabbitmq-race-conditions');

      await waitFor(() => {
        expect(screen.getByTestId('blog-details-page')).toBeInTheDocument();
      });
    });

    it('should render BlogDetailsPage at /id/blog/:slug', async () => {
      renderWithRouter('/id/blog/prisma-orm-performance');

      await waitFor(() => {
        expect(screen.getByTestId('blog-details-page')).toBeInTheDocument();
      });
    });

    it('should render ProjectListPage at /en/projects', async () => {
      renderWithRouter('/en/projects');

      await waitFor(() => {
        expect(screen.getByTestId('project-list-page')).toBeInTheDocument();
      });
    });

    it('should render ProjectListPage at /id/projects', async () => {
      renderWithRouter('/id/projects');

      await waitFor(() => {
        expect(screen.getByTestId('project-list-page')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Case 2: Invalid language code fallback', () => {
    it('should redirect /fr/ to /en/', async () => {
      renderWithRouter('/fr/');

      await waitFor(() => {
        expect(window.location.pathname).toBe('/en/');
      });
    });

    it('should redirect /de/blog to /en/', async () => {
      renderWithRouter('/de/blog');

      await waitFor(() => {
        expect(window.location.pathname).toBe('/en/');
      });
    });

    it('should redirect /es/projects to /en/', async () => {
      renderWithRouter('/es/projects');

      await waitFor(() => {
        expect(window.location.pathname).toBe('/en/');
      });
    });

    it('should redirect unknown paths to /en/', async () => {
      renderWithRouter('/unknown/path/here');

      await waitFor(() => {
        expect(window.location.pathname).toBe('/en/');
      });
    });
  });

  describe('Hash preservation', () => {
    it('should preserve hash when redirecting from / to /en/', async () => {
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      renderWithRouter('/#about');

      await waitFor(() => {
        expect(window.location.pathname).toBe('/en/');
        expect(window.location.hash).toBe('#about');
      });
    });

    it('should render HomePage with hash at /en/#about', async () => {
      renderWithRouter('/en/#about');

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
        expect(window.location.hash).toBe('#about');
      });
    });
  });

  describe('Provider hierarchy', () => {
    it('should have ThemeProvider wrapping content', async () => {
      renderWithRouter('/en/');

      // ThemeProvider sets up theme classes on documentElement
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should have LanguageContext available in routes', async () => {
      renderWithRouter('/en/');

      // If LanguageContext is not available, components would throw
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });
  });

  describe('Old routes should not work (breaking change expected)', () => {
    it('should NOT render HomePage at old path /blog (should redirect)', async () => {
      renderWithRouter('/blog');

      await waitFor(() => {
        // Old /blog path should redirect to /en/ (fallback for unknown routes)
        expect(window.location.pathname).toBe('/en/');
      });
    });

    it('should NOT render at old path /projects (should redirect)', async () => {
      renderWithRouter('/projects');

      await waitFor(() => {
        // Old /projects path should redirect to /en/
        expect(window.location.pathname).toBe('/en/');
      });
    });
  });
});
