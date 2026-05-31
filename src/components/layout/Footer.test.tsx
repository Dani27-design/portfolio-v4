import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Footer } from './Footer';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Footer', () => {
  it('renders the footer element', () => {
    const { container } = render(<Footer />, { wrapper: Wrapper });
    expect(container.querySelector('footer')).toBeTruthy();
  });

  it('shows copyright with current year', () => {
    const { container } = render(<Footer />, { wrapper: Wrapper });
    expect(container.textContent).toContain(new Date().getFullYear().toString());
  });

  it('shows owner name', () => {
    const { container } = render(<Footer />, { wrapper: Wrapper });
    expect(container.textContent).toContain('Daniansyah Chusyaidin');
  });

  it('renders social links with aria-labels', () => {
    const { container } = render(<Footer />, { wrapper: Wrapper });
    const socialLinks = container.querySelectorAll('a[aria-label]');
    expect(socialLinks.length).toBe(4);
  });

  it('uses Firestore content when provided', () => {
    const { container } = render(
      <Footer
        footerContent={{ id: '1', ownerName: 'Custom Name', role: { en: 'Dev', id: 'Dev' }, updatedAt: '' }}
        locale="en"
      />,
      { wrapper: Wrapper }
    );
    expect(container.textContent).toContain('Custom Name');
  });

  it('uses contact socials when provided', () => {
    const { container } = render(
      <Footer
        contactContent={{
          id: '1',
          headline: { en: '', id: '' },
          desc: { en: '', id: '' },
          email: '',
          labels: { title: { en: '', id: '' }, payload: { en: '', id: '' } },
          placeholders: { title: { en: '', id: '' }, payload: { en: '', id: '' } },
          buttons: { transmit: { en: '', id: '' }, copyUid: { en: '', id: '' } },
          socials: { github: 'https://github.com/custom', linkedin: '', instagram: '', whatsapp: '' },
          updatedAt: '',
        }}
      />,
      { wrapper: Wrapper }
    );
    expect(container.querySelector('a[href="https://github.com/custom"]')).toBeTruthy();
  });
});
