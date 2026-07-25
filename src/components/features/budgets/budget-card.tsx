import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, AlertTriangle, CheckCircle2, List } from "lucide-react"
import { cn } from "@/lib/utils"
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
  const isNearLimit = percentage >= 80 && percentage < 100
  const remaining = Math.max(0, budget.amount - spent)
  const rawItems = Array.isArray(budget.items) ? budget.items : []
  const budgetItems = rawItems.filter((i: { name?: string }) => i.name)

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col",
      isOverBudget ? "border-danger/30" : isNearLimit ? "border-warning/30" : "border-border"
    )}>
      {/* Top accent */}
      <div className={cn(
        "h-1 w-full",
        isOverBudget
          ? "bg-linear-to-r from-danger to-coral-400"
          : isNearLimit
            ? "bg-linear-to-r from-warning to-flame-400"
            : "bg-linear-to-r from-primary to-blue-400"
      )} />

      {/* Hover gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-primary/5 to-transparent" />

      <div className="relative p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-4 w-4 shrink-0 rounded-full shadow-md ring-2 ring-white"
              style={{ backgroundColor: budget.color }}
            />
            <h3 className="font-bold text-sm leading-tight truncate">{budget.category}</h3>
          </div>
          {isOverBudget && (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger shrink-0">
              <AlertTriangle className="h-3 w-3" /> Excedido
            </span>
          )}
          {!isOverBudget && !isNearLimit && percentage > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success shrink-0">
              <CheckCircle2 className="h-3 w-3" /> OK
            </span>
          )}
        </div>

        {/* Amounts */}
        <div className="flex items-baseline justify-between mb-3">
          <span className={cn(
            "text-xl font-extrabold tracking-tight tabular-nums",
            isOverBudget ? "text-danger" : "text-foreground"
          )}>
            {formatCurrency(spent)}
          </span>
          <span className="text-xs text-muted-foreground font-medium">/ {formatCurrency(budget.amount)}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground">
              {isOverBudget ? "Excedido" : `${formatCurrency(remaining)} restante`}
            </span>
            <span className={cn(
              "text-[11px] font-bold",
              isOverBudget ? "text-danger" : isNearLimit ? "text-warning" : "text-primary"
            )}>{formatPercentage(percentage)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isOverBudget
                  ? "bg-linear-to-r from-danger to-coral-400"
                  : isNearLimit
                    ? "bg-linear-to-r from-warning to-flame-400"
                    : "bg-linear-to-r from-primary to-blue-400"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Activities */}
        {budgetItems.length > 0 && (
          <div className="mt-4 space-y-2 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <List className="h-3 w-3 text-muted-foreground" />
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actividades</p>
            </div>
            {budgetItems.slice(0, 2).map((item, i) => {
              const itemPct = (item.amount / budget.amount) * 100
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">{item.name}</span>
                  <span className="font-semibold tabular-nums shrink-0 ml-2">{formatCurrency(item.amount)}</span>
                </div>
              )
            })}
            {budgetItems.length > 2 && (
              <button type="button" onClick={() => onViewActivities(budget)} className="text-xs text-primary hover:underline font-medium mt-1">
                Ver todas ({budgetItems.length})
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
          <Button variant="outline" size="sm" onClick={() => onEdit(budget.id)} className="flex-1 gap-1 h-9">
            <Pencil className="h-3.5 w-3.5" /> Editar
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(budget.id)} className="h-9 w-9 text-danger hover:text-danger-hover hover:bg-coral-50">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
