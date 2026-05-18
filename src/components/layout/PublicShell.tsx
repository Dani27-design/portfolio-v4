'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import type { ReactNode } from 'react';

export function PublicShell({ children }: { children: ReactNode }) {
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
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
