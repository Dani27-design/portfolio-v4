import { setRequestLocale } from 'next-intl/server';
import { getProjectBySlug, getHireBannerContent } from '@/lib/firestore';
import { ProjectDetailsPage } from '@/components/pages/ProjectDetailsPage';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const loc = locale as Locale;

  const languages: Record<string, string> = {};
  for (const alt of routing.locales) {
    languages[alt] = `https://dani-chusyaidin.vercel.app/${alt}/projects/${slug}`;
  }
  languages['x-default'] = `https://dani-chusyaidin.vercel.app/en/projects/${slug}`;

  return {
    title: project.name[loc],
    description: project.desc[loc],
    alternates: {
      canonical: `https://dani-chusyaidin.vercel.app/${locale}/projects/${slug}`,
      languages,
    },
    openGraph: {
      title: project.name[loc],
      description: project.desc[loc],
      url: `https://dani-chusyaidin.vercel.app/${locale}/projects/${slug}`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      ...(() => {
        const ogImage = project.media?.find(m => m.type === 'image')?.url || project.image;
        return ogImage ? { images: [{ url: ogImage }] } : {};
      })(),
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [project, hireBannerContent] = await Promise.all([
    getProjectBySlug(slug),
    getHireBannerContent(),
  ]);
  if (!project) notFound();

  const loc = locale as Locale;

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
      {
        '@type': 'ListItem',
        position: 3,
        name: project.name[loc],
        item: `https://dani-chusyaidin.vercel.app/${locale}/projects/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectDetailsPage project={project} locale={locale} hireBannerContent={hireBannerContent} />
    </>
  );
}
