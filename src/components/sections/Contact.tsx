'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { LazyGimmick } from "@/components/ui/LazyGimmick";
import { Github, Linkedin, Instagram, MessageCircle, Send, Copy, Check, Radio, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import type { ContactContent, Locale } from "@/types";

const NeuralBridgeGimmick = dynamic(() => import("@/components/gimmicks/NeuralBridgeGimmick").then(m => ({ default: m.NeuralBridgeGimmick })), { ssr: false });

interface ContactProps {
  contactContent?: ContactContent | null;
  locale?: string;
}

export const Contact = ({ contactContent, locale }: ContactProps = {}) => {
  const t = useTranslations('contact');
  const loc = (locale || 'en') as Locale;

  const headline = contactContent?.headline[loc] ?? t('headline');
  const desc = contactContent?.desc[loc] ?? t('desc');
  const email = contactContent?.email ?? "daniansyah@chusyaidin.engineer";
  const labelTitle = contactContent?.labels.title[loc] ?? t('labels.title');
  const labelPayload = contactContent?.labels.payload[loc] ?? t('labels.payload');
  const placeholderTitle = contactContent?.placeholders.title[loc] ?? t('placeholders.title');
  const placeholderPayload = contactContent?.placeholders.payload[loc] ?? t('placeholders.payload');
  const buttonTransmit = contactContent?.buttons.transmit[loc] ?? t('buttons.transmit');
  const buttonCopyUid = contactContent?.buttons.copyUid[loc] ?? t('buttons.copyUid');

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [activeMode, setActiveMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSend = () => {
    const subject = encodeURIComponent(title || t('fallbackSubject'));
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const socials = [
    { name: "GitHub", icon: <Github className="w-4 h-4" />, href: contactContent?.socials.github ?? "https://github.com/Dani27-design" },
    { name: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, href: contactContent?.socials.linkedin ?? "https://www.linkedin.com/in/daniansyahchusyaidin/" },
    { name: "Instagram", icon: <Instagram className="w-4 h-4" />, href: contactContent?.socials.instagram ?? "https://www.instagram.com/danichusyaidin" },
    { name: "WhatsApp", icon: <MessageCircle className="w-4 h-4" />, href: contactContent?.socials.whatsapp ?? "https://wa.me/6285790428078" },
  ];

  return (
    <section id="contact" className="section-padding bg-background relative overflow-hidden">
      <LazyGimmick><NeuralBridgeGimmick /></LazyGimmick>

        <div className="container-custom max-w-4xl mx-auto relative z-10 px-0 md:px-6">
        <Reveal width="100%">
          <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-8 px-6">
            <h2 className="text-2xl md:text-6xl font-black tracking-tighter text-text-main leading-[1.1]">
              {headline}
            </h2>
            <p className="text-sm md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed text-center">
              {desc}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2} width="100%">
          <div
            onFocus={() => setActiveMode(true)}
            onBlur={() => setActiveMode(false)}
            className="bg-surface/90 border-y md:border border-border/60 md:rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.06)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group/form transition-all duration-700 mx-0 md:mx-0"
          >
            {/* Header Rail */}
            <div className="px-4 md:px-10 py-6 border-b border-border/40 bg-background/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                <div className="w-10 h-10 rounded bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover/form:bg-indigo-500/20 transition-colors shrink-0">
                  <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-text-muted/80 uppercase tracking-wider font-bold">{t('emailLabel')}:</span>
                  <span className="text-sm md:text-base font-mono text-text-main tracking-tight group-hover/form:text-cyan-400 transition-colors break-all md:break-normal">{email}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(email);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-500 uppercase tracking-wider hover:text-cyan-300 transition-all bg-cyan-500/10 px-5 py-2.5 border border-cyan-500/20 rounded-lg w-full md:w-auto"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? t('copied') : buttonCopyUid}
              </button>
            </div>

            {/* Form Area */}
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/20">
               <div className="p-4 md:p-12 space-y-4 md:space-y-12 flex-1">
                <div className="space-y-5 md:space-y-10">
                  <div className="space-y-3 group/input">
                    <label htmlFor="contact-title" className="text-xs font-mono text-text-muted/80 uppercase tracking-wider font-bold block group-focus-within/input:text-cyan-400 transition-colors flex items-center gap-2">
                       <Zap className="w-3 h-3 group-focus-within/input:text-cyan-500" aria-hidden="true" />
                       {labelTitle}
                    </label>
                    <input
                      id="contact-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={placeholderTitle}
                      className="w-full bg-background/50 border border-border/40 rounded-lg px-3 md:px-6 py-3 md:py-4 outline-none focus:border-cyan-500/60 focus:bg-cyan-500/5 transition-all text-sm font-mono placeholder:opacity-20 group-hover/form:border-border/60"
                    />
                  </div>
                  <div className="space-y-3 group/input">
                    <label htmlFor="contact-message" className="text-xs font-mono text-text-muted/60 uppercase tracking-wider font-bold block group-focus-within/input:text-cyan-400 transition-colors flex items-center gap-2">
                       <Radio className="w-3 h-3 group-focus-within/input:text-cyan-500" aria-hidden="true" />
                       {labelPayload}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={placeholderPayload}
                      enterKeyHint="send"
                      className="w-full bg-background/50 border border-border/40 rounded-lg px-3 md:px-6 py-3 md:py-4 outline-none focus:border-cyan-500/60 focus:bg-cyan-500/5 transition-all text-sm font-mono resize-none placeholder:opacity-20 group-hover/form:border-border/60"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  className="w-full py-4 md:py-5 bg-text-main text-background rounded-lg flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider hover:bg-cyan-500 transition-all group/btn active:scale-[0.98] relative overflow-hidden mt-4 lg:mt-0"
                >
                  <Send className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-3 group-hover/btn:-translate-y-3 transition-transform duration-500 relative z-10" />
                  <span className="relative z-10">{buttonTransmit}</span>
                  <div className="absolute inset-x-0 h-full w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-sweep pointer-events-none" />
                </button>
              </div>

              {/* Side Monitor Panel */}
              <div className="w-[300px] bg-background/20 p-8 hidden xl:flex flex-col gap-8 border-l border-border/20">
                 <div className="space-y-4">
                    <span className="font-mono text-xs text-cyan-500 font-bold uppercase tracking-wider flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse inline-block" />
                       {t('diagnostics')}
                    </span>
                    <div className="space-y-2">
                       {[...Array(5)].map((_, i) => (
                         <div key={`diag-proc-${i}`} className="flex justify-between items-center bg-border/10 px-3 py-2 border border-border/30">
                            <div className="w-full h-1 bg-border/20 overflow-hidden">
                               <div
                                 className="h-full w-1/2 bg-cyan-500/40 animate-slide-x"
                                 style={{ animationDuration: `${2 + i * 0.5}s` }}
                               />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

              </div>
            </div>

            {/* Footer Rail */}
            <div className="px-6 md:px-10 py-4 md:py-6 border-t border-border/40 bg-background/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse"></span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-text-muted/80 uppercase tracking-wider font-bold leading-none">{t('responseTimeLabel')}:</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mt-1">{t('responseTimeValue')}</span>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <div className="w-16 h-1.5 bg-border/10 rounded-full overflow-hidden">
                   <div className="h-full w-[85%] bg-indigo-500/40" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Social Bridge */}
        <Reveal delay={0.4} width="100%">
          <div className="mt-8 md:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-10 px-4 md:px-0">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.name} (opens in new tab)`}
                className="flex flex-col items-center justify-center p-4 md:p-6 bg-surface/30 border border-border/20 rounded-xl gap-2 md:gap-3 text-xs font-bold text-text-muted uppercase tracking-wider hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group/social"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border/40 flex items-center justify-center group-hover/social:border-cyan-500/40 group-hover/social:bg-cyan-500/10 transition-all shrink-0"
                >
                  <span className="opacity-60 group-hover/social:opacity-100 group-hover/social:text-cyan-500 transition-all">{social.icon}</span>
                </motion.div>
                <span className="opacity-40 group-hover/social:opacity-100">{social.name}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
