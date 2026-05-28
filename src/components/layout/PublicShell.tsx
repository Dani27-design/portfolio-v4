'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import type { ReactNode } from 'react';
import type { NavbarContent, FooterContent } from '@/types';

interface PublicShellProps {
  children: ReactNode;
  navbarContent?: NavbarContent | null;
  footerContent?: FooterContent | null;
  locale?: string;
}

export function PublicShell({ children, navbarContent, footerContent, locale }: PublicShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div id="top" className="min-h-screen selection:bg-blue-100 selection:text-primary transition-colors duration-300">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-background focus:text-cyan-500 focus:border focus:border-cyan-500/40 focus:font-mono focus:text-sm focus:font-bold focus:uppercase focus:tracking-widest">
        Skip to main content
      </a>
      <CustomCursor />
      <ScrollToTop />
      <ScrollProgress />
      <Navbar navbarContent={navbarContent} locale={locale} />
      <main id="main-content">{children}</main>
      <Footer footerContent={footerContent} locale={locale} />
    </div>
  );
}
