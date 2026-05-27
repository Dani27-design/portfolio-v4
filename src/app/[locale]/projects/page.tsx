import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProjects, getHireBannerContent } from '@/lib/firestore';
import { ProjectListPage } from '@/components/pages/ProjectListPage';
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
    languages[loc] = `https://dani-chusyaidin.vercel.app/${loc}/projects`;
  }
  languages['x-default'] = 'https://dani-chusyaidin.vercel.app/en/projects';

  return {
    title: t('projectsTitle'),
    description: t('projectsDescription'),
    alternates: {
      canonical: `https://dani-chusyaidin.vercel.app/${locale}/projects`,
      languages,
    },
    openGraph: {
      title: t('projectsTitle'),
      description: t('projectsDescription'),
      url: `https://dani-chusyaidin.vercel.app/${locale}/projects`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [projects, hireBannerContent] = await Promise.all([
    getProjects(),
    getHireBannerContent(),
  ]);

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
        name: 'Projects',
        item: `https://dani-chusyaidin.vercel.app/${locale}/projects`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectListPage projects={projects} locale={locale} hireBannerContent={hireBannerContent} />
    </>
  );
}
