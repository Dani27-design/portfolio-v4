import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { BlogListPage } from './BlogListPage';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element>) {
  return render(await component, { wrapper: Wrapper });
}

const mockBlogs = [
  { id: '1', slug: 'blog-1', title: { en: 'Blog One', id: 'Blog Satu' }, excerpt: { en: 'Excerpt', id: 'Kutipan' }, content: '', date: '2024-01-01', order: 1, createdAt: '', updatedAt: '' },
  { id: '2', slug: 'blog-2', title: { en: 'Blog Two', id: 'Blog Dua' }, excerpt: { en: 'Excerpt 2', id: 'Kutipan 2' }, content: '', date: '2024-02-01', order: 2, createdAt: '', updatedAt: '' },
];

describe('BlogListPage', () => {
  it('renders all blog cards', async () => {
    const { container } = await renderAsync(BlogListPage({ blogs: mockBlogs, locale: 'en' }));
    expect(container.textContent).toContain('Blog One');
    expect(container.textContent).toContain('Blog Two');
  });

  it('renders blog links with slugs', async () => {
    const { container } = await renderAsync(BlogListPage({ blogs: mockBlogs, locale: 'en' }));
    expect(container.querySelector('a[href*="blog-1"]')).toBeTruthy();
    expect(container.querySelector('a[href*="blog-2"]')).toBeTruthy();
  });

  it('renders back link', async () => {
    const { container } = await renderAsync(BlogListPage({ blogs: mockBlogs, locale: 'en' }));
    expect(container.querySelector('a[href="/"]')).toBeTruthy();
  });

  it('renders HireMeBanner', async () => {
    const { container } = await renderAsync(BlogListPage({ blogs: mockBlogs, locale: 'en', hireBannerContent: null }));
    // HireMeBanner renders even without content (uses translation fallbacks)
    expect(container.textContent).toContain('headline');
  });
});
