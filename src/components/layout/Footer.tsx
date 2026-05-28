'use client';

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { FooterContent, Locale } from "@/types";

const KernelSubstrateGimmick = dynamic(() => import("@/components/gimmicks/KernelSubstrateGimmick").then(m => ({ default: m.KernelSubstrateGimmick })), { ssr: false });

interface FooterProps {
  footerContent?: FooterContent | null;
  locale?: string;
  logoUrl?: string;
}

export const Footer = ({ footerContent, locale, logoUrl }: FooterProps = {}) => {
  const t = useTranslations('footer');
  const loc = (locale || 'en') as Locale;
  const currentYear = new Date().getFullYear();

  const ownerName = footerContent?.ownerName ?? 'DANIANSYAH CHUSYAIDIN';
  const role = footerContent?.role[loc] ?? t('role');

  return (
    <footer className="bg-background border-t border-border/60 relative overflow-hidden">
      <KernelSubstrateGimmick />

      <div className="container-custom py-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
             <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img src={logoUrl} alt={ownerName} className="w-6 h-6 object-cover rounded-sm group cursor-pointer transition-all hover:scale-110" />
                ) : (
                  <div className="w-6 h-6 rounded-sm bg-text-main text-background flex items-center justify-center font-black text-[8px] select-none group cursor-pointer transition-all hover:scale-110">DC</div>
                )}
                <div className="flex flex-col">
                   <span className="text-[11px] font-black text-text-main tracking-[0.2em] uppercase">{ownerName}</span>
                   <span className="text-[8px] font-mono text-cyan-500/80 font-bold uppercase tracking-widest leading-none">{role}</span>
                </div>
             </div>
             <p className="text-[7px] font-mono text-text-muted/60 uppercase tracking-widest text-center md:text-left">
                &copy; {currentYear} All rights reserved.
             </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
