export default function BlogDetailLoading() {
  return (
    <div className="section-padding bg-background min-h-screen pt-32">
      <div className="container-custom">
        {/* Back link skeleton */}
        <div className="h-4 w-40 bg-surface rounded animate-pulse mb-12" />

        {/* Header skeleton */}
        <div className="mb-16">
          <div className="flex gap-4 mb-8">
            <div className="h-6 w-40 bg-surface rounded animate-pulse" />
            <div className="h-6 w-32 bg-surface rounded animate-pulse" />
          </div>
          <div className="h-12 w-full max-w-2xl bg-surface rounded animate-pulse mb-4" />
          <div className="h-10 w-3/4 bg-surface rounded animate-pulse mb-8" />
          <div className="flex gap-8 pt-8 border-t border-border/20">
            <div className="h-4 w-32 bg-border/30 rounded animate-pulse" />
            <div className="h-4 w-36 bg-border/30 rounded animate-pulse" />
            <div className="h-4 w-40 bg-border/30 rounded animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="bg-surface/50 border border-border/20 p-8 md:p-16 space-y-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              {i % 3 === 0 && <div className="h-7 w-64 bg-border/30 rounded animate-pulse" />}
              <div className="h-4 w-full bg-border/20 rounded animate-pulse" />
              <div className="h-4 w-full bg-border/20 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-border/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
