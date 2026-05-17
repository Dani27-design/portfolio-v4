'use client';

import { Link } from '@/i18n/navigation';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="font-mono text-[10px] text-red-500 font-black uppercase tracking-[0.4em] mb-6">
        ERROR :: PAGE_FAULT
      </span>
      <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-main mb-4">
        Something went wrong
      </h1>
      <p className="text-sm text-text-muted max-w-md mb-8 leading-relaxed">
        An error occurred while loading this page. You can try again or navigate back to the homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-3 border border-border hover:bg-surface text-text-main font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
