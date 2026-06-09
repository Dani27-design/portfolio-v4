import { getServerSideSitemap } from 'next-sitemap';
import { getAllBlogSlugsWithUpdatedAt, getAllProjectSlugs } from '@/lib/firestore';

export async function GET() {
  const baseUrl = 'https://dani-chusyaidin.vercel.app';
  const locales = ['en', 'id'];

  let blogs: { slug: string; updatedAt: string }[] = [];
  let projectSlugs: string[] = [];

  try {
    [blogs, projectSlugs] = await Promise.all([
      getAllBlogSlugsWithUpdatedAt(),
      getAllProjectSlugs(),
    ]);
  } catch (error) {
    console.error('Error fetching data for server sitemap:', error);
  }

  const fields = [];

  // Project detail pages — bilingual
  for (const slug of projectSlugs) {
    for (const locale of locales) {
      fields.push({
        loc: `${baseUrl}/${locale}/projects/${slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly' as const,
        priority: 0.6,
        alternateRefs: locales.map((alt) => ({
          href: `${baseUrl}/${alt}/projects/${slug}`,
          hreflang: alt,
        })),
      });
    }
  }

  // Blog detail pages — Indonesian only
  for (const blog of blogs) {
    fields.push({
      loc: `${baseUrl}/id/blog/${blog.slug}`,
      lastmod: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
      changefreq: 'monthly' as const,
      priority: 0.6,
    });
  }

  const sitemap = await getServerSideSitemap(fields);
  sitemap.headers.set('Cache-Control', 'no-store, max-age=0');
  return sitemap;
}

export const dynamic = 'force-dynamic';
