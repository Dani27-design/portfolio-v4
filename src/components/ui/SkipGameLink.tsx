'use client';

import { useTranslations } from 'next-intl';

export function SkipGameLink() {
  const t = useTranslations('nav');
  return (
    <a href="#work" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-cyan-500 focus:font-mono focus:text-sm focus:font-bold">
      {t('skipGame')}
    </a>
  );
}
