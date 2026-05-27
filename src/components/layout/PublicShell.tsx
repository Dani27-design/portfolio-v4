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
      <CustomCursor />
      <ScrollToTop />
      <ScrollProgress />
      <Navbar navbarContent={navbarContent} locale={locale} />
      <main>{children}</main>
      <Footer footerContent={footerContent} locale={locale} />
    </div>
  );
}
