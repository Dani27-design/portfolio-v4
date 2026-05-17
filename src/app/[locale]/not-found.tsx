import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="font-mono text-[10px] text-indigo-500 font-black uppercase tracking-[0.4em] mb-6">
        404 :: ROUTE_NOT_FOUND
      </span>
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-text-main mb-4">
        Page not found
      </h1>
      <p className="text-sm text-text-muted max-w-md mb-8 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-text-main text-background font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
