'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { CodeText } from "@/components/ui/CodeText";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { useTranslations } from "next-intl";

const ArchitectureSchematicGimmick = dynamic(() => import("@/components/gimmicks/ArchitectureSchematicGimmick").then(m => ({ default: m.ArchitectureSchematicGimmick })), { ssr: false });
import type { SkillGroup, Locale } from "@/types";

interface SkillsProps {
  skills: SkillGroup[];
  locale: string;
}

export const Skills = ({ skills, locale }: SkillsProps) => {
  const t = useTranslations('skills');
  const loc = locale as Locale;

  if (skills.length === 0) return null;

  return (
    <section id="skills" className="section-padding bg-surface relative overflow-hidden">
      <LazyGimmick><ArchitectureSchematicGimmick /></LazyGimmick>

      <div className="container-custom max-w-5xl relative z-10">
        <Reveal width="100%">
          <div className="mb-6 md:mb-16 lg:mb-24 relative">
            <h2 className="text-2xl font-bold tracking-tighter text-text-main md:text-5xl lg:text-6xl">
              <CodeText tag="h2" type="html">{t('title')}</CodeText>
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-indigo-500 mt-4 md:mt-6 rounded-full"></div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 md:gap-16">
          {skills.map((group, groupIdx) => (
            <Reveal key={group.id} delay={groupIdx * 0.1} width="100%">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start relative group/row">
                {/* Visual Connector */}
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-transparent to-transparent hidden lg:block group-hover/row:from-cyan-500 transition-all duration-500" />

                <div className="md:col-span-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-500 font-bold">0{groupIdx + 1}</span>
                    <h3 className="font-mono text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-bold group-hover/row:text-cyan-500 dark:group-hover/row:text-cyan-300 transition-colors">
                      {group.title[loc]}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-text-muted/70 pl-6 border-l border-border/50 group-hover/row:border-cyan-500 transition-all">
                    <CodeText type="css">{group.context[loc]}</CodeText>
                  </p>
                </div>
                <div className="md:col-span-3 flex flex-wrap gap-2 md:gap-3">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="group relative"
                    >
                      <span className="px-3 md:px-5 py-1.5 md:py-2.5 bg-background/70 border border-border/60 text-xs font-semibold text-text-main flex items-center gap-2 md:gap-3 group-hover:border-cyan-500 group-hover:-translate-y-1 transition-all duration-300 rounded-lg">
                        {skill.name}
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-tight">{skill.tag}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
