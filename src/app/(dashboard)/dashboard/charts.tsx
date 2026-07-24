"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const COLORS = ["#1D4ED8", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#2563eb", "#6366f1"]

export function SpendingPie({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <Card>
      <div className="border-b px-6 py-4"><p className="font-semibold">Gastos por categoría</p></div>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: unknown) => `$${(v as number).toLocaleString("es-CO")}`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1">
          {data.slice(0, 5).map((cat, i) => (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{cat.name}</span>
              </div>
              <span className="font-medium">${cat.value.toLocaleString("es-CO")}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function IncomeBar({ data }: { data: Array<{ month: string; income: number; expenses: number }> }) {
  return (
    <Card>
      <div className="border-b px-6 py-4"><p className="font-semibold">Ingresos vs Gastos</p></div>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: unknown) => `$${((v as number) / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: unknown) => `$${(v as number).toLocaleString("es-CO")}`} />
            <Bar dataKey="income" name="Ingresos" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function DailyExpensesChart({ transactions }: { transactions: Array<{ date: string; amount: number; type: string }> }) {
  const chartData = useMemo(() => {
    const dailyMap: Record<string, number> = {}
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

    for (let i = 1; i <= 31; i++) {
      const day = String(i).padStart(2, "0")
      const dateStr = `${currentMonth}-${day}`
      if (dateStr > `${currentMonth}-31`) break
      dailyMap[day] = 0
    }

    for (const tx of transactions) {
      if (tx.type !== "EXPENSE") continue
      if (!tx.date.startsWith(currentMonth)) continue
      const day = tx.date.slice(8, 10)
      if (dailyMap[day] !== undefined) {
        dailyMap[day] += tx.amount
      }
    }

    return Object.entries(dailyMap)
      .map(([day, amount]) => ({ day: Number(day), amount }))
      .filter(d => d.amount > 0)
  }, [transactions])

  const totalMonth = useMemo(() => {
    return chartData.reduce((s, d) => s + d.amount, 0)
  }, [chartData])

  const avgDaily = useMemo(() => {
    if (chartData.length === 0) return 0
    return Math.round(totalMonth / chartData.length)
  }, [chartData, totalMonth])

  return (
    <Card>
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <p className="font-semibold">Gastos diarios</p>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Promedio diario</p>
          <p className="text-sm font-bold text-red-600">${avgDaily.toLocaleString("es-CO")}</p>
        </div>
      </div>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
            Sin gastos este mes
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}`} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: unknown) => `$${((v as number) / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString("es-CO")}`, "Gasto"]}
                labelFormatter={(label) => `Día ${label}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function TopExpensesChart({ transactions }: { transactions: Array<{ description: string; amount: number; type: string; category: string | null }> }) {
  const topExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === "EXPENSE")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [transactions])

  return (
    <Card>
      <div className="border-b px-6 py-4"><p className="font-semibold">Mayores gastos</p></div>
      <CardContent>
        {topExpenses.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
            Sin gastos registrados
          </div>
        ) : (
          <div className="space-y-3">
            {topExpenses.map((tx, i) => {
              const maxAmount = topExpenses[0]?.amount || 1
              const percentage = (tx.amount / maxAmount) * 100
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate max-w-[60%]">{tx.description}</span>
                    <span className="font-bold text-red-600">${tx.amount.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
