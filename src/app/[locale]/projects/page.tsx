import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProjects } from '@/lib/firestore';
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
    languages[loc] = `https://daniansyah.dev/${loc}/projects`;
  }
  languages['x-default'] = 'https://daniansyah.dev/en/projects';

  return {
    title: t('projectsTitle'),
    description: t('projectsDescription'),
    alternates: {
      canonical: `https://daniansyah.dev/${locale}/projects`,
      languages,
    },
    openGraph: {
      title: t('projectsTitle'),
      description: t('projectsDescription'),
      url: `https://daniansyah.dev/${locale}/projects`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects();

  return <ProjectListPage projects={projects} locale={locale} />;
}
