import { Card } from "@/components/ui/card"

export function TransactionsLoadingSkeleton() {
  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-between mt-10 md:hidden">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <div className="h-9 w-24 animate-shimmer rounded-lg bg-muted" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-card border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-14 animate-shimmer rounded bg-muted-foreground/15" />
                <div className="h-5 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                {i === 4 && <div className="h-2.5 w-20 animate-shimmer rounded bg-muted-foreground/10" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-full animate-shimmer rounded-xl bg-muted/80" />
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
          <div className="flex-1 h-9 animate-shimmer rounded-lg bg-card shadow-sm" />
          <div className="flex-1 h-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
          <div className="flex-1 h-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
        </div>
      </div>

      {/* Transaction List Skeleton */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-border/50 last:border-b-0">
            <div className="flex items-center gap-3.5 pl-2">
              <div className="h-10 w-10 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-shimmer rounded bg-muted-foreground/25" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 animate-shimmer rounded-md bg-muted-foreground/15" />
                  <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
              </div>
            </div>
            <div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/20" />
          </div>
        ))}
      </div>
    </div>
  )
}
