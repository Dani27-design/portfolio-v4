'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { HireMeBanner } from "@/components/ui/HireMeBanner";
import { ArrowLeft, Calendar, User, Clock, Terminal } from "lucide-react";

const LogStreamGimmick = dynamic(() => import("@/components/gimmicks/LogStreamGimmick").then(m => ({ default: m.LogStreamGimmick })), { ssr: false });
import Markdown from "react-markdown";
import { Link } from "@/i18n/navigation";
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
    <section className="section-padding bg-background relative min-h-screen overflow-hidden pt-32">
      <LazyGimmick><LogStreamGimmick /></LazyGimmick>

      <div className="container-custom relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-3 text-cyan-500 font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-12 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          RETURN_TO_ARCHIVES
        </Link>

        <Reveal width="100%">
          <div className="mb-10 md:mb-16">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-6 md:mb-8">
              <span className="font-mono text-[8px] md:text-[9px] text-cyan-500 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] bg-cyan-950/20 px-2 md:px-3 py-1 border border-cyan-500/20">
                LOG_TYPE :: TECHNICAL_LOG
              </span>
              <span className="font-mono text-[8px] md:text-[9px] text-indigo-400 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] bg-indigo-950/20 px-2 md:px-3 py-1 border border-indigo-500/20">
                STATUS :: DEPLOYED
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main tracking-tighter mb-6 md:mb-8 leading-tight break-words">
              {blog.title[loc]}
            </h1>

            <div className="flex flex-wrap gap-4 md:gap-8 items-center pt-6 md:pt-8 border-t border-border/20">
              <div className="flex items-center gap-2 md:gap-3 text-text-muted">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500 shrink-0" />
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest">{blog.date}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-text-muted">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500 shrink-0" />
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest">DANIANSYAH_CORE</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-text-muted">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500 shrink-0" />
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest">{t('readTime', { minutes: readMinutes })}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} width="100%">
          <div className="relative p-4 sm:p-8 md:p-16 bg-surface/70 border border-border/40 group overflow-hidden w-full min-w-0">
             {/* Tactical Overlays */}
             <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none hidden md:block">
                <Terminal className="w-full h-full text-cyan-500" />
             </div>
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

             <div className="markdown-body prose prose-sm md:prose-base prose-invert max-w-none w-full min-w-0 text-text-muted prose-headings:text-text-main prose-headings:tracking-tighter prose-strong:text-cyan-400 prose-code:text-indigo-400 prose-pre:bg-background/80 prose-pre:border prose-pre:border-border/40 prose-pre:overflow-x-auto prose-img:rounded prose-img:max-w-full [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_table]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_code]:break-words [&_a]:break-all [&_p]:break-words [&_h1]:break-words [&_h1]:text-2xl [&_h1]:md:text-3xl [&>h1:first-child]:hidden [&_h2]:break-words [&_h2]:text-xl [&_h2]:md:text-2xl [&_h3]:break-words [&_h3]:text-lg [&_h3]:md:text-xl [&_li]:break-words">
               <Markdown>
                 {blog.content}
               </Markdown>
             </div>

             <div className="mt-10 md:mt-16 pt-10 md:pt-16 border-t border-border/20">
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
             </div>
          </div>
        </Reveal>

        <HireMeBanner hireBannerContent={hireBannerContent} locale={locale} />
      </div>
    </section>
  );
};
