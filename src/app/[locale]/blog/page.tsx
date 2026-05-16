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
    languages[loc] = `https://daniansyah.dev/${loc}/blog`;
  }
  languages['x-default'] = 'https://daniansyah.dev/en/blog';

  return {
    title: t('blogTitle'),
    description: t('blogDescription'),
    alternates: {
      canonical: `https://daniansyah.dev/${locale}/blog`,
      languages,
    },
    openGraph: {
      title: t('blogTitle'),
      description: t('blogDescription'),
      url: `https://daniansyah.dev/${locale}/blog`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const blogs = await getBlogs();

  return <BlogListPage blogs={blogs} locale={locale} />;
}
