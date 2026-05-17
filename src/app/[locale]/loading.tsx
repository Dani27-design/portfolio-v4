export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
          <div className="h-6 w-48 bg-surface rounded animate-pulse" />
          <div className="h-12 w-full max-w-lg bg-surface rounded animate-pulse" />
          <div className="h-8 w-64 bg-surface rounded animate-pulse" />
          <div className="h-20 w-full max-w-xl bg-surface rounded animate-pulse" />
          <div className="flex gap-4 mt-4">
            <div className="h-12 w-40 bg-surface rounded animate-pulse" />
            <div className="h-12 w-40 bg-surface rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Section skeletons */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="section-padding">
          <div className="container-custom">
            <div className="mb-16">
              <div className="h-10 w-72 bg-surface rounded animate-pulse mb-4" />
              <div className="h-1.5 w-24 bg-surface rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-surface/50 border border-border/20 rounded p-10 space-y-6">
                  <div className="h-4 w-32 bg-border/30 rounded animate-pulse" />
                  <div className="h-6 w-full bg-border/30 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-border/20 rounded animate-pulse" />
                    <div className="h-3 w-4/5 bg-border/20 rounded animate-pulse" />
                    <div className="h-3 w-3/5 bg-border/20 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
