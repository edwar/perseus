import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Repeat, Calendar, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formats"
import type { Transaction } from "@/hooks/use-transactions"

interface TransactionItemProps {
  tx: Transaction
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function TransactionItem({ tx, onEdit, onDelete }: TransactionItemProps) {
  const isIncome = tx.type === "INCOME"
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="border-b border-border/50 last:border-b-0">
      {/* Desktop: hover-based actions */}
      <div className="group relative hidden sm:flex items-center justify-between px-5 py-4 transition-all duration-200 hover:bg-muted/30 min-w-0">
        <div className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-full", isIncome ? "bg-success" : "bg-danger")} />
        <div className="flex items-center gap-3.5 min-w-0 pl-2">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110", isIncome ? "bg-linear-to-br from-success/15 to-success/5 text-success" : "bg-linear-to-br from-danger/15 to-danger/5 text-danger")}>
            {tx.recurring ? <Repeat className="h-4.5 w-4.5" /> : isIncome ? <TrendingUp className="h-4.5 w-4.5" /> : <TrendingDown className="h-4.5 w-4.5" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{tx.description}</p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", isIncome ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                {tx.category || (isIncome ? "Ingreso" : "Gasto")}
              </span>
              <span className="text-[11px] text-muted-foreground">{tx.date}</span>
              {tx.recurring && tx.nextDate && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-warning border border-orange-200/50">
                  <Calendar className="h-2.5 w-2.5" />{tx.nextDate}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 pl-3">
          <span className={cn("text-sm font-bold tabular-nums tracking-tight", isIncome ? "text-success" : "text-danger")}>
            {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
          </span>
          <div className="flex gap-0.5 transition-opacity duration-200">
            <Button variant="ghost" size="icon" onClick={() => onEdit(tx.id)} className="h-8 w-8 text-primary">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(tx.id)} className="h-8 w-8 text-danger hover:text-danger-hover hover:bg-coral-50">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: tap to show actions */}
      <div className="sm:hidden relative">
        <div
          className={cn(
            "relative flex items-center justify-between px-4 py-3 transition-all duration-200 min-w-0",
            showActions ? "bg-muted/30" : "active:bg-muted/30"
          )}
          onClick={() => !showActions && setShowActions(true)}
        >
          <div className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-full", isIncome ? "bg-success" : "bg-danger")} />
          <div className="flex items-center gap-2.5 min-w-0 pl-2">
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", isIncome ? "bg-linear-to-br from-success/15 to-success/5 text-success" : "bg-linear-to-br from-danger/15 to-danger/5 text-danger")}>
              {tx.recurring ? <Repeat className="h-4 w-4" /> : isIncome ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate max-w-[180px]">{tx.description}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", isIncome ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                  {tx.category || (isIncome ? "Ingreso" : "Gasto")}
                </span>
                <span className="text-[11px] text-muted-foreground">{tx.date}</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 pl-2 flex items-center gap-1.5">
            <span className={cn("text-xs font-bold tabular-nums tracking-tight", isIncome ? "text-success" : "text-danger")}>
              {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setShowActions(!showActions) }}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/50 active:bg-muted transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Actions panel */}
        {showActions && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20 border-t border-border/30">
            <Button variant="ghost" size="sm" onClick={() => { onEdit(tx.id); setShowActions(false) }} className="gap-1.5 h-8 text-xs">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { onDelete(tx.id); setShowActions(false) }} className="gap-1.5 h-8 text-xs text-danger hover:text-danger-hover hover:bg-coral-50">
              <Trash2 className="h-3.5 w-3.5" /> Eliminar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowActions(false)} className="ml-auto h-8 text-xs">
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
