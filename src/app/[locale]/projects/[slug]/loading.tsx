export default function ProjectDetailLoading() {
  return (
    <div className="pb-8 md:pb-14 bg-surface min-h-screen pt-24 md:pt-28">
      <div className="container-custom">
        {/* Back link skeleton */}
        <div className="h-4 w-40 bg-background/50 rounded animate-pulse mb-6" />

        {/* Title skeleton */}
        <div className="mb-6 md:mb-10">
          <div className="h-10 w-full max-w-xl bg-background/50 rounded animate-pulse mb-3" />
          <div className="h-8 w-3/4 bg-background/50 rounded animate-pulse mb-4" />
          <div className="h-4 w-full max-w-2xl bg-background/30 rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-background/30 rounded animate-pulse mb-5" />
          <div className="h-8 w-32 bg-background/50 rounded-lg animate-pulse" />
        </div>

        {/* Media skeleton */}
        <div className="mb-8 md:mb-12 rounded-xl bg-background/50 aspect-video animate-pulse" />

        {/* Tech stack skeleton */}
        <div className="mb-8 md:mb-12">
          <div className="h-4 w-24 bg-background/30 rounded animate-pulse mb-3" />
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-background/40 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="bg-background/50 border border-border/20 rounded-xl p-5 sm:p-8 md:p-12 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              {i % 3 === 0 && <div className="h-6 w-48 bg-border/30 rounded animate-pulse" />}
              <div className="h-4 w-full bg-border/20 rounded animate-pulse" />
              <div className="h-4 w-full bg-border/20 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-border/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
