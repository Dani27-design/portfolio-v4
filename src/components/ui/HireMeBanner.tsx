'use client';

import { motion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { Terminal, Cpu, Zap, ShieldCheck, Mail } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { HireBannerContent, Locale } from "@/types";

interface HireMeBannerProps {
  hireBannerContent?: HireBannerContent | null;
  locale?: string;
}

export const HireMeBanner = ({ hireBannerContent, locale }: HireMeBannerProps = {}) => {
  const t = useTranslations('hireBanner');
  const pathname = usePathname();
  const loc = (locale || 'en') as Locale;

  const badge = hireBannerContent?.badge[loc] ?? t('badge');
  const headlineText = hireBannerContent?.headline[loc] ?? t('headline');
  const descText = hireBannerContent?.desc[loc] ?? t('desc');
  const ctaText = hireBannerContent?.cta[loc] ?? t('cta');

  const contactLink = pathname === '/' ? (
    <a
      href="#contact"
      className="group relative px-6 md:px-10 py-4 md:py-5 bg-cyan-500 text-background font-black uppercase tracking-[0.2em] md:tracking-[0.3em] overflow-hidden flex items-center justify-center gap-3 md:gap-4 transition-transform hover:scale-105 active:scale-95"
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <Mail className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
      <span className="relative z-10 text-[9px] md:text-[11px] whitespace-normal md:whitespace-nowrap text-center">{ctaText}</span>
    </a>
  ) : (
    <Link
      href="/#contact"
      className="group relative px-6 md:px-10 py-4 md:py-5 bg-cyan-500 text-background font-black uppercase tracking-[0.2em] md:tracking-[0.3em] overflow-hidden flex items-center justify-center gap-3 md:gap-4 transition-transform hover:scale-105 active:scale-95"
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <Mail className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
      <span className="relative z-10 text-[9px] md:text-[11px] whitespace-normal md:whitespace-nowrap text-center">{ctaText}</span>
    </Link>
  );

  return (
    <div className="mt-20 px-0">
      <Reveal width="100%">
        <div className="relative p-[1px] bg-gradient-to-r from-cyan-500/50 via-indigo-500/50 to-cyan-500/50 overflow-hidden group">
          {/* Animated Gradient Background */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-cyan-500/20 opacity-30 pointer-events-none"
          />

          <div className="relative bg-background p-5 sm:p-8 md:p-12 overflow-hidden">
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10 md:gap-12">
              <div className="flex-grow text-center lg:text-left w-full">
                <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-cyan-500"
                  />
                  <span className="font-mono text-[9px] md:text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">
                    {badge}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-text-main tracking-tighter mb-6 leading-tight">
                  {headlineText}
                </h2>

                <p className="text-text-muted text-sm md:text-lg max-w-2xl mb-10 mx-auto lg:mx-0 leading-relaxed italic">
                  {descText}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Cpu className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                    <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest text-text-muted">Distributed_Eng</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                    <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest text-text-muted">Security_First</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                    <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest text-text-muted">High_Performance</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full lg:w-auto shrink-0 mt-8 lg:mt-0">
                {contactLink}
              </div>
            </div>

            {/* Background Tactical Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 border-r-2 border-t-2 border-cyan-500/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
            <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
            <Terminal className="absolute -bottom-10 -right-10 w-48 h-48 text-indigo-500/5 rotate-[-15deg] pointer-events-none" />
          </div>
        </div>
      </Reveal>
    </div>
  );
};
