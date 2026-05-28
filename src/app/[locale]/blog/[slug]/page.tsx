import { setRequestLocale } from 'next-intl/server';
import { getBlogBySlug, getAllBlogSlugs, getHireBannerContent } from '@/lib/firestore';
import { BlogDetailsPage } from '@/components/pages/BlogDetailsPage';
import { notFound } from 'next/navigation';
import type { Locale } from '@/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};

  const loc = locale as Locale;

  // Blog content is always Indonesian — canonical points to /id/ path,
  // no hreflang alternates (content is not bilingual)
  return {
    title: blog.title[loc],
    description: blog.excerpt[loc],
    alternates: {
      canonical: `https://dani-chusyaidin.vercel.app/id/blog/${slug}`,
    },
    openGraph: {
      title: blog.title[loc],
      description: blog.excerpt[loc],
      url: `https://dani-chusyaidin.vercel.app/id/blog/${slug}`,
      locale: 'id_ID',
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [blog, hireBannerContent] = await Promise.all([
    getBlogBySlug(slug),
    getHireBannerContent(),
  ]);
  if (!blog) notFound();

  const loc = locale as Locale;

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title[loc],
    description: blog.excerpt[loc],
    datePublished: blog.date,
    dateModified: blog.updatedAt || blog.date,
    author: {
      '@type': 'Person',
      name: 'Daniansyah Chusyaidin',
      url: 'https://dani-chusyaidin.vercel.app',
    },
    url: `https://dani-chusyaidin.vercel.app/${locale}/blog/${slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://dani-chusyaidin.vercel.app/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `https://dani-chusyaidin.vercel.app/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title[loc],
        item: `https://dani-chusyaidin.vercel.app/${locale}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogDetailsPage blog={blog} locale={locale} hireBannerContent={hireBannerContent} />
    </>
  );
}
