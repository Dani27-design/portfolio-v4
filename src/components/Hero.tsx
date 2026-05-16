import { useState, useEffect } from "react";
import { Reveal } from "./Reveal";
import { ArrowDown, Layers } from "lucide-react";
import { SystemGimmick } from "./SystemGimmick";
import { CodeText } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import { useLocalizedPath } from "../i18n/useLocalizedPath";

export const Hero = () => {
  const { t, tArray } = useLanguage();
  const localizedPath = useLocalizedPath();
  const phrases = tArray('phrases') as readonly string[];

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
          setTypingSpeed(2000); // Pause at end
        }
      } else {
        setText(currentPhrase.substring(0, text.length - 1));
        setTypingSpeed(50);

        if (text === "") {
          setIsDeleting(false);
          setPhraseIndex(prev => prev + 1);
          setTypingSpeed(500); // Pause before next
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, typingSpeed, phrases]);

  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden grid-bg px-6 pt-16">
      <SystemGimmick />

      <div className="flex-1 flex flex-col items-center justify-center container-custom relative z-10 text-center pb-24 pt-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-cyan-500/37"></span>
            <div className="px-3 py-1 border border-cyan-500/26 bg-cyan-500/18 flex items-center gap-2 shadow-[0_0_11px_rgba(6,182,212,0.15)]">
              <Layers className="w-3 h-3 text-cyan-500/75" />
              <CodeText tag="tag" type="html" className="text-cyan-500/75 font-bold text-[9px] uppercase tracking-[0.3em]">
                {t('hero.tagline')}
              </CodeText>
            </div>
            <span className="w-8 h-px bg-cyan-500/37"></span>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="relative text-white">
          <h1 className="max-w-4xl relative z-10">
            <CodeText tag="h1" type="html">
              {t('hero.headline')}
            </CodeText>
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="h-12 flex items-center justify-center mt-6">
            <span className="text-xl md:text-3xl font-mono text-primary typewriter">
              <CodeText type="js">
                {text}
              </CodeText>
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-8 text-lg md:text-xl max-w-2xl mx-auto">
            <CodeText tag="p" type="css">
              Architecting fault-tolerant distributed systems and robust mobile cores. I solve for complexity through rigorous structural design and end-to-end technical ownership.
            </CodeText>
          </p>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={localizedPath('/#mini-game')}
              className="px-10 py-4 bg-text-main text-background text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 min-w-[200px] flex items-center justify-center text-center"
            >
              {t('hero.ctaGame')}
            </Link>
            <Link
              to={localizedPath('/#contact')}
              className="px-10 py-4 border border-border text-text-main text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-surface-hover transition-all duration-300 min-w-[200px] flex items-center justify-center text-center"
            >
              {t('hero.ctaContact')}
            </Link>
          </div>
        </Reveal>
      </div>

      {/* System Status - Pinned to bottom-left with safe padding */}
      <div className="absolute bottom-10 left-6 md:left-12 font-mono text-[9px] uppercase tracking-widest space-y-1.5 hidden lg:block select-none pointer-events-none">
        <div className="flex items-center gap-2 text-cyan-400/75">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/75 animate-pulse shadow-[0_0_6px_#06b6d4]"></span>
          NODE_STATUS: NOMINAL
        </div>
        <div className="text-indigo-400/75">ENV: PRODUCTION_READY</div>
        <div className="text-text-muted/55">BUILD: v4.2.0-LTS</div>
      </div>

      {/* Scroll Indicator - Positioned lower to avoid overlap */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30 text-text-main group cursor-pointer hidden md:block">
        <ArrowDown className="w-5 h-5" />
      </div>
    </section>
  );
};
