'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { HireMeBanner } from "@/components/ui/HireMeBanner";
import { motion } from "motion/react";
import { CodeText } from "@/components/ui/CodeText";
import { Link } from "@/i18n/navigation";

const ServiceClusterGimmick = dynamic(() => import("@/components/gimmicks/ServiceClusterGimmick").then(m => ({ default: m.ServiceClusterGimmick })), { ssr: false });
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Project, Locale } from "@/types";

interface ProjectListPageProps {
  projects: Project[];
  locale: string;
}

export const ProjectListPage = ({ projects, locale }: ProjectListPageProps) => {
  const t = useTranslations('projects');
  const loc = locale as Locale;

  return (
    <section className="section-padding bg-surface relative min-h-screen overflow-hidden pt-32">
      <ServiceClusterGimmick />

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
            <h2 className="text-3xl font-bold tracking-tighter text-text-main md:text-5xl lg:text-6xl">
              <CodeText tag="h2" type="html">System Architecture Archives</CodeText>
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-indigo-500 mt-6 shadow-[0_0_20px_rgba(6,182,212,0.5)] md:mx-0"></div>

            <div className="md:absolute -top-12 left-0 mb-6 md:mb-0">
              <span className="font-mono text-[10px] text-cyan-400 font-black uppercase tracking-[0.5em] bg-cyan-950/40 px-4 py-1.5 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <CodeText type="logic">DB_INDEX :: FULL_DEPLOYMENT_HISTORY</CodeText>
              </span>
            </div>
            <p className="text-cyan-500/80 mt-8 font-mono text-[11px] uppercase tracking-[0.4em] font-black flex items-center justify-center md:justify-start gap-4">
              <span className="h-px w-8 bg-cyan-500/30" />
              Comprehensive Technical Case Studies & System Designs
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, idx) => (
            <Reveal key={project.id} delay={idx * 0.05} width="100%">
              <motion.div
                whileHover={{ y: -10, rotateX: 2, rotateY: 5 }}
                className="bg-background/90 backdrop-blur-xl border border-border/40 p-10 hover:border-cyan-500/60 transition-all duration-500 group h-full flex flex-col shadow-2xl relative overflow-hidden group/project cursor-pointer [perspective:1000px]"
              >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:25px_25px] pointer-events-none" />

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-indigo-500/20 group-hover:border-indigo-500 group-hover:w-16 group-hover:h-16 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500/20 group-hover:border-cyan-500 group-hover:w-16 group-hover:h-16 transition-all duration-500" />

                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-4 py-1.5 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      [{String(idx + 1).padStart(2, '0')}] PRODUCTION
                    </span>
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-tighter group-hover:text-cyan-500/60 transition-colors">REF_BRANCH: STABLE/V4</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
                  />
                </div>

                <h3 className="text-2xl md:text-3xl font-black mb-6 tracking-tighter text-text-main group-hover:text-cyan-400 transition-colors">
                  <CodeText tag="h3">{project.name[loc]}</CodeText>
                </h3>

                <p className="text-text-muted text-base mb-14 leading-relaxed flex-grow italic border-l-2 border-border/20 pl-6 group-hover:border-cyan-500/60 group-hover:text-text-main transition-all duration-500">
                  <CodeText type="js">{project.desc[loc]}</CodeText>
                </p>

                <div className="flex justify-between items-center pt-10 border-t border-border/20 mt-auto relative z-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-mono text-text-muted/80 uppercase tracking-[0.25em] font-black group-hover:text-indigo-400 transition-colors">
                      {t('metadata.access')}
                    </span>
                    <motion.div
                      initial={{ width: "20px" }}
                      whileHover={{ width: "100%" }}
                      className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"
                    />
                  </div>
                  <span className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-500 group-hover:text-cyan-300 group-hover:translate-x-3 transition-all duration-300">
                    {t('viewDetail')}
                    <div className="w-6 h-[2px] bg-cyan-500 group-hover:w-10 transition-all" />
                  </span>
                </div>

                {/* Hover Scanline */}
                <div className="absolute top-0 left-0 w-[300%] h-full bg-gradient-to-r from-transparent via-cyan-400/[0.08] to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none skew-x-20" />

                {/* Micro-Metadata Overlay */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                   <div className="font-mono text-[6px] text-white/10 uppercase text-right leading-tight">
                     {t('metadata.access')}<br />
                     {t('metadata.checksum')}<br />
                     {t('metadata.target')}
                   </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <HireMeBanner />
      </div>
    </section>
  );
};
