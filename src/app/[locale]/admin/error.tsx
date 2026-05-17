'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <span className="font-mono text-[10px] text-red-500 font-black uppercase tracking-[0.3em] mb-4">
        ADMIN_ERROR
      </span>
      <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        An error occurred in the admin panel. This may be a temporary issue with the database connection.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold uppercase tracking-wider rounded transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
