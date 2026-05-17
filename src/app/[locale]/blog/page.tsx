import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBlogs } from '@/lib/firestore';
import { BlogListPage } from '@/components/pages/BlogListPage';
import { routing } from '@/i18n/routing';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `https://dani-chusyaidin.vercel.app/${loc}/blog`;
  }
  languages['x-default'] = 'https://dani-chusyaidin.vercel.app/en/blog';

  return {
    title: t('blogTitle'),
    description: t('blogDescription'),
    alternates: {
      canonical: `https://dani-chusyaidin.vercel.app/${locale}/blog`,
      languages,
    },
    openGraph: {
      title: t('blogTitle'),
      description: t('blogDescription'),
      url: `https://dani-chusyaidin.vercel.app/${locale}/blog`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const blogs = await getBlogs();

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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogListPage blogs={blogs} locale={locale} />
    </>
  );
}
