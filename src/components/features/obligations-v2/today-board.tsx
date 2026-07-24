"use client"

import { useMemo, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Settings, Sparkles, Plus } from "lucide-react"
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
  const [showActivateMenu, setShowActivateMenu] = useState(false)

  const { data: templates = [], isLoading: templatesLoading } = useObligationTemplates()
  const { data: instances = [], isLoading: instancesLoading } = useObligationInstances(selectedDate)
  const { createInstances, toggleTask, deleteInstance } = useObligationMutations()

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

  const availableTemplates = useMemo(() => {
    const activeIds = new Set(instances.map(i => i.templateId))
    const dayOfWeek = new Date(selectedDate + "T12:00:00").getDay()
    const selectedDay = new Date(selectedDate + "T12:00:00").getDate()

    return templates
      .filter(t => !activeIds.has(t.id))
      .map(t => {
        let recommended = false
        if (t.frequency === "daily") {
          recommended = true
        } else if (t.frequency === "weekly" && t.daysOfWeek) {
          recommended = t.daysOfWeek.includes(dayOfWeek)
        } else if (t.frequency === "monthly" && t.createdAt) {
          const templateDay = new Date(t.createdAt).getDate()
          recommended = templateDay === selectedDay
        } else if (t.frequency === "once" && t.createdAt) {
          recommended = t.createdAt.split("T")[0] === selectedDate
        }
        return { ...t, recommended }
      })
      .sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0))
  }, [templates, instances, selectedDate])

  const navigateDate = (delta: number) => {
    const date = new Date(selectedDate + "T12:00:00")
    date.setDate(date.getDate() + delta)
    setSelectedDate(formatDate(date))
  }

  async function activateTemplate(templateId: string) {
    try {
      await createInstances.mutateAsync({ templateId, date: selectedDate })
    } catch {
      // ignore
    }
    setShowActivateMenu(false)
  }

  async function deleteInstanceById(instanceId: string) {
    try {
      await deleteInstance.mutateAsync(instanceId)
    } catch {
      // ignore
    }
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

      {templatesLoading || instancesLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border-2 border-border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted animate-shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-muted animate-shimmer" />
                  <div className="h-3 w-20 rounded bg-muted animate-shimmer" />
                </div>
                <div className="h-2 w-20 rounded-full bg-muted animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : instances.length === 0 && templates.length === 0 ? (
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
              onDelete={deleteInstanceById}
            />
          ))}

          {availableTemplates.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setShowActivateMenu(!showActivateMenu)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Activar plantilla
              </Button>

              {showActivateMenu && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-10 shadow-lg">
                  <CardContent className="p-2">
                    {availableTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => activateTemplate(template.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-muted transition-colors"
                      >
                        <span className="text-xl">{template.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{template.name}</p>
                            {template.recommended && (
                              <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {template.tasks.length} tareas
                          </p>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
