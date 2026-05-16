'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { HireMeBanner } from "@/components/ui/HireMeBanner";
import { ArrowLeft, Calendar, User, Clock, Terminal } from "lucide-react";

const LogStreamGimmick = dynamic(() => import("@/components/gimmicks/LogStreamGimmick").then(m => ({ default: m.LogStreamGimmick })), { ssr: false });
import Markdown from "react-markdown";
import { Link } from "@/i18n/navigation";
import type { Blog, Locale } from "@/types";

interface BlogDetailsPageProps {
  blog: Blog;
  locale: string;
}

export const BlogDetailsPage = ({ blog, locale }: BlogDetailsPageProps) => {
  const loc = locale as Locale;

  return (
    <section className="section-padding bg-background relative min-h-screen overflow-hidden pt-32">
      <LogStreamGimmick />

      <div className="container-custom relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-3 text-cyan-500 font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-12 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          RETURN_TO_ARCHIVES
        </Link>

        <Reveal>
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-[9px] text-cyan-500 font-black uppercase tracking-[0.4em] bg-cyan-950/20 px-3 py-1 border border-cyan-500/20">
                LOG_TYPE :: TECHNICAL_LOG
              </span>
              <span className="font-mono text-[9px] text-indigo-400 font-black uppercase tracking-[0.4em] bg-indigo-950/20 px-3 py-1 border border-indigo-500/20">
                STATUS :: DEPLOYED
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-text-main tracking-tighter mb-8 leading-tight">
              {blog.title[loc]}
            </h1>

            <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-border/20">
              <div className="flex items-center gap-3 text-text-muted">
                <Calendar className="w-4 h-4 text-cyan-500" />
                <span className="font-mono text-[10px] uppercase tracking-widest">{blog.date}</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted">
                <User className="w-4 h-4 text-cyan-500" />
                <span className="font-mono text-[10px] uppercase tracking-widest">DANIANSYAH_CORE</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span className="font-mono text-[10px] uppercase tracking-widest">READ_TIME: 5 MIN</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative p-8 md:p-16 bg-surface/50 border border-border/40 backdrop-blur-xl group overflow-hidden">
             {/* Tactical Overlays */}
             <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                <Terminal className="w-full h-full text-cyan-500" />
             </div>
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

             <div className="markdown-body prose prose-invert max-w-none text-text-muted prose-headings:text-text-main prose-headings:tracking-tighter prose-strong:text-cyan-400 prose-code:text-indigo-400 prose-pre:bg-background/80 prose-pre:border prose-pre:border-border/40">
               <Markdown>
                 {blog.content}
               </Markdown>
             </div>

             <div className="mt-16 pt-16 border-t border-border/20">
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">EOF :: END_OF_SYSTEM_LOG</span>
                  <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                </div>
             </div>
          </div>
        </Reveal>

        <HireMeBanner />
      </div>
    </section>
  );
};
