'use client';

import { Reveal } from "@/components/ui/Reveal";
import { Mail } from "lucide-react";
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

  const headlineText = hireBannerContent?.headline[loc] ?? t('headline');
  const descText = hireBannerContent?.desc[loc] ?? t('desc');
  const ctaText = hireBannerContent?.cta[loc] ?? t('cta');

  const ctaClassName = "group relative px-6 md:px-8 py-3.5 md:py-4 bg-cyan-500 text-background font-bold uppercase tracking-wider overflow-hidden flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 rounded-lg text-xs md:text-sm whitespace-nowrap";

  const contactLink = pathname === '/' ? (
    <a href="#contact" className={ctaClassName}>
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <Mail className="w-4 h-4 relative z-10" />
      <span className="relative z-10">{ctaText}</span>
    </a>
  ) : (
    <Link href="/#contact" className={ctaClassName}>
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <Mail className="w-4 h-4 relative z-10" />
      <span className="relative z-10">{ctaText}</span>
    </Link>
  );

  return (
    <div className="mt-8 md:mt-12">
      <Reveal width="100%">
        <div className="border-t border-border/30 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-10">
            <div className="flex-grow">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-text-main tracking-tight mb-2 md:mb-3 leading-tight">
                {headlineText}
              </h2>

              <p className="text-text-muted text-sm md:text-base max-w-xl leading-relaxed">
                {descText}
              </p>
            </div>

            <div className="shrink-0">
              {contactLink}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
