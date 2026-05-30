'use client';

import dynamic from "next/dynamic";
import { Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FooterContent, ContactContent, Locale } from "@/types";

const KernelSubstrateGimmick = dynamic(() => import("@/components/gimmicks/KernelSubstrateGimmick").then(m => ({ default: m.KernelSubstrateGimmick })), { ssr: false });

interface FooterProps {
  footerContent?: FooterContent | null;
  contactContent?: ContactContent | null;
  locale?: string;
}

export const Footer = ({ footerContent, contactContent, locale }: FooterProps = {}) => {
  const t = useTranslations('footer');
  const loc = (locale || 'en') as Locale;
  const currentYear = new Date().getFullYear();

  const ownerName = footerContent?.ownerName ?? 'Daniansyah Chusyaidin';
  const role = footerContent?.role[loc] ?? t('role');

  const socials = [
    { name: "GitHub", icon: <Github className="w-3.5 h-3.5" />, href: contactContent?.socials.github ?? "https://github.com/Dani27-design" },
    { name: "LinkedIn", icon: <Linkedin className="w-3.5 h-3.5" />, href: contactContent?.socials.linkedin ?? "https://www.linkedin.com/in/daniansyahchusyaidin/" },
    { name: "Instagram", icon: <Instagram className="w-3.5 h-3.5" />, href: contactContent?.socials.instagram ?? "https://www.instagram.com/danichusyaidin" },
    { name: "WhatsApp", icon: <MessageCircle className="w-3.5 h-3.5" />, href: contactContent?.socials.whatsapp ?? "https://wa.me/6285790428078" },
  ];

  return (
    <footer className="bg-surface border-t border-border/40 relative overflow-hidden">
      <KernelSubstrateGimmick />

      <div className="container-custom py-4 relative z-10 flex items-center justify-between">
        <span className="text-xs text-text-muted/40">
          &copy; {currentYear} {ownerName} · {role}
        </span>
        <div className="flex items-center gap-1">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="w-7 h-7 rounded flex items-center justify-center text-text-muted/30 hover:text-cyan-500 transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
