"use client"

import { useMemo } from "react"
import { Flame, CheckCircle2, Target, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useObligationTemplates, useObligationInstances } from "@/hooks/use-obligations-v2"

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function GamificationStats() {
  const { data: templates = [] } = useObligationTemplates()
  const today = useMemo(() => formatDate(new Date()), [])
  const { data: todayInstances = [] } = useObligationInstances(today)

  const weekData = useMemo(() => {
    const dates: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(formatDate(d))
    }
    return dates
  }, [])

  const stats = useMemo(() => {
    let streak = 0
    let completedToday = 0
    let totalToday = 0
    let completedWeek = 0
    let totalWeek = 0

    const checkDate = new Date()
    for (let i = 0; i < 365; i++) {
      const dateStr = formatDate(checkDate)
      const dayInstances = todayInstances.length > 0 && dateStr === today
        ? todayInstances
        : []

      if (dateStr !== today && dayInstances.length === 0) {
        if (i > 0) break
      }

      if (dayInstances.length > 0) {
        const allDone = dayInstances.every(inst =>
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

    return { streak, completedToday, totalToday, completedWeek, totalWeek }
  }, [todayInstances, today])

  const completionRate = stats.totalToday > 0
    ? Math.round((stats.completedToday / stats.totalToday) * 100)
    : 0

  return (
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
              <p className="text-xs text-violet-600 font-medium">Promedio</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.totalToday > 0 ? `${completionRate}%` : "—"}
              </p>
              <p className="text-[10px] text-violet-500">completado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
