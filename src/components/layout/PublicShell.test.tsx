import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { PublicShell } from './PublicShell';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('PublicShell', () => {
  it('renders children inside main element', () => {
    const { container } = render(
      <PublicShell><div data-testid="child">Hello</div></PublicShell>,
      { wrapper: Wrapper }
    );
    const main = container.querySelector('#main-content');
    expect(main).toBeTruthy();
    expect(main?.textContent).toContain('Hello');
  });

  it('renders skip-to-content link', () => {
    const { container } = render(
      <PublicShell><div>Content</div></PublicShell>,
      { wrapper: Wrapper }
    );
    const skipLink = container.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeTruthy();
  });

  it('renders Navbar and Footer', () => {
    const { container } = render(
      <PublicShell><div>Content</div></PublicShell>,
      { wrapper: Wrapper }
    );
    expect(container.querySelector('nav')).toBeTruthy();
    expect(container.querySelector('footer')).toBeTruthy();
  });

  it('renders the top anchor', () => {
    const { container } = render(
      <PublicShell><div>Content</div></PublicShell>,
      { wrapper: Wrapper }
    );
    expect(container.querySelector('#top')).toBeTruthy();
  });
});
