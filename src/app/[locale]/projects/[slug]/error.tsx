'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="font-mono text-xs text-red-500 font-bold uppercase tracking-widest mb-6">
        {t('project.badge')}
      </span>
      <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-main mb-4">
        {t('project.title')}
      </h1>
      <p className="text-sm text-text-muted max-w-md mb-8 leading-relaxed">
        {t('project.desc')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
        >
          {t('project.retry')}
        </button>
        <Link
          href="/projects"
          className="px-8 py-3 border border-border hover:bg-surface text-text-main font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors text-center inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('project.back')}
        </Link>
      </div>
    </div>
  );
}
