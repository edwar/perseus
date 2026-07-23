import { Card } from "@/components/ui/card"

export function TransactionsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-10 md:hidden">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <div className="h-9 w-24 animate-shimmer rounded-lg bg-muted" />
      </div>
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 bg-muted-foreground/30 rounded" />
          <div className="h-10 w-full animate-shimmer rounded-xl bg-muted/80 border border-border/50" />
        </div>
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
          <div className="flex-1 h-9 animate-shimmer rounded-lg bg-card shadow-sm" />
          <div className="flex-1 h-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
          <div className="flex-1 h-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
        </div>
      </div>
      <Card>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-shimmer rounded-full bg-muted-foreground/20" />
                <div className="space-y-1.5">
                  <div className="h-3 w-32 animate-shimmer rounded bg-muted-foreground/25" />
                  <div className="h-2.5 w-24 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
              </div>
              <div className="h-4 w-20 animate-shimmer rounded bg-muted-foreground/20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
