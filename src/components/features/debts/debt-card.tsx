import { Button } from "@/components/ui/button"
import { TrendingDown, Pencil, Trash2, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatPercentage } from "@/lib/formats"
import type { Debt } from "@/hooks/use-debts"

interface DebtCardProps {
  debt: Debt
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DebtCard({ debt, onEdit, onDelete }: DebtCardProps) {
  const progress = debt.total > 0 ? ((debt.total - debt.remaining) / debt.total) * 100 : 0
  const isPaidOff = debt.remaining <= 0

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
      isPaidOff ? "border-success/30" : "border-warning/20"
    )}>
      {/* Colored top accent */}
      <div className={cn(
        "h-1 w-full",
        isPaidOff
          ? "bg-linear-to-r from-success to-emerald-400"
          : "bg-linear-to-r from-warning to-flame-400"
      )} />

      {/* Subtle hover gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-warning/5 to-transparent" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              isPaidOff
                ? "bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25"
                : "bg-linear-to-br from-warning to-orange-600 text-white shadow-md shadow-warning/25"
            )}>
              <TrendingDown className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm leading-tight truncate">{debt.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{debt.creditor}{debt.category && ` · ${debt.category}`}</p>
            </div>
          </div>
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shrink-0",
            isPaidOff ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          )}>
            {debt.rate}%
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Restante</span>
            <span className="text-sm font-bold tabular-nums">{formatCurrency(debt.remaining)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Cuota mensual</span>
            <span className="text-sm font-semibold tabular-nums">{formatCurrency(debt.monthly)}</span>
          </div>
          {debt.minimum && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Pago mínimo</span>
              <span className="text-sm font-semibold tabular-nums text-warning">{formatCurrency(debt.minimum)}</span>
            </div>
          )}
          {debt.installments && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Cuotas
              </span>
              <span className="text-sm font-semibold tabular-nums">{debt.paid} / {debt.installments}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground">Progreso</span>
            <span className={cn(
              "text-[11px] font-bold",
              isPaidOff ? "text-success" : "text-warning"
            )}>{formatPercentage(progress)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isPaidOff
                  ? "bg-linear-to-r from-success to-emerald-400"
                  : "bg-linear-to-r from-warning to-flame-400"
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
          <Button variant="outline" size="sm" onClick={() => onEdit(debt.id)} className="flex-1 gap-1 h-9">
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(debt.id)} className="h-9 w-9 text-danger hover:text-danger-hover hover:bg-coral-50">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
