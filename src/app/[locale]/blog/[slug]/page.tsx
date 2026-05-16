import { setRequestLocale } from 'next-intl/server';
import { getBlogBySlug, getAllBlogSlugs } from '@/lib/firestore';
import { BlogDetailsPage } from '@/components/pages/BlogDetailsPage';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
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
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `https://daniansyah.dev/${l}/blog/${slug}`;
  }
  languages['x-default'] = `https://daniansyah.dev/en/blog/${slug}`;

  return {
    title: blog.title[loc],
    description: blog.excerpt[loc],
    alternates: {
      canonical: `https://daniansyah.dev/${locale}/blog/${slug}`,
      languages,
    },
    openGraph: {
      title: blog.title[loc],
      description: blog.excerpt[loc],
      url: `https://daniansyah.dev/${locale}/blog/${slug}`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  return <BlogDetailsPage blog={blog} locale={locale} />;
}
