export function BudgetsLoadingSkeleton() {
  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-between mt-10 md:hidden">
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <div className="h-9 w-24 animate-shimmer rounded-lg bg-muted" />
      </div>

      {/* Summary Skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-card border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                <div className="h-5 w-24 animate-shimmer rounded bg-muted-foreground/15" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 animate-shimmer rounded bg-muted-foreground/15" />
        <div className="h-9 w-24 animate-shimmer rounded-lg bg-muted-foreground/15" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <div className="h-1 w-full animate-shimmer bg-muted-foreground/15" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 shrink-0 animate-shimmer rounded-full bg-muted-foreground/15" />
                  <div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/25" />
                </div>
                <div className="h-5 w-14 animate-shimmer rounded-full bg-muted-foreground/15" />
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <div className="h-7 w-28 animate-shimmer rounded bg-muted-foreground/15" />
                <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/10" />
              </div>
              <div className="mb-1">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-3 w-10 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
                <div className="h-2 rounded-full animate-shimmer bg-muted-foreground/15" />
              </div>
              <div className="mt-4 space-y-2 pt-3 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-2.5 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-3 w-14 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                <div className="flex-1 h-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
                <div className="h-9 w-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
