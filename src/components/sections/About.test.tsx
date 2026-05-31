import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { About } from './About';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element>) {
  const jsx = await component;
  return render(jsx, { wrapper: Wrapper });
}

describe('About', () => {
  it('renders the about section', async () => {
    const { container } = await renderAsync(About({}));
    expect(container.querySelector('#about')).toBeTruthy();
  });

  it('renders with Firestore content', async () => {
    const { container } = await renderAsync(
      About({
        aboutContent: {
          id: '1',
          title: { en: 'About Me', id: 'Tentang' },
          headline: { en: 'Headline', id: 'Judul' },
          desc: { en: 'Desc', id: 'Desk' },
          stats: {
            stat1: { value: 'E2E', label: { en: 'Label1', id: 'L1' } },
            stat2: { value: '0%', label: { en: 'Label2', id: 'L2' } },
            stat3: { value: 'TDD', label: { en: 'Label3', id: 'L3' } },
          },
          avatarInitials: 'DC',
          updatedAt: '2024-01-01',
        },
        locale: 'en',
      })
    );
    expect(container.querySelector('#about')).toBeTruthy();
    expect(container.textContent).toContain('Headline');
  });

  it('uses fallback avatar when no avatarUrl', async () => {
    const { container } = await renderAsync(About({ locale: 'en' }));
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('alt')).toContain('logo');
  });
});
