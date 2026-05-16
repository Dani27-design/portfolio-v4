'use client';

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { CodeText } from "@/components/ui/CodeText";
import { useTranslations } from "next-intl";

const NetworkTopologyGimmick = dynamic(() => import("@/components/gimmicks/NetworkTopologyGimmick").then(m => ({ default: m.NetworkTopologyGimmick })), { ssr: false });

export const About = () => {
  const t = useTranslations('about');

  return (
    <section id="about" className="section-padding bg-background border-y border-border relative overflow-hidden">
      <NetworkTopologyGimmick />

      <div className="container-custom flex flex-col md:flex-row gap-16 lg:gap-24 items-center relative z-10">
        <div className="w-full md:w-5/12">
          <Reveal>
            <div className="relative group mx-auto md:mx-0 max-w-fit">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-surface border border-border flex items-center justify-center text-6xl font-bold text-text-muted/10 tracking-tighter relative z-10 select-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-indigo-500/5" />
                <CodeText type="logic">DC</CodeText>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/10 -translate-y-4 group-hover:translate-y-4 transition-transform duration-700" />
                <div className="absolute bottom-0 right-0 w-full h-[1px] bg-primary/10 translate-y-4 group-hover:-translate-y-4 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-64 h-64 md:w-80 md:h-80 border border-primary/20 -z-0 transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:border-primary/40"></div>
            </div>
          </Reveal>
        </div>

        <div className="w-full md:w-7/12 space-y-12">
          <Reveal delay={0.2}>
            <div className="space-y-4">
              <h3 className="text-primary uppercase tracking-[0.2em] text-[10px] font-bold">
                <CodeText tag="h3">{t('title')}</CodeText>
              </h3>
              <h2>
                <CodeText tag="h2" type="html">
                  {t('headline')}
                </CodeText>
              </h2>
              <p className="text-lg md:text-xl">
                <CodeText tag="p" type="css">
                  {t('desc')}
                </CodeText>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-border">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-text-main">E2E</div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t('stats.e2e')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-text-main">0%</div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t('stats.zero')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-text-main">TDD</div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t('stats.tdd')}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
