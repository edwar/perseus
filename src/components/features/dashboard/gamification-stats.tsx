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
        {/* Streak Card — Fire energy */}
        <div className="group relative overflow-hidden rounded-2xl border border-flame-200/60 bg-gradient-to-br from-flame-50 via-white to-flame-100/30 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-energy/15 animate-stagger-in" style={{ animationDelay: "180ms" }}>
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-energy/5 animate-pulse-glow pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-energy to-flame-600 text-white shadow-lg shadow-energy/30 transition-transform duration-300 group-hover:scale-110">
              <Flame className="h-6 w-6" />
              {stats.streak > 0 && (
                <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white ring-2 ring-energy animate-pulse-glow" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-energy">Racha</p>
              <p className="stat-number text-flame-700 mt-0.5">{stats.streak}</p>
              <p className="text-[11px] font-medium text-flame-400">días consecutivos</p>
            </div>
          </div>
        </div>

        {/* Today Card — Growth / Success */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/30 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-success/15 animate-stagger-in" style={{ animationDelay: "240ms" }}>
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-success to-emerald-600 text-white shadow-lg shadow-success/30 transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 className="h-6 w-6" />
              {completionRate === 100 && stats.totalToday > 0 && (
                <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white ring-2 ring-achievement animate-pulse-glow" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-success">Hoy</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className="stat-number text-emerald-700">{completionRate}</p>
                <span className="text-lg font-bold text-emerald-400">%</span>
              </div>
              <p className="text-[11px] font-medium text-emerald-400">{stats.completedToday}/{stats.totalToday} tareas</p>
            </div>
          </div>
        </div>

        {/* Templates Card — Control / Primary */}
        <div className="group relative overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 via-white to-blue-100/30 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15 animate-stagger-in" style={{ animationDelay: "300ms" }}>
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-blue-700 text-white shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Plantillas</p>
              <p className="stat-number text-blue-700 mt-0.5">{templates.length}</p>
              <p className="text-[11px] font-medium text-blue-400">activas</p>
            </div>
          </div>
        </div>

        {/* Weekly Avg Card — XP / Mastery */}
        <div className="group relative overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 via-white to-purple-100/30 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-xp/15 animate-stagger-in" style={{ animationDelay: "360ms" }}>
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-xp/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "3s" }} />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-xp to-purple-700 text-white shadow-lg shadow-xp/30 transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-xp">Promedio semanal</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className="stat-number text-purple-700">{avgWeek}</p>
                <span className="text-lg font-bold text-purple-400">%</span>
              </div>
              <p className="text-[11px] font-medium text-purple-400">completado</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg animate-stagger-in" style={{ animationDelay: "420ms" }}>
        <div className="border-b px-6 py-4 bg-gradient-to-r from-muted/50 to-transparent">
          <p className="font-semibold text-sm">Progreso semanal</p>
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
                    fill={entry.isToday ? "#16C784" : entry.percentage >= 100 ? "#2563FF" : entry.percentage > 0 ? "#93C5FD" : "#E2E8F0"}
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
