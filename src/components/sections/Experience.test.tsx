import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Experience } from './Experience';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element | null>) {
  const jsx = await component;
  if (!jsx) return render(<div />, { wrapper: Wrapper });
  return render(jsx, { wrapper: Wrapper });
}

const mockExperience = [
  {
    id: '1',
    title: { en: 'Engineer', id: 'Insinyur' },
    company: 'TestCo',
    period: { en: 'Jan 2022 — Present', id: 'Jan 2022 — Sekarang' },
    points: { en: ['Built systems'], id: ['Membangun sistem'] },
    isCurrent: true,
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('Experience', () => {
  it('renders the work section with data', async () => {
    const { container } = await renderAsync(Experience({ experience: mockExperience, locale: 'en' }));
    expect(container.querySelector('#work')).toBeTruthy();
    expect(container.textContent).toContain('Engineer');
    expect(container.textContent).toContain('TestCo');
  });

  it('returns null for empty data', async () => {
    const result = await Experience({ experience: [], locale: 'en' });
    expect(result).toBeNull();
  });

  it('renders in Indonesian locale', async () => {
    const { container } = await renderAsync(Experience({ experience: mockExperience, locale: 'id' }));
    expect(container.textContent).toContain('Insinyur');
  });
});
