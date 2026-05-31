import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProjects, getBlogs, getExperience, getSkills, getHeroContent, getAboutContent, getContactContent } from '@/lib/firestore';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Blog } from '@/components/sections/Blog';
import { Contact } from '@/components/sections/Contact';
import { SkipGameLink } from '@/components/ui/SkipGameLink';
import dynamic from 'next/dynamic';
import { routing } from '@/i18n/routing';

const SkyForceGame = dynamic(() => import('@/components/game/SkyForceGame').then(mod => ({ default: mod.SkyForceGame })), {
  ssr: false,
  loading: () => <div className="min-h-[85vh] md:min-h-[540px] bg-background" />,
});

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

  const [projects, blogs, experience, skills, heroContent, aboutContent, contactContent] = await Promise.all([
    getProjects(),
    getBlogs(),
    getExperience(),
    getSkills(),
    getHeroContent(),
    getAboutContent(),
    getContactContent(),
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
      <Hero heroContent={heroContent} locale={locale} />
      <About aboutContent={aboutContent} locale={locale} />
      <Skills skills={skills} locale={locale} />
      <SkipGameLink />
      <SkyForceGame />
      <Experience experience={experience} locale={locale} />
      <Projects projects={projects} locale={locale} />
      <Blog blogs={blogs} locale={locale} />
      <Contact contactContent={contactContent} locale={locale} />
    </>
  );
}
