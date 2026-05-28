'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

const LogStreamGimmick = dynamic(() => import("@/components/gimmicks/LogStreamGimmick").then(m => ({ default: m.LogStreamGimmick })), { ssr: false });
import { useTranslations } from "next-intl";
import type { Blog as BlogType, Locale } from "@/types";

interface BlogProps {
  blogs: BlogType[];
  locale: string;
}

export const Blog = ({ blogs, locale }: BlogProps) => {
  const t = useTranslations('blog');
  const loc = locale as Locale;

  if (blogs.length === 0) return null;

  return (
    <section id="blog" className="section-padding bg-background relative overflow-hidden">
      <LazyGimmick><LogStreamGimmick /></LazyGimmick>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 md:mb-24 gap-8 items-center md:items-end">
          <Reveal>
            <div className="relative flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tighter text-text-main md:text-5xl lg:text-6xl">{t('title')}</h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-indigo-500 mt-6 shadow-[0_0_20px_rgba(6,182,212,0.4)] mx-auto md:mx-0"></div>
            </div>
          </Reveal>
          <Reveal delay={0.2} width="100%">
            <div className="flex justify-center md:justify-end w-full">
              <Link
                href="/blog"
                className="group flex items-center gap-4 px-8 py-4 bg-surface/50 border border-cyan-500/30 hover:border-cyan-500 transition-all duration-500 relative overflow-hidden w-full md:w-auto justify-center"
              >
                <div className="absolute inset-0 bg-cyan-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <span className="font-mono text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em] relative z-10">
                  {t('cta')}
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-500 group-hover:translate-x-2 transition-transform relative z-10" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {blogs.slice(0, 3).map((blog, idx) => (
            <Reveal key={blog.id} delay={idx * 0.1} width="100%">
              <Link href={`/blog/${blog.slug}`} className="block h-full">
                <div
                  className="p-6 md:p-10 bg-surface/90 border border-border/40 hover:border-cyan-500/50 hover:-translate-y-2 transition-all duration-500 cursor-pointer group h-full flex flex-col shadow-xl relative group/blog overflow-hidden"
                >
                  {/* Background Archive Texture */}
                  <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:15px_15px] pointer-events-none" />

                  {/* Tactical Rail */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-border/20 to-transparent group-hover:via-cyan-500/40 transition-colors duration-700" />

                  <div className="flex justify-between items-start mb-6 md:mb-10 relative z-10">
                     <div className="flex flex-col gap-2">
                        <div className="text-[10px] font-mono text-cyan-400 mb-2 uppercase tracking-widest font-black flex items-center gap-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-sm group-hover:scale-125 transition-transform shadow-[0_0_8px_#06b6d4]"></span>
                          LOG_DATE: {blog.date}
                        </div>
                     </div>
                     <div className="font-mono text-[9px] text-indigo-400 bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 uppercase tracking-tighter group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                       #{idx.toString().padStart(2, '0')}
                     </div>
                  </div>

                  <h3 className="text-2xl font-bold text-text-main group-hover:text-cyan-200 transition-colors mb-8 leading-tight tracking-tighter border-l-2 border-transparent group-hover:border-cyan-500/50 group-hover:pl-4 transition-all duration-500">
                    {blog.title[loc]}
                  </h3>

                  <p className="text-sm text-text-muted/80 line-clamp-4 leading-relaxed mb-8 md:mb-12 flex-grow italic group-hover:text-text-main transition-colors">
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
      </div>
    </section>
  );
};
