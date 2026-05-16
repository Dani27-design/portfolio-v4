import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProjects, getBlogs, getExperience, getSkills } from '@/lib/firestore';
import { HomePage } from '@/components/sections/HomePage';
import { routing } from '@/i18n/routing';

export const revalidate = 3600; // ISR: revalidate every 1 hour

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `https://daniansyah.dev/${loc}`;
  }
  languages['x-default'] = 'https://daniansyah.dev/en';

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: `https://daniansyah.dev/${locale}`,
      languages,
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: `https://daniansyah.dev/${locale}`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [projects, blogs, experience, skills] = await Promise.all([
    getProjects(),
    getBlogs(),
    getExperience(),
    getSkills(),
  ]);

  return (
    <HomePage
      projects={projects}
      blogs={blogs}
      experience={experience}
      skills={skills}
      locale={locale}
    />
  );
}
