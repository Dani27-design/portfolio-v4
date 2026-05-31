import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { HireMeBanner } from './HireMeBanner';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('HireMeBanner', () => {
  it('renders headline text', () => {
    const { container } = render(<HireMeBanner />, { wrapper: Wrapper });
    // Falls back to translation key
    expect(container.textContent).toContain('headline');
  });

  it('renders CTA link', () => {
    const { container } = render(<HireMeBanner />, { wrapper: Wrapper });
    const ctaLink = container.querySelector('a[href*="contact"]');
    expect(ctaLink).toBeTruthy();
  });

  it('renders with Firestore content', () => {
    const { container } = render(
      <HireMeBanner
        hireBannerContent={{
          id: '1',
          headline: { en: 'Custom Headline', id: 'Judul' },
          desc: { en: 'Custom desc', id: 'Desk' },
          cta: { en: 'Hire Me', id: 'Rekrut Saya' },
          updatedAt: '',
        }}
        locale="en"
      />,
      { wrapper: Wrapper }
    );
    expect(container.textContent).toContain('Custom Headline');
    expect(container.textContent).toContain('Custom desc');
  });
});
