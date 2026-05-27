'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { CodeText } from "@/components/ui/CodeText";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { useTranslations } from "next-intl";

const TacticalTrajectoryGimmick = dynamic(() => import("@/components/gimmicks/TacticalTrajectoryGimmick").then(m => ({ default: m.TacticalTrajectoryGimmick })), { ssr: false });
import type { ExperienceItem, Locale } from "@/types";

interface ExperienceProps {
  experience: ExperienceItem[];
  locale: string;
}

export const Experience = ({ experience, locale }: ExperienceProps) => {
  const t = useTranslations('experience');
  const loc = locale as Locale;

  if (experience.length === 0) return null;

  return (
    <section id="work" className="section-padding bg-background relative overflow-hidden">
      <LazyGimmick><TacticalTrajectoryGimmick /></LazyGimmick>

      <div className="container-custom relative z-10">
        <Reveal>
          <div className="mb-12 md:mb-24 relative">
            <h2 className="text-3xl font-bold tracking-tighter text-text-main md:text-5xl lg:text-6xl">
              <CodeText tag="h2" type="html">{t('title')}</CodeText>
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-600 to-indigo-600 mt-6 opacity-80"></div>
          </div>
        </Reveal>

        <div className="max-w-4xl relative">
          <div className="relative border-l border-border/20 ml-2 lg:ml-40 pr-4 lg:pr-0">
            {/* Timeline Tracer Line */}
            <div className="absolute top-0 bottom-0 -left-px w-[2px] bg-gradient-to-b from-cyan-600/30 via-indigo-600/20 to-transparent" />

            {experience.map((job, idx) => (
              <Reveal key={job.id} delay={idx * 0.1}>
                <div className="relative pl-8 lg:pl-16 pb-16 md:pb-24 last:pb-8 last:md:pb-12 group/experience">
                  {/* Date Range - Desktop */}
                  <div className="hidden lg:block absolute -left-48 top-0 w-32 text-right">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black group-hover/experience:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">
                      <CodeText type="logic">{job.period[loc]}</CodeText>
                    </span>
                  </div>

                  {/* Marker Hub */}
                  <div className="absolute -left-[14px] top-0 z-20">
                    <div className="w-7 h-7 rounded-full border border-border/40 bg-background flex items-center justify-center transition-all duration-500 group-hover/experience:border-cyan-500/50 group-hover/experience:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
                      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        job.isCurrent ? "bg-cyan-500 shadow-[0_0_12px_#06b6d4]" : "bg-border group-hover/experience:bg-indigo-500/60"
                      }`} />
                    </div>
                  </div>

                  {/* Mobile Date */}
                  <div className="lg:hidden mb-4">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black px-2 py-1 bg-cyan-950/20 border border-cyan-500/30">
                      {job.period[loc]}
                    </span>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3 relative">
                      <div className="flex items-center gap-4 flex-wrap">
                        <h3 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight group-hover/experience:text-cyan-50 transition-colors">
                          <CodeText tag="h3">{job.title[loc]}</CodeText>
                        </h3>
                      </div>
                      <div className="text-sm md:text-base text-cyan-400 font-black tracking-[0.25em] uppercase flex items-center gap-3">
                        <span className="w-6 h-[2px] bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                        <CodeText label="company" type="js">{job.company}</CodeText>
                      </div>
                    </div>

                    <ul className="space-y-6 max-w-2xl relative">
                      {job.points[loc].slice(0, 3).map((point, pIdx) => (
                        <li key={`job-point-${pIdx}`} className="flex gap-3 md:gap-6 group/point relative">
                          <div className="flex flex-col items-center">
                             <span className="text-cyan-500 font-mono text-[10px] mt-1.5 font-bold group-hover/point:text-cyan-300 transition-colors">
                               0{pIdx + 1}
                             </span>
                             <div className="w-px h-full bg-border/20 mt-2" />
                          </div>
                          <p className="text-sm md:text-lg leading-relaxed text-text-muted transition-all duration-300 border-l border-white/5 pl-4 hover:border-cyan-500/20">
                            <CodeText tag="li" type="css">{point}</CodeText>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
