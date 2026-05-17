'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { HireMeBanner } from "@/components/ui/HireMeBanner";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

const LogStreamGimmick = dynamic(() => import("@/components/gimmicks/LogStreamGimmick").then(m => ({ default: m.LogStreamGimmick })), { ssr: false });
import { useTranslations } from "next-intl";
import type { Blog, Locale } from "@/types";

interface BlogListPageProps {
  blogs: Blog[];
  locale: string;
}

export const BlogListPage = ({ blogs, locale }: BlogListPageProps) => {
  const t = useTranslations('blog');
  const loc = locale as Locale;

  return (
    <section className="section-padding bg-background relative min-h-screen overflow-hidden pt-32">
      <LazyGimmick><LogStreamGimmick /></LazyGimmick>

      <div className="container-custom relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-cyan-500 font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-12 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          BACK_TO_ROOT
        </Link>

        <Reveal>
          <div className="mb-24 relative flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tighter text-text-main md:text-5xl lg:text-6xl">{t('archiveTitle')}</h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-indigo-500 mt-6 shadow-[0_0_20px_rgba(6,182,212,0.4)] md:mx-0"></div>
            <div className="md:absolute -top-12 left-0 mb-6 md:mb-0">
               <span className="font-mono text-[9px] text-cyan-500 font-black uppercase tracking-[0.4em] bg-cyan-950/20 px-3 py-1 border border-cyan-500/20">
                 SYS_DOCS :: COMPLETE_REGISTRY
               </span>
            </div>
            <p className="text-cyan-500/80 mt-8 font-mono text-[11px] uppercase tracking-[0.4em] font-black flex items-center justify-center md:justify-start gap-4">
              <span className="h-px w-8 bg-cyan-500/30" />
              {t('archiveSubtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, idx) => (
            <Reveal key={blog.id} delay={idx * 0.05} width="100%">
              <Link href={`/blog/${blog.slug}`} className="block h-full">
                <div
                  className="p-10 bg-surface/90 border border-border/40 hover:border-cyan-500/50 hover:-translate-y-2 transition-all duration-500 cursor-pointer group h-full flex flex-col shadow-xl relative group/blog overflow-hidden"
                >
                  {/* Background Archive Texture */}
                  <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:15px_15px] pointer-events-none" />

                  {/* Tactical Rail */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-border/20 to-transparent group-hover:via-cyan-500/40 transition-colors duration-700" />

                  <div className="flex justify-between items-start mb-10 relative z-10">
                     <div className="flex flex-col gap-2">
                        <div className="text-[10px] font-mono text-cyan-400 mb-2 uppercase tracking-widest font-black flex items-center gap-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-sm group-hover:scale-125 transition-transform shadow-[0_0_8px_#06b6d4]"></span>
                          LOG_DATE: {blog.date}
                        </div>
                        <span className="text-[7px] font-mono text-white/20 uppercase tracking-tighter hidden md:inline">COMMIT_HASH: 0x{blog.id.substring(0, 8).toUpperCase()}</span>
                     </div>
                     <div className="font-mono text-[9px] text-indigo-400 bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 uppercase tracking-tighter group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                       #{idx.toString().padStart(2, '0')}
                     </div>
                  </div>

                  <h3 className="text-2xl font-bold text-text-main group-hover:text-cyan-200 transition-colors mb-8 leading-tight tracking-tighter border-l-2 border-transparent group-hover:border-cyan-500/50 group-hover:pl-4 transition-all duration-500">
                    {blog.title[loc]}
                  </h3>

                  <p className="text-sm text-text-muted/80 line-clamp-4 leading-relaxed mb-12 flex-grow italic group-hover:text-text-main transition-colors">
                    {blog.excerpt[loc]}
                  </p>

                  <div className="mt-auto pt-8 border-t border-border/20 flex justify-between items-center group/btn relative z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-500 group-hover:translate-x-2 transition-all duration-300">
                        {t('readEntry')}
                      </span>
                      <div className="w-6 h-[2px] bg-cyan-500 group-hover:w-full transition-all duration-500" />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-border/40 bg-background flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:border-cyan-500/60 transition-all duration-500 group-hover:rotate-45">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]"></div>
                    </div>
                  </div>

                  {/* Corner Scan Accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-indigo-500/30 transition-colors" />

                  {/* Horizontal Wave */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <HireMeBanner />
      </div>
    </section>
  );
};
