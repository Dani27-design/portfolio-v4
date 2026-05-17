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
    languages[loc] = `https://dani-chusyaidin.vercel.app/${loc}`;
  }
  languages['x-default'] = 'https://dani-chusyaidin.vercel.app/en';

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: `https://dani-chusyaidin.vercel.app/${locale}`,
      languages,
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: `https://dani-chusyaidin.vercel.app/${locale}`,
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

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Daniansyah Chusyaidin',
    url: 'https://dani-chusyaidin.vercel.app',
    jobTitle: 'Systems Architect & Fullstack Engineer',
    sameAs: [
      'https://github.com/Dani27-design',
      'https://www.linkedin.com/in/daniansyahchusyaidin/',
      'https://www.instagram.com/danichusyaidin',
    ],
  };

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Daniansyah Chusyaidin Portfolio',
    url: 'https://dani-chusyaidin.vercel.app',
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomePage
        projects={projects}
        blogs={blogs}
        experience={experience}
        skills={skills}
        locale={locale}
      />
    </>
  );
}
