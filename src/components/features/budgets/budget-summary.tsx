import { useMemo } from "react"
import { DollarSign, TrendingDown, Wallet } from "lucide-react"
import { formatCurrency } from "@/lib/formats"
import type { Budget } from "@/hooks/use-budgets"
import type { Transaction } from "@/hooks/use-transactions"

interface BudgetSummaryProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export function BudgetSummary({ budgets, transactions }: BudgetSummaryProps) {
  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      return acc + (t.type === "INCOME" ? t.amount : -t.amount)
    }, 0)
  }, [transactions])

  const totalSpent = useMemo(() => {
    const spentByCategory: Record<string, number> = {}
    for (const tx of transactions) {
      if (tx.type !== "EXPENSE" || !tx.category) continue
      spentByCategory[tx.category] = (spentByCategory[tx.category] ?? 0) + tx.amount
    }
    return budgets.reduce((acc, b) => acc + (spentByCategory[b.category] ?? 0), 0)
  }, [transactions, budgets])

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0)
  const remainingBudget = totalBudget - totalSpent
  const available = totalBalance - remainingBudget

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 animate-stagger-in">
      <div className="relative overflow-hidden rounded-2xl bg-card border border-primary/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 animate-pulse-glow pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-blue-700 text-white shadow-md shadow-primary/25">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Presupuesto total</p>
            <p className="text-lg font-extrabold text-blue-700 tracking-tight">{formatCurrency(totalBudget)}</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-card border border-success/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Balance actual</p>
            <p className="text-lg font-extrabold text-emerald-700 tracking-tight">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-4 transition-all duration-300 hover:shadow-lg sm:col-span-3 lg:col-span-1">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-xp/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-xp to-purple-700 text-white shadow-md shadow-xp/25">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-xp">Disponible</p>
            <p className={`text-lg font-extrabold tracking-tight ${available >= 0 ? "text-purple-700" : "text-coral-700"}`}>
              {available >= 0 ? "+" : ""}{formatCurrency(available)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
