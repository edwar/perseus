"use client"

import { useMemo, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const COLORS = ["#2563FF", "#FF5A5F", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"]

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
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: unknown) => {
              const num = v as number
              if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
              if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`
              return `$${num}`
            }} />
            <Tooltip formatter={(v: unknown) => `$${(v as number).toLocaleString("es-CO")}`} />
            <Bar dataKey="income" name="Ingresos" fill="#2563FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Gastos" fill="#FF5A5F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function DailyExpensesChart({
  transactions,
  budgets = []
}: {
  transactions: Array<{ date: string; amount: number; type: string; category: string | null; activity?: string | null }>
  budgets?: Array<{
    id: string
    category: string
    amount: number
    color: string
    items?: Array<{ name: string; amount: number }>
  }>
}) {
  const [view, setView] = useState<"presupuesto" | "actividad">("presupuesto")

  const { byCategory, byActivity } = useMemo(() => {
    const expenses = transactions.filter((tx) => tx.type === "EXPENSE")

    const daySet = new Set<string>()
    for (const tx of expenses) {
      daySet.add(tx.date)
    }
    const sortedDays = Array.from(daySet).sort()

    const categoryDailyMap: Record<string, Record<string, number>> = {}
    const activityDailyMap: Record<string, Record<string, number>> = {}

    for (const tx of expenses) {
      const day = tx.date

      const category = tx.category || "Sin categoría"
      if (!categoryDailyMap[category]) {
        categoryDailyMap[category] = {}
      }
      categoryDailyMap[category][day] = (categoryDailyMap[category][day] || 0) + tx.amount

      const activityName = tx.activity || category

      if (!activityDailyMap[activityName]) {
        activityDailyMap[activityName] = {}
      }
      activityDailyMap[activityName][day] = (activityDailyMap[activityName][day] || 0) + tx.amount
    }

    const activeCategories = Object.entries(categoryDailyMap)
      .filter(([, days]) => Object.values(days).some(v => v > 0))
      .map(([name]) => name)
      .sort((a, b) => {
        const sumA = Object.values(categoryDailyMap[a]).reduce((s, v) => s + v, 0)
        const sumB = Object.values(categoryDailyMap[b]).reduce((s, v) => s + v, 0)
        return sumB - sumA
      })

    const catData = sortedDays.map(day => {
      const entry: Record<string, string | number> = { day }
      for (const cat of activeCategories) {
        entry[cat] = categoryDailyMap[cat]?.[day] || 0
      }
      return entry
    }).filter(entry => activeCategories.some(cat => (entry[cat] as number) > 0))

    const activeActivities = Object.entries(activityDailyMap)
      .filter(([, days]) => Object.values(days).some(v => v > 0))
      .map(([name]) => name)
      .sort((a, b) => {
        const sumA = Object.values(activityDailyMap[a]).reduce((s, v) => s + v, 0)
        const sumB = Object.values(activityDailyMap[b]).reduce((s, v) => s + v, 0)
        return sumB - sumA
      })

    const actData = sortedDays.map(day => {
      const entry: Record<string, string | number> = { day }
      for (const act of activeActivities) {
        entry[act] = activityDailyMap[act]?.[day] || 0
      }
      return entry
    }).filter(d => activeActivities.some(a => (d[a] as number) > 0))

    return {
      byCategory: { data: catData, categories: activeCategories },
      byActivity: { data: actData, activities: activeActivities }
    }
  }, [transactions, budgets])

  const isCategory = view === "presupuesto"
  const chartData = isCategory ? byCategory.data : byActivity.data
  const categories = isCategory ? byCategory.categories : []
  const activities = !isCategory ? byActivity.activities : []

  const totalMonth = useMemo(() => {
    return chartData.reduce((s, d) => {
      if (isCategory) {
        return s + categories.reduce((sum, cat) => sum + ((d[cat] as number) || 0), 0)
      }
      return s + activities.reduce((sum, a) => sum + ((d[a] as number) || 0), 0)
    }, 0)
  }, [chartData, categories, activities, isCategory])

  const avgDaily = useMemo(() => {
    if (chartData.length === 0) return 0
    return Math.round(totalMonth / chartData.length)
  }, [chartData, totalMonth])

  return (
    <Card>
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="font-semibold">Gastos diarios</p>
          <Select value={view} onValueChange={(v) => setView(v as "presupuesto" | "actividad")}>
            <SelectTrigger size="sm" className="h-7 text-xs w-auto min-w-[130px]">
              <SelectValue placeholder="Seleccionar vista" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="presupuesto">Por presupuesto</SelectItem>
              <SelectItem value="actividad">Por actividad</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Promedio diario</p>
          <p className="text-sm font-bold text-danger">${avgDaily.toLocaleString("es-CO")}</p>
        </div>
      </div>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
            Sin gastos este mes
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(v) => {
                  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
                  const d = new Date(v + "T12:00:00")
                  return `${d.getDate()} ${monthNames[d.getMonth()]}`
                }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: unknown) => {
                  const num = v as number
                  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
                  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`
                  return `$${num}`
                }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (Number(value) === 0) return null
                    return [`$${Number(value).toLocaleString("es-CO")}`, name]
                  }}
                  labelFormatter={(label) => {
                    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
                    const d = new Date(label + "T12:00:00")
                    return `${d.getDate()} de ${monthNames[d.getMonth()]} ${d.getFullYear()}`
                  }}
                />
                {isCategory ? (
                  categories.map((cat, i) => (
                    <Line
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      name={cat}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2}
                      dot={{ fill: COLORS[i % COLORS.length], r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  ))
                ) : (
                  activities.map((act, i) => (
                    <Line
                      key={act}
                      type="monotone"
                      dataKey={act}
                      name={act}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2}
                      dot={{ fill: COLORS[i % COLORS.length], r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  ))
                )}
              </LineChart>
            </ResponsiveContainer>
            {isCategory && categories.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-3 justify-center">
                {categories.map((cat, i) => (
                  <div key={cat} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground truncate max-w-[100px]">{cat}</span>
                  </div>
                ))}
              </div>
            )}
            {!isCategory && (
              <div className="mt-3 flex flex-wrap gap-3 justify-center">
                {activities.map((act, i) => (
                  <div key={act} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground truncate max-w-[100px]">{act}</span>
                  </div>
                ))}
              </div>
            )}
          </>
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
                    <span className="font-bold text-danger">${tx.amount.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-coral-300 to-coral-500 transition-all duration-500"
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
