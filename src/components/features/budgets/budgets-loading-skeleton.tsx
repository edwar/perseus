import { Card, CardContent } from "@/components/ui/card"

export function BudgetsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-10 md:hidden">
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <div className="h-9 w-24 animate-shimmer rounded-lg bg-muted" />
      </div>
      <div className="h-14 w-full animate-shimmer rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-0 shadow-md transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-4 w-4 rounded-full animate-shimmer bg-muted-foreground/20" />
                  <div className="h-4 w-28 rounded animate-shimmer bg-muted-foreground/20" />
                </div>
                <div className="h-4 w-32 rounded animate-shimmer bg-muted-foreground/20" />
              </div>
              <div className="mt-3 h-2.5 rounded-full animate-shimmer bg-muted-foreground/20" />
              <div className="mt-1.5 h-3 w-16 rounded animate-shimmer bg-muted-foreground/20" />
              <div className="mt-3 space-y-2 border-t pt-3">
                <div className="h-2 w-20 rounded animate-shimmer bg-muted-foreground/20" />
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 rounded animate-shimmer bg-muted-foreground/20" />
                  <div className="h-3 w-20 rounded animate-shimmer bg-muted-foreground/20" />
                </div>
                <div className="h-3 w-24 rounded animate-shimmer bg-muted-foreground/20" />
                <div className="h-3 w-24 rounded animate-shimmer bg-muted-foreground/20" />
                <div className="h-3 w-20 rounded bg-primary/30" />
              </div>
              <div className="mt-auto pt-3 flex gap-2">
                <div className="flex-1 h-9 rounded-lg animate-shimmer bg-muted-foreground/20" />
                <div className="h-9 w-10 rounded-lg animate-shimmer bg-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
