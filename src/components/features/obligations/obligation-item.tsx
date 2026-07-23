import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ObligationItemProps {
  obligation: { id: string; name: string }
  isPaid: boolean
  onTogglePaid: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ObligationItem({ obligation, isPaid, onTogglePaid, onEdit, onDelete }: ObligationItemProps) {
  return (
    <Card className={isPaid ? "opacity-60" : ""}>
      <CardContent className="flex items-center gap-3 py-3 px-4">
        <button
          onClick={() => onTogglePaid(obligation.id)}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isPaid ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {isPaid && <Check className="h-3.5 w-3.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", isPaid && "line-through")}>{obligation.name}</p>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={() => onEdit(obligation.id)}>
          <Pencil className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon-xs" onClick={() => onDelete(obligation.id)} className="text-red-500">
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  )
}
