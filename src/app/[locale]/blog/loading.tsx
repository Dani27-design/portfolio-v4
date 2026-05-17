export default function BlogLoading() {
  return (
    <div className="section-padding bg-background min-h-screen pt-32">
      <div className="container-custom">
        {/* Back link skeleton */}
        <div className="h-4 w-32 bg-surface rounded animate-pulse mb-12" />

        {/* Header skeleton */}
        <div className="mb-24">
          <div className="h-10 w-80 bg-surface rounded animate-pulse mb-4" />
          <div className="h-1.5 w-24 bg-surface rounded animate-pulse mb-6" />
          <div className="h-4 w-96 bg-surface/50 rounded animate-pulse" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface/50 border border-border/20 p-10 space-y-6">
              <div className="flex justify-between">
                <div className="h-3 w-36 bg-border/30 rounded animate-pulse" />
                <div className="h-5 w-8 bg-border/30 rounded animate-pulse" />
              </div>
              <div className="h-7 w-full bg-border/30 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-border/20 rounded animate-pulse" />
                <div className="h-3 w-full bg-border/20 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-border/20 rounded animate-pulse" />
              </div>
              <div className="pt-6 border-t border-border/20">
                <div className="h-4 w-32 bg-border/30 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
