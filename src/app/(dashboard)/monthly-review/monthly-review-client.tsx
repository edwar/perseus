"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabPanel } from "@/components/ui/tabs"
import { Empty } from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formats"
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  PiggyBank,
  BarChart3,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface MonthlyReviewClientProps {
  monthlyData: Record<string, { income: number; expenses: number; balance: number }>
  yearlyData: Record<number, { income: number; expenses: number; balance: number; months: string[] }>
  sortedYears: number[]
  accumulatedBalance: Record<string, number>
  categorySpending: Array<{ name: string; value: number }>
  selectedYear: number
  selectedMonth: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const MONTH_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
]

const COLORS = [
  "#2563FF",
  "#FF5A5F",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
]

export function MonthlyReviewClient({
  monthlyData,
  yearlyData,
  sortedYears,
  accumulatedBalance,
  categorySpending,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: MonthlyReviewClientProps) {
  const currentMonthKey = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`
  const currentMonthData = monthlyData[currentMonthKey] ?? { income: 0, expenses: 0, balance: 0 }
  const currentAccumulated = accumulatedBalance[currentMonthKey] ?? 0

  const prevMonthKey = useMemo(() => {
    if (selectedMonth === 1) return `${selectedYear - 1}-12`
    return `${selectedYear}-${String(selectedMonth - 1).padStart(2, "0")}`
  }, [selectedYear, selectedMonth])

  const prevMonthData = monthlyData[prevMonthKey] ?? { income: 0, expenses: 0, balance: 0 }

  const monthlyChartData = useMemo(() => {
    const data = []
    for (let m = 1; m <= 12; m++) {
      const key = `${selectedYear}-${String(m).padStart(2, "0")}`
      const d = monthlyData[key] ?? { income: 0, expenses: 0, balance: 0 }
      data.push({
        month: MONTH_SHORT[m - 1],
        income: d.income,
        expenses: d.expenses,
        balance: d.balance,
        accumulated: accumulatedBalance[key] ?? 0,
      })
    }
    return data
  }, [selectedYear, monthlyData, accumulatedBalance])

  const yearlyChartData = useMemo(() => {
    return sortedYears
      .slice()
      .reverse()
      .map((year) => ({
        year: year.toString(),
        income: yearlyData[year]?.income ?? 0,
        expenses: yearlyData[year]?.expenses ?? 0,
        balance: yearlyData[year]?.balance ?? 0,
      }))
  }, [sortedYears, yearlyData])

  const hasData = sortedYears.length > 0

  const prevYear = useMemo(() => {
    const prev = selectedYear - 1
    return yearlyData[prev]
  }, [selectedYear, yearlyData])

  const prevYearBalance = prevYear?.balance ?? 0

  const currentYearData = yearlyData[selectedYear] ?? { income: 0, expenses: 0, balance: 0, months: [] }
  const carryoverFromPrevYear = prevYearBalance > 0 ? prevYearBalance : 0

  function handlePrevMonth() {
    if (selectedMonth === 1) {
      onMonthChange(12)
      onYearChange(selectedYear - 1)
    } else {
      onMonthChange(selectedMonth - 1)
    }
  }

  function handleNextMonth() {
    if (selectedMonth === 12) {
      onMonthChange(1)
      onYearChange(selectedYear + 1)
    } else {
      onMonthChange(selectedMonth + 1)
    }
  }

  if (!hasData) {
    return (
      <div className="space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-hidden">
        <Empty
          icon={Calendar}
          title="Sin transacciones"
          description="Agrega transacciones para ver tu resumen mensual y anual"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-hidden">
      <div className="md:hidden mt-6">
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[140px] text-center">
            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[140px] text-center">
            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "monthly", label: "Mensual", icon: <Calendar className="h-4 w-4" /> },
          { id: "yearly", label: "Anual", icon: <BarChart3 className="h-4 w-4" /> },
        ]}
      >
        <TabPanel id="monthly">
          <div className="space-y-4 sm:space-y-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="animate-stagger-in" style={{ animationDelay: "0ms" }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ingresos</p>
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(currentMonthData.income)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-stagger-in" style={{ animationDelay: "60ms" }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-100">
                        <ArrowDownRight className="h-5 w-5 text-danger" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Gastos</p>
                        <p className="text-lg font-bold text-danger">{formatCurrency(currentMonthData.expenses)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-stagger-in" style={{ animationDelay: "120ms" }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        currentMonthData.balance >= 0 ? "bg-blue-100" : "bg-coral-100"
                      )}>
                        {currentMonthData.balance >= 0 ? (
                          <TrendingUp className="h-5 w-5 text-primary" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-danger" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Balance del mes</p>
                        <p className={cn(
                          "text-lg font-bold",
                          currentMonthData.balance >= 0 ? "text-primary" : "text-danger"
                        )}>
                          {formatCurrency(currentMonthData.balance)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-stagger-in" style={{ animationDelay: "180ms" }}>
                <Card className="bg-gradient-to-br from-violet-500 via-violet-600 to-violet-800 text-white border-0 shadow-lg shadow-violet-500/25">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                        <PiggyBank className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-white/80">Saldo acumulado</p>
                        <p className="text-lg font-bold text-white">{formatCurrency(currentAccumulated)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="animate-stagger-in" style={{ animationDelay: "240ms" }}>
                <Card>
                  <div className="border-b px-6 py-4">
                    <p className="font-semibold">Ingresos vs Gastos</p>
                  </div>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v: unknown) => {
                            const num = v as number
                            if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
                            if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`
                            return `$${num}`
                          }}
                        />
                        <Tooltip
                          formatter={(value: unknown) => formatCurrency(value as number)}
                          labelStyle={{ fontWeight: 600 }}
                        />
                        <Bar dataKey="income" name="Ingresos" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" name="Gastos" fill="#FF5A5F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-stagger-in" style={{ animationDelay: "300ms" }}>
                <Card>
                  <div className="border-b px-6 py-4">
                    <p className="font-semibold">Progresión del saldo acumulado</p>
                  </div>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v: unknown) => {
                            const num = v as number
                            if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
                            if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`
                            return `$${num}`
                          }}
                        />
                        <Tooltip
                          formatter={(value: unknown) => formatCurrency(value as number)}
                          labelStyle={{ fontWeight: 600 }}
                        />
                        <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                        <Line
                          type="monotone"
                          dataKey="accumulated"
                          name="Acumulado"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          dot={{ fill: "#8B5CF6", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            {categorySpending.length > 0 && (
              <div className="animate-stagger-in" style={{ animationDelay: "360ms" }}>
                <Card>
                  <div className="border-b px-6 py-4">
                    <p className="font-semibold">Gastos por categoría - {MONTH_NAMES[selectedMonth - 1]}</p>
                  </div>
                  <CardContent>
                    <div className="space-y-3">
                      {categorySpending.map((cat, i) => {
                        const maxAmount = categorySpending[0]?.value || 1
                        const percentage = (cat.value / maxAmount) * 100
                        return (
                          <div key={cat.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                />
                                <span className="font-medium">{cat.name}</span>
                              </div>
                              <span className="font-bold">{formatCurrency(cat.value)}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: COLORS[i % COLORS.length],
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="animate-stagger-in" style={{ animationDelay: "420ms" }}>
              <Card>
                <div className="border-b px-6 py-4">
                  <p className="font-semibold">Comparativa con el mes anterior</p>
                </div>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Ingresos</p>
                      <p className={cn(
                        "text-lg font-bold",
                        currentMonthData.income >= prevMonthData.income ? "text-emerald-600" : "text-danger"
                      )}>
                        {formatCurrency(currentMonthData.income)}
                      </p>
                      <p className={cn(
                        "text-xs mt-1",
                        currentMonthData.income >= prevMonthData.income ? "text-emerald-600" : "text-danger"
                      )}>
                        {currentMonthData.income >= prevMonthData.income ? "+" : ""}
                        {formatCurrency(currentMonthData.income - prevMonthData.income)} vs anterior
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Gastos</p>
                      <p className={cn(
                        "text-lg font-bold",
                        currentMonthData.expenses <= prevMonthData.expenses ? "text-emerald-600" : "text-danger"
                      )}>
                        {formatCurrency(currentMonthData.expenses)}
                      </p>
                      <p className={cn(
                        "text-xs mt-1",
                        currentMonthData.expenses <= prevMonthData.expenses ? "text-emerald-600" : "text-danger"
                      )}>
                        {currentMonthData.expenses <= prevMonthData.expenses ? "" : "+"}
                        {formatCurrency(currentMonthData.expenses - prevMonthData.expenses)} vs anterior
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Balance</p>
                      <p className={cn(
                        "text-lg font-bold",
                        currentMonthData.balance >= prevMonthData.balance ? "text-emerald-600" : "text-danger"
                      )}>
                        {formatCurrency(currentMonthData.balance)}
                      </p>
                      <p className={cn(
                        "text-xs mt-1",
                        currentMonthData.balance >= prevMonthData.balance ? "text-emerald-600" : "text-danger"
                      )}>
                        {currentMonthData.balance >= prevMonthData.balance ? "+" : ""}
                        {formatCurrency(currentMonthData.balance - prevMonthData.balance)} vs anterior
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="yearly">
          <div className="space-y-4 sm:space-y-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="animate-stagger-in" style={{ animationDelay: "0ms" }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ingresos {selectedYear}</p>
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(currentYearData.income)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-stagger-in" style={{ animationDelay: "60ms" }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-100">
                        <ArrowDownRight className="h-5 w-5 text-danger" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Gastos {selectedYear}</p>
                        <p className="text-lg font-bold text-danger">{formatCurrency(currentYearData.expenses)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-stagger-in" style={{ animationDelay: "120ms" }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        currentYearData.balance >= 0 ? "bg-blue-100" : "bg-coral-100"
                      )}>
                        {currentYearData.balance >= 0 ? (
                          <TrendingUp className="h-5 w-5 text-primary" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-danger" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Balance {selectedYear}</p>
                        <p className={cn(
                          "text-lg font-bold",
                          currentYearData.balance >= 0 ? "text-primary" : "text-danger"
                        )}>
                          {formatCurrency(currentYearData.balance)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-stagger-in" style={{ animationDelay: "180ms" }}>
                <Card className="bg-gradient-to-br from-violet-500 via-violet-600 to-violet-800 text-white border-0 shadow-lg shadow-violet-500/25">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-white/80">Arrastrado de {selectedYear - 1}</p>
                        <p className="text-lg font-bold text-white">{formatCurrency(carryoverFromPrevYear)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="animate-stagger-in" style={{ animationDelay: "240ms" }}>
              <Card>
                <div className="border-b px-6 py-4">
                  <p className="font-semibold">Balance por año</p>
                </div>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yearlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v: unknown) => {
                          const num = v as number
                          if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
                          if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`
                          return `$${num}`
                        }}
                      />
                      <Tooltip
                        formatter={(value: unknown) => formatCurrency(value as number)}
                        labelStyle={{ fontWeight: 600 }}
                      />
                      <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                      <Bar dataKey="income" name="Ingresos" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Gastos" fill="#FF5A5F" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="balance" name="Balance" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="animate-stagger-in" style={{ animationDelay: "300ms" }}>
              <Card>
                <div className="border-b px-6 py-4">
                  <p className="font-semibold">Historial de cierres anuales</p>
                </div>
                <CardContent>
                  <div className="space-y-3">
                    {sortedYears.map((year) => {
                      const data = yearlyData[year]
                      const isCurrentYear = year === new Date().getFullYear()
                      const isClosed = !isCurrentYear
                      const prevData = yearlyData[year - 1]
                      const carryover = prevData && prevData.balance > 0 ? prevData.balance : 0

                      return (
                        <div
                          key={year}
                          className={cn(
                            "p-4 rounded-xl border transition-all",
                            isCurrentYear
                              ? "border-primary/30 bg-primary/5"
                              : "border-border"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold">{year}</span>
                              <span className={cn(
                                "text-xs font-semibold px-2 py-0.5 rounded-full",
                                isClosed
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-blue-100 text-blue-700"
                              )}>
                                {isClosed ? "CERRADO" : "EN CURSO"}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Balance del año</p>
                              <p className={cn(
                                "text-lg font-bold",
                                data.balance >= 0 ? "text-primary" : "text-danger"
                              )}>
                                {formatCurrency(data.balance)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Ingresos</p>
                              <p className="font-semibold text-emerald-600">{formatCurrency(data.income)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Gastos</p>
                              <p className="font-semibold text-danger">{formatCurrency(data.expenses)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Arrastrado a {year + 1}</p>
                              <p className={cn(
                                "font-semibold",
                                carryover > 0 ? "text-violet-600" : "text-muted-foreground"
                              )}>
                                {carryover > 0 ? formatCurrency(carryover) : "$0"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}
