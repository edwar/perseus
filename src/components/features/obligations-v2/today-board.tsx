"use client"

import { useMemo, useCallback, useState, useEffect, useRef } from "react"
import { Calendar, ChevronLeft, ChevronRight, Settings, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressRing } from "./progress-ring"
import { StreakCounter } from "./streak-counter"
import { TaskCard } from "./task-card"
import { useObligationTemplates, useObligationInstances, useObligationMutations } from "@/hooks/use-obligations-v2"

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })
}

function isToday(dateStr: string): boolean {
  return dateStr === formatDate(new Date())
}

export function TodayBoard({ onOpenSettings }: { onOpenSettings: () => void }) {
  const today = useMemo(() => formatDate(new Date()), [])
  const [selectedDate, setSelectedDate] = useState(today)

  const { data: templates = [] } = useObligationTemplates()
  const { data: instances = [] } = useObligationInstances(selectedDate)
  const { createInstances, toggleTask } = useObligationMutations()
  const ensuredRef = useRef<string>("")

  const ensureInstances = useCallback(async () => {
    if (templates.length === 0) return
    const key = `${selectedDate}-${templates.map(t => t.id).join(",")}`
    if (ensuredRef.current === key) return
    ensuredRef.current = key

    const dayOfWeek = new Date(selectedDate + "T12:00:00").getDay()

    for (const template of templates) {
      let shouldCreate = false

      if (template.frequency === "daily") {
        shouldCreate = true
      } else if (template.frequency === "weekly" && template.daysOfWeek) {
        shouldCreate = template.daysOfWeek.includes(dayOfWeek)
      } else if (template.frequency === "monthly" && template.createdAt) {
        const templateDay = new Date(template.createdAt).getDate()
        const selectedDay = new Date(selectedDate + "T12:00:00").getDate()
        shouldCreate = templateDay === selectedDay
      } else if (template.frequency === "once" && template.createdAt) {
        shouldCreate = template.createdAt.split("T")[0] === selectedDate
      }

      if (shouldCreate) {
        try {
          await createInstances.mutateAsync({ templateId: template.id, date: selectedDate })
        } catch {
          // ignore errors
        }
      }
    }
  }, [templates, selectedDate, createInstances])

  useEffect(() => {
    ensureInstances()
  }, [ensureInstances])

  const stats = useMemo(() => {
    let total = 0
    let completed = 0

    for (const instance of instances) {
      if (instance.tasks.length > 0) {
        total += instance.tasks.length
        completed += instance.tasks.filter(t => t.completed).length
      } else {
        total += 1
        completed += 1
      }
    }

    const progress = total > 0 ? (completed / total) * 100 : 0
    return { total, completed, progress }
  }, [instances])

  const streak = useMemo(() => {
    let count = 0
    const checkDate = new Date()

    for (let i = 0; i < 365; i++) {
      const dateStr = formatDate(checkDate)
      const dayInstances = instances.filter(inst => inst.date === dateStr)

      if (dayInstances.length === 0 && i > 0) break

      const allDone = dayInstances.every(inst => {
        if (inst.tasks.length === 0) return true
        return inst.tasks.every(t => t.completed)
      })

      if (dayInstances.length > 0 && allDone) {
        count++
      } else if (i > 0) {
        break
      }

      checkDate.setDate(checkDate.getDate() - 1)
    }

    return count
  }, [instances])

  const navigateDate = (delta: number) => {
    const date = new Date(selectedDate + "T12:00:00")
    date.setDate(date.getDate() + delta)
    setSelectedDate(formatDate(date))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize">
            {isToday(selectedDate) ? "Hoy" : formatDisplayDate(selectedDate)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.completed} de {stats.total} tareas completadas
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onOpenSettings}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center">
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => setSelectedDate(today)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isToday(selectedDate) ? "Hoy" : "Ir a hoy"}
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateDate(1)}
          disabled={selectedDate >= today}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {instances.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="flex items-center gap-6 p-6">
            <ProgressRing progress={stats.progress} size={100} strokeWidth={8} />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <StreakCounter streak={streak} />
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.progress === 100
                  ? "🎉 ¡Felicitaciones! Completaste todo hoy"
                  : stats.progress >= 70
                  ? "💪 ¡Muy bien! Ya casi lo logras"
                  : stats.progress >= 40
                  ? "⚡ Sigue así, vas por buen camino"
                  : "🚀 ¡Tú puedes! Completa tus tareas"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {instances.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-amber-400 mb-4" />
            <h3 className="font-semibold mb-2">Sin tareas para hoy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crea plantillas con tareas para generar automáticamente cada día
            </p>
            <Button onClick={onOpenSettings}>
              <Settings className="h-4 w-4 mr-2" /> Configurar plantillas
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {instances.map((instance) => (
            <TaskCard
              key={instance.id}
              instance={instance}
              onToggleTask={(taskInstanceId, completed) =>
                toggleTask.mutate({ id: taskInstanceId, completed })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
