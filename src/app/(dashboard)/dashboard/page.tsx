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

  const recentTransactions = useMemo(
    () => [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
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

  return (
    <DashboardClient
      totalBalance={totalBalance}
      monthlyIncome={monthlyIncome}
      monthlyExpenses={monthlyExpenses}
      recentTransactions={recentTransactions}
    />
  )
}
