import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { ProjectDetailsPage } from './ProjectDetailsPage';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element>) {
  return render(await component, { wrapper: Wrapper });
}

const mockProject = {
  id: '1',
  slug: 'test-project',
  name: { en: 'Test Project', id: 'Proyek Uji' },
  desc: { en: 'A test project description', id: 'Deskripsi proyek uji' },
  tech: ['React', 'Node.js', 'PostgreSQL'],
  status: 'PRODUCTION',
  order: 1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('ProjectDetailsPage', () => {
  it('renders the project title', async () => {
    const { container } = await renderAsync(ProjectDetailsPage({ project: mockProject, locale: 'en' }));
    expect(container.textContent).toContain('Test Project');
  });

  it('renders the description', async () => {
    const { container } = await renderAsync(ProjectDetailsPage({ project: mockProject, locale: 'en' }));
    expect(container.textContent).toContain('A test project description');
  });

  it('renders tech stack pills', async () => {
    const { container } = await renderAsync(ProjectDetailsPage({ project: mockProject, locale: 'en' }));
    expect(container.textContent).toContain('React');
    expect(container.textContent).toContain('Node.js');
    expect(container.textContent).toContain('PostgreSQL');
  });

  it('renders visit button when url is provided', async () => {
    const projectWithUrl = { ...mockProject, url: 'https://example.com' };
    const { container } = await renderAsync(ProjectDetailsPage({ project: projectWithUrl, locale: 'en' }));
    const link = container.querySelector('a[href="https://example.com"]');
    expect(link).toBeTruthy();
  });

  it('does not render visit button when no url', async () => {
    const { container } = await renderAsync(ProjectDetailsPage({ project: mockProject, locale: 'en' }));
    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    expect(externalLinks.length).toBe(0);
  });

  it('renders markdown content when provided', async () => {
    const projectWithContent = { ...mockProject, content: { en: '## Overview\n\nSome **bold** text.', id: '## Ringkasan' } };
    const { container } = await renderAsync(ProjectDetailsPage({ project: projectWithContent, locale: 'en' }));
    expect(container.querySelector('strong')).toBeTruthy();
  });

  it('renders back link', async () => {
    const { container } = await renderAsync(ProjectDetailsPage({ project: mockProject, locale: 'en' }));
    expect(container.querySelector('a[href*="projects"]')).toBeTruthy();
  });
});
