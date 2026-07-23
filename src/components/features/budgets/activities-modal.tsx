import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/formats"
import type { Budget } from "@/hooks/use-budgets"

interface ActivitiesModalProps {
  budget: Budget
  onClose: () => void
}

export function ActivitiesModal({ budget, onClose }: ActivitiesModalProps) {
  const rawItems = Array.isArray(budget.items) ? budget.items : []
  const items = rawItems.filter((i: { name?: string }) => i.name)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-lg">{budget.category}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => {
            const itemPct = (item.amount / budget.amount) * 100
            return (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm font-semibold">{formatCurrency(item.amount)} ({formatPercentage(itemPct)})</span>
              </div>
            )
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Total: {formatCurrency(items.reduce((s, i) => s + i.amount, 0))} / {formatCurrency(budget.amount)}
        </p>
      </div>
    </div>
  )
}
