import { describe, it, expect, vi } from 'vitest';

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: async ({ locale, namespace }: { locale: string; namespace: string }) => {
    const messages: Record<string, Record<string, string>> = {
      seo: {
        homeTitle: locale === 'en' ? 'Daniansyah - Systems Architect' : 'Daniansyah - Arsitek Sistem',
        homeDescription: locale === 'en' ? 'Systems Architect specializing in distributed systems' : 'Arsitek Sistem yang berspesialisasi',
        blogTitle: locale === 'en' ? 'Technical Logs' : 'Log Teknis',
        blogDescription: locale === 'en' ? 'Technical documentation' : 'Dokumentasi teknis',
        projectsTitle: locale === 'en' ? 'System Architecture Archives' : 'Arsip Arsitektur Sistem',
        projectsDescription: locale === 'en' ? 'Comprehensive technical case studies' : 'Studi kasus teknis',
      },
    };
    return (key: string) => messages[namespace]?.[key] || key;
  },
  setRequestLocale: () => {},
}));

// Mock @/i18n/routing
vi.mock('@/i18n/routing', () => ({
  routing: { locales: ['en', 'id'], defaultLocale: 'en' },
}));

// Mock firestore
vi.mock('@/lib/firestore', () => ({
  getProjects: async () => [],
  getBlogs: async () => [],
  getBlogBySlug: async () => null,
  getAllBlogSlugs: async () => [],
  getExperience: async () => [],
  getSkills: async () => [],
}));

describe('generateMetadata - Homepage', () => {
  it('returns correct metadata for EN locale', async () => {
    const { generateMetadata } = await import('@/app/[locale]/page');
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'en' }) });

    expect(metadata.title).toContain('Daniansyah');
    expect(metadata.description).toContain('Systems Architect');
    expect(metadata.alternates?.canonical).toBe('https://dani-chusyaidin.vercel.app/en');
    expect(metadata.alternates?.languages?.['x-default']).toBe('https://dani-chusyaidin.vercel.app/en');
    expect(metadata.alternates?.languages?.en).toBe('https://dani-chusyaidin.vercel.app/en');
    expect(metadata.alternates?.languages?.id).toBe('https://dani-chusyaidin.vercel.app/id');
    expect(metadata.openGraph?.locale).toBe('en_US');
  });

  it('returns correct metadata for ID locale', async () => {
    const { generateMetadata } = await import('@/app/[locale]/page');
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'id' }) });

    expect(metadata.title).toContain('Arsitek Sistem');
    expect(metadata.alternates?.canonical).toBe('https://dani-chusyaidin.vercel.app/id');
    expect(metadata.openGraph?.locale).toBe('id_ID');
  });
});

describe('generateMetadata - Blog List', () => {
  it('returns correct metadata for EN blog page', async () => {
    const { generateMetadata } = await import('@/app/[locale]/blog/page');
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'en' }) });

    expect(metadata.title).toBe('Technical Logs');
    expect(metadata.alternates?.canonical).toBe('https://dani-chusyaidin.vercel.app/en/blog');
    expect(metadata.alternates?.languages?.id).toBe('https://dani-chusyaidin.vercel.app/id/blog');
  });
});

describe('generateMetadata - Projects', () => {
  it('returns correct metadata for EN projects page', async () => {
    const { generateMetadata } = await import('@/app/[locale]/projects/page');
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'en' }) });

    expect(metadata.title).toBe('System Architecture Archives');
    expect(metadata.alternates?.canonical).toBe('https://dani-chusyaidin.vercel.app/en/projects');
    expect(metadata.alternates?.languages?.id).toBe('https://dani-chusyaidin.vercel.app/id/projects');
  });
});
