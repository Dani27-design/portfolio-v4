import type { MetadataRoute } from 'next';
import { getAllBlogSlugsWithUpdatedAt } from '@/lib/firestore';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getAllBlogSlugsWithUpdatedAt();
  const baseUrl = 'https://dani-chusyaidin.vercel.app';
  const entries: MetadataRoute.Sitemap = [];

  // Use most recent blog updatedAt as proxy for site-wide lastModified
  const latestUpdate = blogs.length > 0
    ? new Date(blogs.reduce((latest, b) => b.updatedAt > latest ? b.updatedAt : latest, blogs[0].updatedAt))
    : new Date('2025-05-17');

  // Static pages
  const staticPages = ['', '/blog', '/projects'];
  for (const page of staticPages) {
    for (const locale of routing.locales) {
      const languages: Record<string, string> = {};
      for (const alt of routing.locales) {
        languages[alt] = `${baseUrl}/${alt}${page}`;
      }
      languages['x-default'] = `${baseUrl}/en${page}`;

      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: latestUpdate,
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: { languages },
      });
    }
  }

  // Blog detail pages
  for (const blog of blogs) {
    for (const locale of routing.locales) {
      const languages: Record<string, string> = {};
      for (const alt of routing.locales) {
        languages[alt] = `${baseUrl}/${alt}/blog/${blog.slug}`;
      }
      languages['x-default'] = `${baseUrl}/en/blog/${blog.slug}`;

      entries.push({
        url: `${baseUrl}/${locale}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
