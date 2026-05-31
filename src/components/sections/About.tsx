import dynamic from "next/dynamic";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { CodeText } from "@/components/ui/CodeText";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { getTranslations } from "next-intl/server";
import type { AboutContent, Locale } from "@/types";

const NetworkTopologyGimmick = dynamic(() => import("@/components/gimmicks/NetworkTopologyGimmick").then(m => ({ default: m.NetworkTopologyGimmick })), { ssr: false });

interface AboutProps {
  aboutContent?: AboutContent | null;
  locale?: string;
}

export async function About({ aboutContent, locale }: AboutProps) {
  const t = await getTranslations('about');
  const loc = (locale || 'en') as Locale;

  const title = aboutContent?.title[loc] ?? t('title');
  const headline = aboutContent?.headline[loc] ?? t('headline');
  const desc = aboutContent?.desc[loc] ?? t('desc');
  const stat1Value = aboutContent?.stats.stat1.value ?? 'E2E';
  const stat1Label = aboutContent?.stats.stat1.label[loc] ?? t('stats.e2e');
  const stat2Value = aboutContent?.stats.stat2.value ?? '0%';
  const stat2Label = aboutContent?.stats.stat2.label[loc] ?? t('stats.zero');
  const stat3Value = aboutContent?.stats.stat3.value ?? 'TDD';
  const stat3Label = aboutContent?.stats.stat3.label[loc] ?? t('stats.tdd');

  return (
    <section id="about" className="section-padding bg-background border-y border-border relative overflow-hidden">
      <LazyGimmick><NetworkTopologyGimmick /></LazyGimmick>

      <div className="container-custom flex flex-col md:flex-row gap-6 md:gap-16 lg:gap-24 items-center relative z-10">
        <div className="w-full md:w-5/12">
          <Reveal>
            <div className="relative group mx-auto md:mx-0 max-w-fit">
              <div className="w-48 h-48 md:w-80 md:h-80 bg-surface border border-border relative z-10 select-none overflow-hidden">
                <Image
                  src={aboutContent?.avatarUrl || '/logo.png'}
                  alt={aboutContent?.avatarUrl ? 'Photo of Daniansyah Chusyaidin' : 'Daniansyah Chusyaidin logo'}
                  fill
                  sizes="(max-width: 768px) 192px, 320px"
                  className="object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/10 -translate-y-4 group-hover:translate-y-4 transition-transform duration-700" />
                <div className="absolute bottom-0 right-0 w-full h-[1px] bg-primary/10 translate-y-4 group-hover:-translate-y-4 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-48 h-48 md:w-80 md:h-80 border border-primary/20 -z-0 transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:border-primary/40"></div>
            </div>
          </Reveal>
        </div>

        <div className="w-full md:w-7/12 space-y-5 md:space-y-12">
          <Reveal delay={0.2}>
            <div className="space-y-3 md:space-y-4">
              <span className="text-primary uppercase tracking-widest text-xs font-bold block">
                <CodeText tag="span">{title}</CodeText>
              </span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-snug">
                <CodeText tag="h2" type="html">
                  {headline}
                </CodeText>
              </h2>
              <p className="text-sm md:text-xl">
                <CodeText tag="p" type="css">
                  {desc}
                </CodeText>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-12 border-t border-border">
              <div className="space-y-1">
                <div className="text-xl md:text-3xl font-bold text-text-main">{stat1Value}</div>
                <div className="text-xs uppercase tracking-wider text-text-muted font-semibold">{stat1Label}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl md:text-3xl font-bold text-text-main">{stat2Value}</div>
                <div className="text-xs uppercase tracking-wider text-text-muted font-semibold">{stat2Label}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl md:text-3xl font-bold text-text-main">{stat3Value}</div>
                <div className="text-xs uppercase tracking-wider text-text-muted font-semibold">{stat3Label}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
