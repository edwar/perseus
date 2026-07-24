"use client"

import { useMemo } from "react"
import { DashboardClient } from "./dashboard-client"
import { useTransactionStore } from "@/store/transaction-store"

export default function DashboardPage() {
  const transactions = useTransactionStore((s) => s.transactions)

  const totalIncome = useMemo(() => transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0), [transactions])
  const totalExpenses = useMemo(() => transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0), [transactions])
  const totalBalance = totalIncome - totalExpenses

  const monthlyIncome = useMemo(
    () => transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  )

  const monthlyExpenses = useMemo(
    () => transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  )

  const spendingByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of transactions) {
      if (t.type !== "EXPENSE") continue
      const cat = t.category || "Gasto"
      map[cat] = (map[cat] ?? 0) + t.amount
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const monthlyChart = useMemo(() => {
    const byMonth: Record<string, { income: number; expenses: number }> = {}
    for (const t of transactions) {
      const month = t.date.slice(0, 7)
      if (!byMonth[month]) byMonth[month] = { income: 0, expenses: 0 }
      if (t.type === "INCOME") byMonth[month].income += t.amount
      else byMonth[month].expenses += t.amount
    }
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, d]) => ({ month, ...d }))
  }, [transactions])

  const allTransactions = useMemo(
    () => [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((t) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        type: t.type,
        date: t.date,
        category: t.category || null,
        categoryColor: null,
      })),
    [transactions]
  )

  const recentTransactions = allTransactions.slice(0, 20)

  return (
    <DashboardClient
      totalBalance={totalBalance}
      monthlyIncome={monthlyIncome}
      monthlyExpenses={monthlyExpenses}
      allTransactions={allTransactions}
      recentTransactions={recentTransactions}
      spendingByCategory={spendingByCategory}
      monthlyChart={monthlyChart}
    />
  )
}
