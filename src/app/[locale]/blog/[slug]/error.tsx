'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BlogDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="font-mono text-[10px] text-red-500 font-black uppercase tracking-[0.4em] mb-6">
        {t('blog.badge')}
      </span>
      <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-main mb-4">
        {t('blog.title')}
      </h1>
      <p className="text-sm text-text-muted max-w-md mb-8 leading-relaxed">
        {t('blog.desc')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
        >
          {t('blog.retry')}
        </button>
        <Link
          href="/blog"
          className="px-8 py-3 border border-border hover:bg-surface text-text-main font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors text-center inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('blog.back')}
        </Link>
      </div>
    </div>
  );
}
