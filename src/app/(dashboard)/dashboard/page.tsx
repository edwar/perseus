"use client"

import { useMemo, useEffect } from "react"
import { DashboardClient } from "./dashboard-client"
import { useTransactions } from "@/hooks/useData"
import { useBudgetStore } from "@/store/budget-store"
import { useDateFilterStore } from "@/store/date-filter-store"

export default function DashboardPage() {
  const { data: transactions = [] } = useTransactions()
  const { budgets, hydrate } = useBudgetStore()
  const { mode, getActiveRange, getCompareRanges } = useDateFilterStore()

  useEffect(() => {
    hydrate()
  }, [])

  const activeRange = getActiveRange()
  const compareRanges = getCompareRanges()

  const filteredTransactions = useMemo(() => {
    if (mode === "comparison" && compareRanges) {
      return transactions.filter((t) =>
        compareRanges.some((r) => t.date >= r.start && t.date <= r.end)
      )
    }
    return transactions.filter((t) => t.date >= activeRange.start && t.date <= activeRange.end)
  }, [transactions, activeRange, mode, compareRanges])

  const totalIncome = useMemo(() => filteredTransactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0), [filteredTransactions])
  const totalExpenses = useMemo(() => filteredTransactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0), [filteredTransactions])
  const totalBalance = totalIncome - totalExpenses

  const monthlyIncome = useMemo(
    () => filteredTransactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  )

  const monthlyExpenses = useMemo(
    () => filteredTransactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  )

  const comparisonData = useMemo(() => {
    if (mode !== "comparison" || !compareRanges) return null
    const filterByRange = (start: string, end: string) => {
      const txs = transactions.filter((t) => t.date >= start && t.date <= end)
      const income = txs.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0)
      const expenses = txs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0)
      return { income, expenses, balance: income - expenses }
    }
    return compareRanges.map((r) => filterByRange(r.start, r.end))
  }, [mode, compareRanges, transactions])

  const spendingByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of filteredTransactions) {
      if (t.type !== "EXPENSE") continue
      const cat = t.category || "Gasto"
      map[cat] = (map[cat] ?? 0) + t.amount
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredTransactions])

  const monthlyChart = useMemo(() => {
    const byMonth: Record<string, { income: number; expenses: number }> = {}
    for (const t of filteredTransactions) {
      const month = t.date.slice(0, 7)
      if (!byMonth[month]) byMonth[month] = { income: 0, expenses: 0 }
      if (t.type === "INCOME") byMonth[month].income += t.amount
      else byMonth[month].expenses += t.amount
    }
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, d]) => ({ month, ...d }))
  }, [filteredTransactions])

  const allTransactions = useMemo(
    () => [...filteredTransactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((t) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        type: t.type,
        date: t.date,
        category: t.category || null,
        activity: t.activity || null,
        categoryColor: null,
      })),
    [filteredTransactions]
  )

  const recentTransactions = allTransactions.slice(0, 20)

  return (
    <DashboardClient
      totalBalance={totalBalance}
      monthlyIncome={monthlyIncome}
      monthlyExpenses={monthlyExpenses}
      comparisonData={comparisonData}
      allTransactions={allTransactions}
      recentTransactions={recentTransactions}
      spendingByCategory={spendingByCategory}
      monthlyChart={monthlyChart}
      budgets={budgets}
    />
  )
}
