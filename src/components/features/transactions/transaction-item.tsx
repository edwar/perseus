import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Repeat, Calendar, TrendingUp, TrendingDown } from "lucide-react"
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
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="border-b border-border/50 last:border-b-0 sm:border-b sm:last:border-b-0">
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
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button variant="ghost" size="icon" onClick={() => onEdit(tx.id)} className="h-8 w-8">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(tx.id)} className="h-8 w-8 text-danger hover:text-danger-hover hover:bg-coral-50">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: swipe-to-reveal actions */}
      <div
        ref={scrollRef}
        className="flex sm:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        <div className="snap-start shrink-0 w-full relative flex items-center py-4 pr-3">
          <div className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-full", isIncome ? "bg-success" : "bg-danger")} />
          <div className="flex items-center gap-3 min-w-0 pl-2">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", isIncome ? "bg-linear-to-br from-success/15 to-success/5 text-success" : "bg-linear-to-br from-danger/15 to-danger/5 text-danger")}>
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
          <div className="shrink-0 pl-3 ml-auto">
            <span className={cn("text-sm font-bold tabular-nums tracking-tight", isIncome ? "text-success" : "text-danger")}>
              {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
            </span>
          </div>
        </div>
        <div className="snap-start shrink-0 flex items-center gap-2 pl-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(tx.id)} className="h-10 w-10 rounded-xl">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(tx.id)} className="h-10 w-10 rounded-xl text-danger hover:text-danger-hover hover:bg-coral-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
