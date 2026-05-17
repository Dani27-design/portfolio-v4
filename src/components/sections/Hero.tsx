'use client';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowDown, Layers } from "lucide-react";
import { CodeText } from "@/components/ui/CodeText";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { useTranslations, useMessages } from "next-intl";

const SystemGimmick = dynamic(() => import("@/components/gimmicks/SystemGimmick").then(m => ({ default: m.SystemGimmick })), { ssr: false });

const TypewriterText = ({ phrases }: { phrases: string[] }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentPhrase.substring(0, text.length + 1));
        setTypingSpeed(100);

        if (text === currentPhrase) {
          setIsDeleting(true);
          setTypingSpeed(2000);
        }
      } else {
        setText(currentPhrase.substring(0, text.length - 1));
        setTypingSpeed(50);

        if (text === "") {
          setIsDeleting(false);
          setPhraseIndex(prev => prev + 1);
          setTypingSpeed(500);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, typingSpeed, phrases]);

  return (
    <span className="text-xl md:text-3xl font-mono text-primary typewriter">
      <CodeText type="js">
        {text}
      </CodeText>
    </span>
  );
};

export const Hero = () => {
  const t = useTranslations('hero');
  const messages = useMessages();
  const phrases = (messages as Record<string, unknown>).phrases as string[];

  return (
    <section className="relative min-h-dvh flex flex-col items-center overflow-hidden grid-bg px-6 pt-16">
      <LazyGimmick><SystemGimmick /></LazyGimmick>

      <div className="flex-1 flex flex-col items-center justify-center container-custom relative z-10 text-center pb-24 pt-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-cyan-500/37"></span>
            <div className="px-3 py-1 border border-cyan-500/26 bg-cyan-500/18 flex items-center gap-2 shadow-[0_0_11px_rgba(6,182,212,0.15)]">
              <Layers className="w-3 h-3 text-cyan-500/75" />
              <CodeText tag="tag" type="html" className="text-cyan-500/75 font-bold text-[9px] uppercase tracking-[0.3em]">
                {t('tagline')}
              </CodeText>
            </div>
            <span className="w-8 h-px bg-cyan-500/37"></span>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="relative text-white">
          <h1 className="max-w-4xl relative z-10">
            <CodeText tag="h1" type="html">
              {t('headline')}
            </CodeText>
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="h-12 flex items-center justify-center mt-6">
            <TypewriterText phrases={phrases} />
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-8 text-lg md:text-xl max-w-2xl mx-auto">
            <CodeText tag="p" type="css">
              {t('desc')}
            </CodeText>
          </p>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#mini-game"
              className="px-10 py-4 bg-text-main text-background text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 min-w-[200px] flex items-center justify-center text-center"
            >
              {t('ctaGame')}
            </a>
            <a
              href="#contact"
              className="px-10 py-4 border border-border text-text-main text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-surface-hover transition-all duration-300 min-w-[200px] flex items-center justify-center text-center"
            >
              {t('ctaContact')}
            </a>
          </div>
        </Reveal>
      </div>

      {/* System Status */}
      <div className="absolute bottom-10 left-6 md:left-12 font-mono text-[9px] uppercase tracking-widest space-y-1.5 hidden lg:block select-none pointer-events-none">
        <div className="flex items-center gap-2 text-cyan-400/75">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/75 animate-pulse shadow-[0_0_6px_#06b6d4]"></span>
          NODE_STATUS: NOMINAL
        </div>
        <div className="text-indigo-400/75">ENV: PRODUCTION_READY</div>
        <div className="text-text-muted/55">BUILD: v4.2.0-LTS</div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30 text-text-main hidden md:block" aria-hidden="true">
        <ArrowDown className="w-5 h-5" />
      </div>
    </section>
  );
};
