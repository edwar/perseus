import { useBalanceStore } from "@/store/balance-store"
import { formatCurrency } from "@/lib/formats"
import type { Budget } from "@/hooks/use-budgets"

interface BudgetSummaryProps {
  budgets: Budget[]
}

export function BudgetSummary({ budgets }: BudgetSummaryProps) {
  const totalBalance = useBalanceStore((s) => s.balance)
  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0)

  return (
    <div className="rounded-2xl border-0 bg-card p-4 text-sm text-muted-foreground shadow-md transition-shadow hover:shadow-lg">
      Presupuesto total estimado:{" "}
      <span className="font-semibold text-foreground">{formatCurrency(totalBudget)}</span>
      {totalBalance > 0 && (
        <>
          {" de "}
          <span className="font-semibold text-foreground">{formatCurrency(totalBalance)}</span>
          {" — Disponible "}
          <span className="font-semibold text-foreground">{formatCurrency(totalBalance - totalBudget)}</span>
        </>
      )}
    </div>
  )
}
