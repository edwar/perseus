import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Repeat, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formats"
import type { Transaction } from "@/hooks/use-transactions"

interface TransactionItemProps {
  tx: Transaction
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function TransactionItem({ tx, onEdit, onDelete }: TransactionItemProps) {
  return (
    <div className={cn(
      "flex items-center justify-between px-6 py-3.5 transition-colors duration-150 hover:bg-muted/40",
      tx.type === "INCOME" ? "border-l-2 border-l-emerald-500/60" : "border-l-2 border-l-red-500/60"
    )}>
      <div className="flex items-center gap-3">
        {tx.recurring && (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
            <Repeat className="h-3.5 w-3.5 text-amber-600" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium">{tx.description}</p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-medium rounded-md">
              {tx.category || (tx.type === "INCOME" ? "Ingreso" : "Gasto")}
            </Badge>
            <span>·</span>
            <span>{tx.date}</span>
            {tx.recurring && tx.nextDate && (
              <Badge variant="outline" className="flex items-center gap-0.5 border-amber-200 text-amber-600">
                <Calendar className="h-3 w-3" />
                Próximo: {tx.nextDate}
              </Badge>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-sm font-semibold tabular-nums",
          tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"
        )}>
          {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
        </span>
        <Button variant="ghost" size="icon-xs" onClick={() => onEdit(tx.id)}>
          <Pencil className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon-xs" onClick={() => onDelete(tx.id)} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
