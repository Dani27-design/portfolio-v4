import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { ProjectListPage } from './ProjectListPage';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element>) {
  return render(await component, { wrapper: Wrapper });
}

const mockProjects = [
  { id: '1', slug: 'proj-1', name: { en: 'Project One', id: 'Proyek Satu' }, desc: { en: 'Desc 1', id: 'Desk 1' }, tech: ['React'], version: 'v1', status: 'PRODUCTION', order: 1, createdAt: '', updatedAt: '' },
  { id: '2', slug: 'proj-2', name: { en: 'Project Two', id: 'Proyek Dua' }, desc: { en: 'Desc 2', id: 'Desk 2' }, tech: ['Node'], version: 'v2', status: 'DEPLOYED', order: 2, createdAt: '', updatedAt: '' },
];

describe('ProjectListPage', () => {
  it('renders all project cards', async () => {
    const { container } = await renderAsync(ProjectListPage({ projects: mockProjects, locale: 'en' }));
    expect(container.textContent).toContain('Project One');
    expect(container.textContent).toContain('Project Two');
  });

  it('renders project links with slugs', async () => {
    const { container } = await renderAsync(ProjectListPage({ projects: mockProjects, locale: 'en' }));
    expect(container.querySelector('a[href*="proj-1"]')).toBeTruthy();
  });

  it('shows descriptions', async () => {
    const { container } = await renderAsync(ProjectListPage({ projects: mockProjects, locale: 'en' }));
    expect(container.textContent).toContain('Desc 1');
  });
});
