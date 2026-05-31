import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { BlogDetailsPage } from './BlogDetailsPage';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element>) {
  return render(await component, { wrapper: Wrapper });
}

const mockBlog = {
  id: '1',
  slug: 'test-blog',
  title: { en: 'Test Article', id: 'Artikel Uji' },
  excerpt: { en: 'Excerpt', id: 'Kutipan' },
  content: '# Hello World\n\nThis is **bold** text.',
  date: '2024-03-15',
  order: 1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('BlogDetailsPage', () => {
  it('renders the blog title', async () => {
    const { container } = await renderAsync(BlogDetailsPage({ blog: mockBlog, locale: 'en' }));
    expect(container.textContent).toContain('Test Article');
  });

  it('renders the blog date', async () => {
    const { container } = await renderAsync(BlogDetailsPage({ blog: mockBlog, locale: 'en' }));
    expect(container.textContent).toContain('2024-03-15');
  });

  it('renders markdown content', async () => {
    const { container } = await renderAsync(BlogDetailsPage({ blog: mockBlog, locale: 'en' }));
    expect(container.querySelector('strong')).toBeTruthy();
    expect(container.textContent).toContain('bold');
  });

  it('renders back link', async () => {
    const { container } = await renderAsync(BlogDetailsPage({ blog: mockBlog, locale: 'en' }));
    expect(container.querySelector('a[href*="blog"]')).toBeTruthy();
  });

  it('calculates read time', async () => {
    const { container } = await renderAsync(BlogDetailsPage({ blog: mockBlog, locale: 'en' }));
    // readTime translation key should be present
    expect(container.textContent).toContain('readTime');
  });
});
