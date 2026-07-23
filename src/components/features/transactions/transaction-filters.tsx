import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "all" | "recurring" | "occasional"

const TAB_LABELS: Record<Tab, string> = {
  all: "Todas",
  recurring: "Recurrentes",
  occasional: "Ocasionales",
}

interface TransactionFiltersProps {
  search: string
  tab: Tab
  onSearchChange: (value: string) => void
  onTabChange: (tab: Tab) => void
}

export function TransactionFilters({ search, tab, onSearchChange, onTabChange }: TransactionFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar transacciones..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-muted/50 border-transparent focus:bg-card focus:border-border focus:ring-1 focus:ring-primary/20 h-10 rounded-xl"
        />
      </div>
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
              tab === t
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  )
}

export type { Tab }
