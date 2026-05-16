import type { MetadataRoute } from 'next';
import { getAllBlogSlugs } from '@/lib/firestore';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await getAllBlogSlugs();
  const baseUrl = 'https://daniansyah.dev';
  const entries: MetadataRoute.Sitemap = [];

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
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: { languages },
      });
    }
  }

  // Blog detail pages
  for (const slug of blogSlugs) {
    for (const locale of routing.locales) {
      const languages: Record<string, string> = {};
      for (const alt of routing.locales) {
        languages[alt] = `${baseUrl}/${alt}/blog/${slug}`;
      }
      languages['x-default'] = `${baseUrl}/en/blog/${slug}`;

      entries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
