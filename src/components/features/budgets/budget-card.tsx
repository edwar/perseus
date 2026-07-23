import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/formats"
import type { Budget } from "@/hooks/use-budgets"

interface BudgetCardProps {
  budget: Budget
  spent: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onViewActivities: (budget: Budget) => void
}

export function BudgetCard({ budget, spent, onEdit, onDelete, onViewActivities }: BudgetCardProps) {
  const percentage = (spent / budget.amount) * 100
  const isOverBudget = percentage >= 100
  const rawItems = Array.isArray(budget.items) ? budget.items : []
  const budgetItems = rawItems.filter((i: { name?: string }) => i.name)

  return (
    <Card className="rounded-2xl border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col">
      <CardContent className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-4 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: budget.color }} />
            <h3 className="font-bold text-base">{budget.category}</h3>
          </div>
          <span className={`text-sm font-bold ${isOverBudget ? "text-red-600" : ""}`}>
            {formatCurrency(spent)} / {formatCurrency(budget.amount)}
          </span>
        </div>

        <div className="mt-3 h-2.5 rounded-full bg-muted">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? "bg-gradient-to-r from-red-400 to-red-600" : "bg-gradient-to-r from-primary/80 to-primary"}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs font-medium text-muted-foreground">{formatPercentage(percentage)} usado</p>

        {budgetItems.length > 0 && (
          <div className="mt-3 space-y-1.5 border-t pt-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actividades</p>
            {budgetItems.slice(0, 2).map((item, i) => {
              const itemPct = (item.amount / budget.amount) * 100
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">{formatCurrency(item.amount)} ({formatPercentage(itemPct)})</span>
                </div>
              )
            })}
            {budgetItems.length > 2 && (
              <button type="button" onClick={() => onViewActivities(budget)} className="text-xs text-primary hover:underline mt-1">
                Ver todas ({budgetItems.length})
              </button>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(budget.id)} className="flex-1 gap-1">
            <Pencil className="h-3 w-3" /> Editar
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(budget.id)} className="gap-1 text-red-500 hover:text-red-700">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
