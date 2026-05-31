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

  it('renders email input fields', () => {
    render(<Contact />, { wrapper: Wrapper });
    const titleInput = document.querySelector('#contact-title');
    const messageInput = document.querySelector('#contact-message');
    expect(titleInput).toBeTruthy();
    expect(messageInput).toBeTruthy();
  });

  it('renders social links', () => {
    const { container } = render(<Contact />, { wrapper: Wrapper });
    const socialLinks = container.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
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
