import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Hero } from './Hero';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Hero', () => {
  it('renders the hero section', () => {
    const { container } = render(<Hero />, { wrapper: Wrapper });
    expect(container.querySelector('#hero')).toBeTruthy();
  });

  it('renders CTA buttons', () => {
    const { container } = render(<Hero />, { wrapper: Wrapper });
    const links = container.querySelectorAll('a[href]');
    const hrefs = Array.from(links).map(l => l.getAttribute('href'));
    expect(hrefs).toContain('#mini-game');
    expect(hrefs).toContain('#contact');
  });

  it('renders with custom content', () => {
    const { container } = render(
      <Hero
        heroContent={{
          id: '1',
          tagline: { en: 'Custom Tag', id: 'Tag Kustom' },
          headline: { en: 'Custom Headline', id: 'Judul Kustom' },
          desc: { en: 'Custom desc', id: 'Desk kustom' },
          ctaGame: { en: 'Play', id: 'Main' },
          ctaContact: { en: 'Contact', id: 'Kontak' },
          phrases: { en: ['Phrase 1'], id: ['Frasa 1'] },
          updatedAt: '2024-01-01',
        }}
        locale="en"
      />,
      { wrapper: Wrapper }
    );
    expect(container.textContent).toContain('Custom Headline');
  });
});
