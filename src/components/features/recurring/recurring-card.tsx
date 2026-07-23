import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Repeat, ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formats"
import { FREQ_LABELS } from "@/lib/constants"
import type { RecurringItem } from "@/hooks/use-recurring"

interface RecurringCardProps {
  item: RecurringItem
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function RecurringCard({ item, onEdit, onDelete }: RecurringCardProps) {
  return (
    <Card key={item.id} size="sm">
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              item.type === "INCOME" ? "bg-emerald-100" : "bg-red-100"
            )}>
              {item.type === "INCOME"
                ? <ArrowDown className="h-5 w-5 text-emerald-600" />
                : <ArrowUp className="h-5 w-5 text-red-600" />
              }
            </div>
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
          </div>
          <span className={cn(
            "text-lg font-bold",
            item.type === "INCOME" ? "text-emerald-600" : "text-red-600"
          )}>
            {item.type === "INCOME" ? "+" : "-"}{formatCurrency(item.amount)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Repeat className="h-3 w-3" />
              {FREQ_LABELS[item.frequency] ?? item.frequency}
            </span>
            <span>Día {item.dayOfMonth}</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
