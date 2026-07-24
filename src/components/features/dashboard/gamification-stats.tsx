"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Flame, CheckCircle2, Target, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useObligationTemplates, useObligationInstances } from "@/hooks/use-obligations-v2"

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function formatShortDay(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("es-CO", { weekday: "short" })
}

function useWeekData() {
  const today = useMemo(() => formatDate(new Date()), [])
  const { data: todayInstances = [], isLoading: todayLoading } = useObligationInstances(today)

  const weekInstances = useMemo(() => {
    const dates: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(formatDate(d))
    }
    return dates
  }, [])

  return { today, todayInstances, todayLoading, weekInstances }
}

export function GamificationStats() {
  const { data: templates = [] } = useObligationTemplates()
  const { today, todayInstances } = useWeekData()

  const stats = useMemo(() => {
    let streak = 0
    let completedToday = 0
    let totalToday = 0

    const checkDate = new Date()
    for (let i = 0; i < 365; i++) {
      const dateStr = formatDate(checkDate)
      if (dateStr > today) {
        checkDate.setDate(checkDate.getDate() - 1)
        continue
      }

      const isToday = dateStr === today
      const instances = isToday ? todayInstances : []

      if (!isToday && instances.length === 0 && i > 0) break

      if (instances.length > 0) {
        const allDone = instances.every(inst =>
          inst.tasks.length === 0 || inst.tasks.every(t => t.completed)
        )
        if (allDone) {
          streak++
        } else if (i > 0) {
          break
        }
      }

      checkDate.setDate(checkDate.getDate() - 1)
    }

    if (todayInstances.length > 0) {
      for (const inst of todayInstances) {
        if (inst.tasks.length > 0) {
          totalToday += inst.tasks.length
          completedToday += inst.tasks.filter(t => t.completed).length
        }
      }
    }

    return { streak, completedToday, totalToday }
  }, [todayInstances, today])

  const completionRate = stats.totalToday > 0
    ? Math.round((stats.completedToday / stats.totalToday) * 100)
    : 0

  const chartData = useMemo(() => {
    const dates: Array<{ day: string; percentage: number; isToday: boolean }> = []
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = formatDate(d)
      const isToday = dateStr === today
      const dayName = dayNames[d.getDay()]

      let pct = 0
      if (isToday && todayInstances.length > 0) {
        let total = 0
        let completed = 0
        for (const inst of todayInstances) {
          if (inst.tasks.length > 0) {
            total += inst.tasks.length
            completed += inst.tasks.filter(t => t.completed).length
          }
        }
        pct = total > 0 ? Math.round((completed / total) * 100) : 0
      }

      dates.push({ day: dayName, percentage: pct, isToday })
    }

    return dates
  }, [todayInstances, today])

  const avgWeek = useMemo(() => {
    const withData = chartData.filter(d => d.percentage > 0 || d.isToday)
    if (withData.length === 0) return 0
    return Math.round(withData.reduce((s, d) => s + d.percentage, 0) / withData.length)
  }, [chartData])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-orange-600 font-medium">Racha</p>
                <p className="text-2xl font-bold text-orange-700">{stats.streak}</p>
                <p className="text-[10px] text-orange-500">días consecutivos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-medium">Hoy</p>
                <p className="text-2xl font-bold text-emerald-700">{completionRate}%</p>
                <p className="text-[10px] text-emerald-500">{stats.completedToday}/{stats.totalToday} tareas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/25">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">Plantillas</p>
                <p className="text-2xl font-bold text-blue-700">{templates.length}</p>
                <p className="text-[10px] text-blue-500">activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/25">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-violet-600 font-medium">Promedio semanal</p>
                <p className="text-2xl font-bold text-violet-700">{avgWeek}%</p>
                <p className="text-[10px] text-violet-500">completado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="border-b px-6 py-4">
          <p className="font-semibold">Progreso semanal</p>
        </div>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => `${v}%`}
                width={35}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Completado"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isToday ? "#10b981" : entry.percentage >= 100 ? "#3b82f6" : entry.percentage > 0 ? "#93c5fd" : "#e2e8f0"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
