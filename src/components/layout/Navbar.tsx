'use client';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, Sun, Moon, Languages, Terminal, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useTheme } from "@/context/ThemeProvider";
import type { NavbarContent, Locale } from "@/types";

const QuantumSyncGimmick = dynamic(() => import("@/components/gimmicks/QuantumSyncGimmick").then(m => ({ default: m.QuantumSyncGimmick })), { ssr: false });
const MobileMenuGimmick = dynamic(() => import("@/components/gimmicks/MobileMenuGimmick").then(m => ({ default: m.MobileMenuGimmick })), { ssr: false });

interface NavbarProps {
  navbarContent?: NavbarContent | null;
  locale?: string;
}

export const Navbar = ({ navbarContent, locale: localeProp }: NavbarProps = {}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme, isCodeMode, toggleCodeMode } = useTheme();
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const overlay = document.querySelector('[data-menu-overlay]');
      if (!overlay) return;

      const focusable = overlay.querySelectorAll<HTMLElement>(
        'button, a, input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const toggleLang = () => {
    const newLocale = locale === "en" ? "id" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const loc = (localeProp || locale) as Locale;

  const navLinks = [
    { name: navbarContent?.labels.about[loc] ?? t('about'), href: '/#about', code: "01" },
    { name: navbarContent?.labels.stack[loc] ?? t('stack'), href: '/#skills', code: "02" },
    { name: navbarContent?.labels.experience[loc] ?? t('experience'), href: '/#work', code: "03" },
    { name: navbarContent?.labels.projects[loc] ?? t('projects'), href: '/#projects', code: "04" },
    { name: navbarContent?.labels.blog[loc] ?? t('blog'), href: '/#blog', code: "05" },
    { name: navbarContent?.labels.contact[loc] ?? t('contact'), href: '/#contact', code: "06" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-[height,border-color,background-color,box-shadow] duration-500 border-b overflow-hidden ${
          isScrolled
            ? "h-16 border-border/80 bg-background/98 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "h-20 border-white/5 bg-background/30"
        }`}
      >
        <QuantumSyncGimmick isScrolled={isScrolled} />

        <div className="container-custom h-full flex items-center relative z-10">
          {/* Section 1: Brand (Left) */}
          <Link href="/" className="flex-[1] flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-text-main text-background flex items-center justify-center font-black text-lg select-none group-hover:scale-105 transition-transform shrink-0">DC</div>
            <div className="hidden sm:flex flex-col justify-center">
              <span className="font-black tracking-tighter text-lg uppercase leading-none group-hover:text-cyan-400 transition-colors whitespace-nowrap">Daniansyah</span>
            </div>
          </Link>

          {/* Section 2: Core Navigation (Center) */}
          <div className="hidden lg:flex flex-[2] justify-center">
            <div className="flex items-center space-x-10 text-[10px] font-mono font-black tracking-[0.2em] text-text-muted uppercase">
              {navLinks.map((link) => {
                const isHomePage = pathname === '/';
                const hash = link.href.replace('/', '');

                if (isHomePage) {
                  return (
                    <a
                      key={link.code}
                      href={hash}
                      className="hover:text-cyan-400 transition-all duration-300 relative group"
                    >
                      <span className="opacity-20 group-hover:opacity-100 transition-opacity mr-1.5">[</span>
                      {link.name}
                      <span className="opacity-20 group-hover:opacity-100 transition-opacity ml-1.5">]</span>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        className="absolute -bottom-1 left-0 w-full h-[1px] bg-cyan-500/40 origin-left"
                      />
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.code}
                    href={link.href}
                    className="hover:text-cyan-400 transition-all duration-300 relative group"
                  >
                    <span className="opacity-20 group-hover:opacity-100 transition-opacity mr-1.5">[</span>
                    {link.name}
                    <span className="opacity-20 group-hover:opacity-100 transition-opacity ml-1.5">]</span>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      className="absolute -bottom-1 left-0 w-full h-[1px] bg-cyan-500/40 origin-left"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 3: Operations Module (Right) */}
          <div className="flex-[1] flex justify-end items-center gap-4">
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-white/5">
              <button
                onClick={toggleCodeMode}
                className={`p-2 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                  isCodeMode ? "text-cyan-500 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "text-text-muted hover:text-cyan-500 hover:bg-white/5"
                }`}
                aria-label="Toggle code mode"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="text-[8px] font-mono font-black uppercase">CODE</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-text-muted hover:text-cyan-500 hover:bg-white/5 rounded-full transition-all duration-300 flex items-center gap-1.5"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span className="text-[8px] font-mono font-black uppercase">{theme.toUpperCase()}</span>
              </button>

              <button
                onClick={toggleLang}
                className="p-2 text-text-muted hover:text-cyan-500 hover:bg-white/5 rounded-full transition-all duration-300 flex items-center gap-1"
                aria-label="Switch language"
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="text-[8px] font-mono font-black">{locale.toUpperCase()}</span>
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={toggleCodeMode}
                  className={`p-2 transition-colors flex items-center gap-1.5 ${
                    isCodeMode ? "text-cyan-500" : "text-text-muted hover:text-cyan-500"
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span className="text-[8px] font-mono font-black uppercase hidden sm:inline">CODE</span>
                </button>
                <button
                  onClick={toggleLang}
                  className="p-2 text-text-muted hover:text-cyan-500 transition-colors flex items-center gap-1.5"
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-[8px] font-mono font-black hidden sm:inline">{locale.toUpperCase()}</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-text-muted hover:text-cyan-500 transition-colors flex items-center gap-1.5"
                >
                  {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className="text-[8px] font-mono font-black uppercase hidden sm:inline">{theme.toUpperCase()}</span>
                </button>
              </div>

              <button
                className="p-2 text-text-main hover:bg-white/5 transition-colors border border-white/5 md:hidden flex flex-col gap-1 items-end overflow-hidden group"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <div className="w-6 h-0.5 bg-text-main group-hover:w-4 transition-all" />
                <div className="w-4 h-0.5 bg-text-main group-hover:w-6 transition-all" />
                <div className="w-5 h-0.5 bg-text-main group-hover:w-5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 bg-[#0f1115] text-white z-[60] flex flex-col p-8 overflow-hidden"
            data-menu-overlay
          >
            <MobileMenuGimmick />

            {/* Header in Overlay */}
            <div className="flex justify-between items-center relative z-20">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-cyan-500" />
                <span className="font-mono text-[10px] text-white font-black tracking-widest uppercase">NAV_TERMINAL</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleCodeMode}
                  className={`p-2 rounded-full transition-all duration-300 ${isCodeMode ? "text-cyan-500 bg-cyan-500/10" : "text-white/60"}`}
                  aria-label="Toggle code mode"
                >
                  <Code2 className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-white/60 hover:text-white rounded-full transition-all duration-300"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleLang}
                  className="p-2 text-white/60 hover:text-white rounded-full transition-all duration-300"
                  aria-label="Switch language"
                >
                  <Languages className="w-5 h-5" />
                </button>
                <button
                  className="p-3 text-white hover:bg-white/5 rounded-full transition-colors border border-white/5 ml-2"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-cyan-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-10 relative z-20 overflow-y-auto">
              {navLinks.map((link, i) => {
                const isHomePage = pathname === '/';
                const hash = link.href.replace('/', '');

                const linkContent = (
                  <>
                    <span className="font-mono text-xs text-cyan-500/40 mb-2 font-bold select-none">{link.code}</span>
                    <div className="flex flex-col">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors flex items-center gap-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        {link.name}
                        <div className="w-0 h-[2px] bg-cyan-500 group-hover:w-12 transition-all duration-500 hidden sm:block" />
                      </span>
                    </div>
                  </>
                );

                return (
                  <motion.div
                    key={link.code}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i + 0.2 }}
                  >
                    {isHomePage ? (
                      <a
                        href={hash}
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-end gap-6"
                      >
                        {linkContent}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-end gap-6"
                      >
                        {linkContent}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
