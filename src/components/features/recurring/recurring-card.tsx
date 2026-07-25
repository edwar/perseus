import { Button } from "@/components/ui/button"
import { Repeat, ArrowUp, ArrowDown, Pencil, Trash2, Calendar } from "lucide-react"
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
  const isIncome = item.type === "INCOME"

  return (
    <div className={cn(
      "group relative rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden",
      isIncome ? "border-success/20" : "border-danger/20"
    )}>
      {/* Colored left accent — uses inner div to avoid border-radius clipping */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
        isIncome ? "bg-success" : "bg-danger"
      )} />

      {/* Subtle gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        isIncome
          ? "bg-linear-to-br from-success/5 to-transparent"
          : "bg-linear-to-br from-danger/5 to-transparent"
      )} />

      <div className="relative p-4 sm:p-5 pl-5 sm:pl-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              isIncome
                ? "bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25"
                : "bg-linear-to-br from-danger to-coral-600 text-white shadow-md shadow-danger/25"
            )}>
              {isIncome
                ? <ArrowDown className="h-5 w-5" />
                : <ArrowUp className="h-5 w-5" />
              }
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm leading-tight truncate">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.category}</p>
            </div>
          </div>
          <p className={cn(
            "text-base sm:text-lg font-extrabold tracking-tight shrink-0",
            isIncome ? "text-success" : "text-danger"
          )}>
            {isIncome ? "+" : "-"}{formatCurrency(item.amount)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              isIncome
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            )}>
              <Repeat className="h-3 w-3" />
              {FREQ_LABELS[item.frequency] ?? item.frequency}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Día {item.dayOfMonth}
            </span>
          </div>
          <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)} className="h-8 w-8">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="h-8 w-8 text-danger hover:text-danger-hover hover:bg-coral-50">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
