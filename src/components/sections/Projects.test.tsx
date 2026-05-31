import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Projects } from './Projects';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element | null>) {
  const jsx = await component;
  if (!jsx) return render(<div />, { wrapper: Wrapper });
  return render(jsx, { wrapper: Wrapper });
}

const mockProjects = [
  {
    id: '1',
    slug: 'test-project',
    name: { en: 'Test Project', id: 'Proyek Uji' },
    desc: { en: 'A test project', id: 'Proyek pengujian' },
    tech: ['TypeScript'],
    version: 'v1.0.0',
    status: 'PRODUCTION',
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('Projects', () => {
  it('renders projects section with data', async () => {
    const { container } = await renderAsync(Projects({ projects: mockProjects, locale: 'en' }));
    expect(container.querySelector('#projects')).toBeTruthy();
    expect(container.textContent).toContain('Test Project');
  });

  it('returns null for empty data', async () => {
    const result = await Projects({ projects: [], locale: 'en' });
    expect(result).toBeNull();
  });

  it('renders project links', async () => {
    const { container } = await renderAsync(Projects({ projects: mockProjects, locale: 'en' }));
    const link = container.querySelector('a[href*="test-project"]');
    expect(link).toBeTruthy();
  });
});
