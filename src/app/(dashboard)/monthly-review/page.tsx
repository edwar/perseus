"use client"

import { useMemo, useEffect, useState } from "react"
import { useTransactions } from "@/hooks/useData"
import { useHeaderStore } from "@/store/header-store"
import { MonthlyReviewClient } from "./monthly-review-client"

export default function MonthlyReviewPage() {
  const { data: transactions = [] } = useTransactions()
  const setHeaderAction = useHeaderStore((s) => s.setAction)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    setHeaderAction(null)
    return () => setHeaderAction(null)
  }, [setHeaderAction])

  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number; expenses: number; balance: number }> = {}

    for (const tx of transactions) {
      const monthKey = tx.date.slice(0, 7)
      if (!months[monthKey]) {
        months[monthKey] = { income: 0, expenses: 0, balance: 0 }
      }
      if (tx.type === "INCOME") {
        months[monthKey].income += tx.amount
      } else {
        months[monthKey].expenses += tx.amount
      }
      months[monthKey].balance = months[monthKey].income - months[monthKey].expenses
    }

    return months
  }, [transactions])

  const yearlyData = useMemo(() => {
    const years: Record<number, { income: number; expenses: number; balance: number; months: string[] }> = {}

    for (const [monthKey, data] of Object.entries(monthlyData)) {
      const year = parseInt(monthKey.split("-")[0])
      if (!years[year]) {
        years[year] = { income: 0, expenses: 0, balance: 0, months: [] }
      }
      years[year].income += data.income
      years[year].expenses += data.expenses
      years[year].months.push(monthKey)
    }

    for (const year of Object.keys(years).map(Number)) {
      years[year].balance = years[year].income - years[year].expenses
    }

    return years
  }, [monthlyData])

  const sortedYears = useMemo(() => Object.keys(yearlyData).map(Number).sort((a, b) => b - a), [yearlyData])

  const accumulatedBalance = useMemo(() => {
    let total = 0
    const sorted = Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b))
    const result: Record<string, number> = {}

    for (const [month, data] of sorted) {
      total += data.balance
      result[month] = total
    }

    return result
  }, [monthlyData])

  const categorySpending = useMemo(() => {
    const map: Record<string, number> = {}
    const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`

    for (const tx of transactions) {
      if (tx.date.startsWith(monthStr) && tx.type === "EXPENSE" && tx.category) {
        map[tx.category] = (map[tx.category] ?? 0) + tx.amount
      }
    }

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions, selectedYear, selectedMonth])

  return (
    <MonthlyReviewClient
      monthlyData={monthlyData}
      yearlyData={yearlyData}
      sortedYears={sortedYears}
      accumulatedBalance={accumulatedBalance}
      categorySpending={categorySpending}
      selectedYear={selectedYear}
      selectedMonth={selectedMonth}
      onYearChange={setSelectedYear}
      onMonthChange={setSelectedMonth}
    />
  )
}
