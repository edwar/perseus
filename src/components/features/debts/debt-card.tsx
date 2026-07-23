import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, Pencil, Trash2 } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/formats"
import type { Debt } from "@/hooks/use-debts"

interface DebtCardProps {
  debt: Debt
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DebtCard({ debt, onEdit, onDelete }: DebtCardProps) {
  const progress = debt.total > 0 ? ((debt.total - debt.remaining) / debt.total) * 100 : 0

  return (
    <Card className="rounded-2xl border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-base">{debt.name}</h3>
            <p className="text-xs text-muted-foreground">{debt.creditor}{debt.category && <span> · {debt.category}</span>}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-red-600">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-bold">{debt.rate}%</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Restante</span>
            <span className="font-bold">{formatCurrency(debt.remaining)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cuota mensual</span>
            <span className="font-semibold">{formatCurrency(debt.monthly)}</span>
          </div>
          {debt.minimum && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pago mínimo</span>
              <span className="font-semibold text-amber-600">{formatCurrency(debt.minimum)}</span>
            </div>
          )}
          {debt.installments && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cuotas</span>
              <span className="font-semibold">{debt.paid} / {debt.installments}</span>
            </div>
          )}
          <div className="h-2.5 rounded-full bg-muted">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <p className="text-xs font-medium text-muted-foreground">{formatPercentage(progress)} pagado</p>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(debt.id)} className="flex-1 gap-1">
            <Pencil className="h-3 w-3" />
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(debt.id)} className="gap-1 text-red-500 hover:text-red-700">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
