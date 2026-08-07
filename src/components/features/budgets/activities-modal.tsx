import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatPercentage } from "@/lib/formats"
import { useTransactions } from "@/hooks/useData"
import type { Budget } from "@/hooks/use-budgets"

interface ActivitiesModalProps {
  budget: Budget
  onClose: () => void
}

export function ActivitiesModal({ budget, onClose }: ActivitiesModalProps) {
  const { data: transactions = [] } = useTransactions()
  const rawItems = Array.isArray(budget.items) ? budget.items : []
  const items = rawItems.filter((i: { name?: string }) => i.name)

  const spentByActivity = useMemo(() => {
    const map: Record<string, number> = {}
    for (const tx of transactions) {
      if (tx.type !== "EXPENSE" || tx.category !== budget.category || !tx.activity) continue
      map[tx.activity] = (map[tx.activity] ?? 0) + tx.amount
    }
    return map
  }, [transactions, budget.category])

  const totalSpent = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === "EXPENSE" && tx.category === budget.category)
      .reduce((acc, tx) => acc + tx.amount, 0)
  }, [transactions, budget.category])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-lg">{budget.category}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => {
            const spent = spentByActivity[item.name] ?? 0
            const percentage = item.amount > 0 ? (spent / item.amount) * 100 : 0
            const isOverBudget = percentage > 100
            const isNearLimit = percentage >= 80 && percentage <= 100
            const isUnderBudget = percentage < 80

            return (
              <div key={i} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    {isOverBudget && <AlertTriangle className="h-3.5 w-3.5 text-danger" />}
                    {!isOverBudget && !isNearLimit && spent > 0 && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                    {isNearLimit && <TrendingDown className="h-3.5 w-3.5 text-warning" />}
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-sm font-semibold tabular-nums",
                      isOverBudget ? "text-danger" : "text-foreground"
                    )}>
                      {formatCurrency(spent)}
                    </span>
                    <span className="text-xs text-muted-foreground"> / {formatCurrency(item.amount)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isOverBudget
                        ? "bg-danger"
                        : isNearLimit
                          ? "bg-warning"
                          : "bg-success"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={cn(
                    "text-[10px] font-medium",
                    isOverBudget ? "text-danger" : isNearLimit ? "text-warning" : "text-success"
                  )}>
                    {isOverBudget
                      ? `Excedido por ${formatCurrency(spent - item.amount)}`
                      : isNearLimit
                        ? "Casi en el límite"
                        : spent > 0
                          ? `${formatCurrency(item.amount - spent)} restante`
                          : "Sin gastos"
                    }
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold",
                    isOverBudget ? "text-danger" : isNearLimit ? "text-warning" : "text-success"
                  )}>
                    {formatPercentage(percentage)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className={cn(
              "text-xs font-semibold",
              totalSpent > budget.amount ? "text-danger" : "text-foreground"
            )}>
              {formatCurrency(totalSpent)} / {formatCurrency(budget.amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
