import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Blog } from './Blog';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element | null>) {
  const jsx = await component;
  if (!jsx) return render(<div />, { wrapper: Wrapper });
  return render(jsx, { wrapper: Wrapper });
}

const mockBlogs = [
  {
    id: '1',
    slug: 'test-blog',
    title: { en: 'Test Blog', id: 'Blog Uji' },
    excerpt: { en: 'A test excerpt', id: 'Kutipan' },
    content: '# Hello',
    date: '2024-01-01',
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('Blog', () => {
  it('renders blog section with data', async () => {
    const { container } = await renderAsync(Blog({ blogs: mockBlogs, locale: 'en' }));
    expect(container.querySelector('#blog')).toBeTruthy();
    expect(container.textContent).toContain('Test Blog');
  });

  it('returns null for empty data', async () => {
    const result = await Blog({ blogs: [], locale: 'en' });
    expect(result).toBeNull();
  });

  it('renders blog links', async () => {
    const { container } = await renderAsync(Blog({ blogs: mockBlogs, locale: 'en' }));
    const link = container.querySelector('a[href*="test-blog"]');
    expect(link).toBeTruthy();
  });

  it('shows date on cards', async () => {
    const { container } = await renderAsync(Blog({ blogs: mockBlogs, locale: 'en' }));
    expect(container.textContent).toContain('2024-01-01');
  });
});
