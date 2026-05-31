import { Reveal } from "@/components/ui/Reveal";
import { ClientGimmick } from "@/components/ui/ClientGimmick";
import { HireMeBanner } from "@/components/ui/HireMeBanner";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Blog, Locale, HireBannerContent } from "@/types";

interface BlogListPageProps {
  blogs: Blog[];
  locale: string;
  hireBannerContent?: HireBannerContent | null;
}

export async function BlogListPage({ blogs, locale, hireBannerContent }: BlogListPageProps) {
  const t = await getTranslations('blog');
  const loc = locale as Locale;

  return (
    <section className="pb-8 md:pb-14 bg-background relative min-h-screen overflow-hidden pt-24 md:pt-28">
      <ClientGimmick name="logStream" />

      <div className="container-custom relative z-10">
        <Reveal>
          <div className="mb-12 md:mb-16 lg:mb-24">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-cyan-500 transition-colors mb-6"
              aria-label={t('backToHome')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-wider">{t('backToHome')}</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter text-text-main md:text-5xl lg:text-6xl">{t('archiveTitle')}</h1>
            <p className="text-text-muted/70 mt-3 md:mt-4 text-sm md:text-base">
              {t('archiveSubtitle')}
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-indigo-500 mt-5 md:mt-6 rounded-full" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {blogs.map((blog, idx) => (
            <Reveal key={blog.id} delay={idx * 0.1} width="100%">
              <Link href={`/blog/${blog.slug}`} className="block h-full">
                <div
                  className="p-5 md:p-8 bg-surface border border-border/40 rounded-xl hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col relative overflow-hidden"
                >
                  <div className="mb-4 md:mb-5">
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                      {blog.date}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-text-main group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-snug tracking-tight">
                    {blog.title[loc]}
                  </h3>

                  <p className="text-sm text-text-muted/70 line-clamp-3 leading-relaxed mt-3 flex-grow group-hover:text-text-muted transition-colors">
                    {blog.excerpt[loc]}
                  </p>

                  <div className="mt-auto pt-5 border-t border-border/20 flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-500 group-hover:translate-x-1 transition-transform duration-300">
                      {t('readEntry')}
                    </span>
                    <div className="w-6 h-[2px] bg-cyan-500/40 group-hover:w-10 group-hover:bg-cyan-500 transition-all duration-300 rounded-full" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <HireMeBanner hireBannerContent={hireBannerContent} locale={locale} />
      </div>
    </section>
  );
}
