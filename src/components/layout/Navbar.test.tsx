import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Navbar } from './Navbar';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Navbar', () => {
  it('renders the nav element', () => {
    const { container } = render(<Navbar />, { wrapper: Wrapper });
    expect(container.querySelector('nav')).toBeTruthy();
  });

  it('renders brand logo', () => {
    const { container } = render(<Navbar />, { wrapper: Wrapper });
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('renders mobile menu button', () => {
    const { container } = render(<Navbar />, { wrapper: Wrapper });
    const menuBtn = container.querySelector('button[aria-label="Open menu"]');
    expect(menuBtn).toBeTruthy();
  });

  it('renders theme toggle button', () => {
    const { container } = render(<Navbar />, { wrapper: Wrapper });
    const themeBtn = container.querySelector('button[aria-label="Toggle theme"]');
    expect(themeBtn).toBeTruthy();
  });

  it('renders language toggle button', () => {
    const { container } = render(<Navbar />, { wrapper: Wrapper });
    const langBtn = container.querySelector('button[aria-label="Switch language"]');
    expect(langBtn).toBeTruthy();
  });
});
