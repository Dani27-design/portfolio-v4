'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { HireMeBanner } from "@/components/ui/HireMeBanner";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";

const LogStreamGimmick = dynamic(() => import("@/components/gimmicks/LogStreamGimmick").then(m => ({ default: m.LogStreamGimmick })), { ssr: false });
import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import type { Blog, Locale, HireBannerContent } from "@/types";

interface BlogDetailsPageProps {
  blog: Blog;
  locale: string;
  hireBannerContent?: HireBannerContent | null;
}

export const BlogDetailsPage = ({ blog, locale, hireBannerContent }: BlogDetailsPageProps) => {
  const t = useTranslations('blog');
  const loc = locale as Locale;
  const readMinutes = Math.ceil(blog.content.split(/\s+/).length / 200);

  return (
    <section className="pb-8 md:pb-14 bg-background relative min-h-screen overflow-hidden pt-24 md:pt-28">
      <LazyGimmick><LogStreamGimmick /></LazyGimmick>

      <div className="container-custom relative z-10">
        <article>
          <Reveal width="100%">
            <div className="mb-8 md:mb-16">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-cyan-500 transition-colors mb-6"
                aria-label={t('backToBlog')}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-mono text-xs uppercase tracking-wider">{t('backToBlog')}</span>
              </Link>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                  {t('badgeType')}
                </span>
                <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  {t('badgeStatus')}
                </span>
              </div>

              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-text-main tracking-tighter mb-6 md:mb-8 leading-tight break-words">
                {blog.title[loc]}
              </h1>

              <div className="flex flex-wrap gap-4 md:gap-6 items-center pt-6 border-t border-border/20">
                <div className="flex items-center gap-2 text-text-muted">
                  <Calendar className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider">{blog.date}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <User className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider">Daniansyah Chusyaidin</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider">{t('readTime', { minutes: readMinutes })}</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} width="100%">
            <div className="relative p-5 sm:p-8 md:p-16 bg-surface/70 border border-border/40 rounded-xl overflow-hidden w-full min-w-0">
               <div lang="id" className="markdown-body prose prose-sm md:prose-base prose-invert max-w-none w-full min-w-0 text-text-muted prose-headings:text-text-main prose-headings:tracking-tighter prose-strong:text-cyan-400 prose-code:text-indigo-400 prose-pre:bg-background/80 prose-pre:border prose-pre:border-border/40 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-img:rounded-lg prose-img:max-w-full [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_table]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_code]:break-words [&_a]:break-all [&_p]:break-words [&_h1]:break-words [&>h1:first-child]:hidden [&_h2]:break-words [&_h3]:break-words [&_li]:break-words">
                 <Markdown>
                   {blog.content}
                 </Markdown>
               </div>

               <div className="mt-10 md:mt-16 pt-10 md:pt-16 border-t border-border/20">
                  <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"></div>
               </div>
            </div>
          </Reveal>
        </article>

        <HireMeBanner hireBannerContent={hireBannerContent} locale={locale} />
      </div>
    </section>
  );
};
