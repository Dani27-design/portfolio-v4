import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Contact } from './Contact';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Contact', () => {
  it('renders the contact section', () => {
    const { container } = render(<Contact />, { wrapper: Wrapper });
    expect(container.querySelector('#contact')).toBeTruthy();
  });

  it('renders all form input fields', () => {
    render(<Contact />, { wrapper: Wrapper });
    const emailInput = document.querySelector('#contact-email');
    const titleInput = document.querySelector('#contact-title');
    const messageInput = document.querySelector('#contact-message');
    expect(emailInput).toBeTruthy();
    expect(titleInput).toBeTruthy();
    expect(messageInput).toBeTruthy();
  });

  it('renders sender email input with correct attributes', () => {
    render(<Contact />, { wrapper: Wrapper });
    const emailInput = document.querySelector('#contact-email') as HTMLInputElement;
    expect(emailInput).toBeTruthy();
    expect(emailInput.type).toBe('email');
    expect(emailInput.required).toBe(true);
    expect(emailInput.getAttribute('aria-required')).toBe('true');
  });

  it('renders message textarea with required attributes', () => {
    render(<Contact />, { wrapper: Wrapper });
    const messageInput = document.querySelector('#contact-message') as HTMLTextAreaElement;
    expect(messageInput).toBeTruthy();
    expect(messageInput.required).toBe(true);
    expect(messageInput.getAttribute('aria-required')).toBe('true');
  });

  it('renders aria-live region for form status', () => {
    const { container } = render(<Contact />, { wrapper: Wrapper });
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
  });

  it('renders social links (excludes WhatsApp when URL is #)', () => {
    const { container } = render(<Contact />, { wrapper: Wrapper });
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(3);
  });

  it('renders WhatsApp link when valid URL is provided', () => {
    const { container } = render(
      <Contact
        contactContent={{
          id: '1',
          headline: { en: 'H', id: 'H' },
          desc: { en: 'D', id: 'D' },
          email: 'a@b.com',
          labels: { title: { en: 'T', id: 'T' }, payload: { en: 'P', id: 'P' } },
          placeholders: { title: { en: 'T', id: 'T' }, payload: { en: 'P', id: 'P' } },
          buttons: { transmit: { en: 'S', id: 'S' }, copyUid: { en: 'C', id: 'C' } },
          socials: { github: '#', linkedin: '#', instagram: '#', whatsapp: 'https://wa.me/123' },
          updatedAt: '',
        }}
        locale="en"
      />,
      { wrapper: Wrapper }
    );
    expect(container.querySelector('a[href="https://wa.me/123"]')).toBeTruthy();
  });

  it('renders with custom content', () => {
    const { container } = render(
      <Contact
        contactContent={{
          id: '1',
          headline: { en: 'Custom Headline', id: 'Judul' },
          desc: { en: 'Custom desc', id: 'Desk' },
          email: 'custom@test.com',
          labels: { title: { en: 'Title', id: 'Judul' }, payload: { en: 'Message', id: 'Pesan' } },
          placeholders: { title: { en: 'Ph1', id: 'Ph1' }, payload: { en: 'Ph2', id: 'Ph2' } },
          buttons: { transmit: { en: 'Send', id: 'Kirim' }, copyUid: { en: 'Copy', id: 'Salin' } },
          socials: {
            github: 'https://github.com/test',
            linkedin: 'https://linkedin.com/test',
            instagram: 'https://instagram.com/test',
            whatsapp: 'https://wa.me/123',
          },
          updatedAt: '2024-01-01',
        }}
        locale="en"
      />,
      { wrapper: Wrapper }
    );
    expect(container.textContent).toContain('Custom Headline');
    expect(container.textContent).toContain('custom@test.com');
  });
});
