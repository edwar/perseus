"use client"

import { useMemo, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Settings, Sparkles, Plus, CheckCircle2, ListTodo, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toLocalDateString } from "@/lib/formats"
import { ProgressRing } from "./progress-ring"
import { StreakCounter } from "./streak-counter"
import { TaskCard } from "./task-card"
import { useObligationTemplates, useObligationInstances, useObligationMutations } from "@/hooks/use-obligations-v2"

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })
}

function isToday(dateStr: string): boolean {
  return dateStr === toLocalDateString(new Date())
}

export function TodayBoard({ onOpenSettings }: { onOpenSettings: () => void }) {
  const today = useMemo(() => toLocalDateString(new Date()), [])
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
    return { total, completed, progress, pending: total - completed }
  }, [instances])

  const streak = useMemo(() => {
    let count = 0
    const checkDate = new Date()

    for (let i = 0; i < 365; i++) {
      const dateStr = toLocalDateString(checkDate)
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
    setSelectedDate(toLocalDateString(date))
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

  if (templatesLoading || instancesLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 animate-shimmer rounded bg-muted-foreground/15" />
            <div className="h-4 w-40 animate-shimmer rounded bg-muted-foreground/15" />
          </div>
          <div className="h-10 w-10 animate-shimmer rounded-lg bg-muted-foreground/15" />
        </div>

        {/* Nav Skeleton */}
        <div className="flex items-center gap-3 p-1 rounded-2xl bg-card border border-border/50">
          <div className="h-10 w-10 shrink-0 animate-shimmer rounded-lg bg-muted-foreground/15" />
          <div className="flex-1 h-10 animate-shimmer rounded-lg bg-muted-foreground/15" />
          <div className="h-10 w-10 shrink-0 animate-shimmer rounded-lg bg-muted-foreground/15" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid gap-4 grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-6 w-8 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Streak + Motivation Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 animate-shimmer rounded-full bg-muted-foreground/15" />
          <div className="h-4 w-48 animate-shimmer rounded bg-muted-foreground/15" />
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 animate-shimmer rounded bg-muted-foreground/20" />
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" />
                      <div className="h-1.5 flex-1 max-w-[100px] rounded-full bg-muted-foreground/15 animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-4 w-4 animate-shimmer rounded bg-muted-foreground/15" />
                    <div className="h-4 w-4 animate-shimmer rounded bg-muted-foreground/15" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize">
            {isToday(selectedDate) ? "Hoy" : formatDisplayDate(selectedDate)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.completed} de {stats.total} tareas completadas
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onOpenSettings} className="h-10 w-10">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-3 p-1 rounded-2xl bg-card border border-border/50 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)} className="h-10 w-10 shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center">
          <Button
            variant="ghost"
            className="text-sm font-medium gap-2"
            onClick={() => setSelectedDate(today)}
          >
            <Calendar className="h-4 w-4" />
            {isToday(selectedDate) ? "Hoy" : "Ir a hoy"}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDate(1)}
          disabled={selectedDate >= today}
          className="h-10 w-10 shrink-0"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Summary Cards */}
      {instances.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 animate-stagger-in">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-success/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Completadas</p>
                <p className="text-xl font-extrabold text-emerald-700 tracking-tight">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-card border border-warning/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-warning/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-warning/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-warning to-orange-600 text-white shadow-md shadow-warning/25">
                <ListTodo className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warning">Pendientes</p>
                <p className="text-xl font-extrabold text-orange-700 tracking-tight">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-card border border-energy/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-energy/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-energy/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-energy to-flame-600 text-white shadow-md shadow-energy/25">
                <Flame className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-energy">Racha</p>
                <p className="text-xl font-extrabold text-flame-700 tracking-tight">{streak}</p>
                <p className="text-[10px] text-flame-400 font-medium">días</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak + Motivation */}
      {instances.length > 0 && (
        <div className="flex items-center gap-3 animate-stagger-in" style={{ animationDelay: "100ms" }}>
          <StreakCounter streak={streak} />
          <p className="text-sm text-muted-foreground">
            {stats.progress === 100
              ? "¡Felicitaciones! Completaste todo hoy"
              : stats.progress >= 70
                ? "¡Muy bien! Ya casi lo logras"
                : stats.progress >= 40
                  ? "Sigue así, vas por buen camino"
                  : "¡Tú puedes! Completa tus tareas"
            }
          </p>
        </div>
      )}

      {/* Progress Ring */}
      {instances.length > 0 && (
        <div className="fixed -bottom-5 right-2 z-50">
          <ProgressRing progress={stats.progress} size={70} strokeWidth={6} />
        </div>
      )}

      {/* Empty State */}
      {instances.length === 0 && templates.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center animate-stagger-in">
          <div className="relative inline-flex mb-4">
            <div className="absolute inset-0 rounded-2xl bg-warning/10 blur-xl animate-pulse-glow" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-warning/10 to-orange-50 ring-1 ring-warning/20">
              <Sparkles className="h-8 w-8 text-warning" />
            </div>
          </div>
          <h3 className="font-bold text-lg mb-1">Sin tareas para hoy</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
            Crea plantillas con tareas para generar automáticamente cada día
          </p>
          <Button onClick={onOpenSettings} className="gap-2">
            <Settings className="h-4 w-4" /> Configurar plantillas
          </Button>
        </div>
      )}

      {/* Task List */}
      {instances.length > 0 && (
        <div className="space-y-3">
          {instances.map((instance, i) => (
            <div key={instance.id} className="animate-stagger-in" style={{ animationDelay: `${200 + i * 60}ms` }}>
              <TaskCard
                instance={instance}
                onToggleTask={(taskInstanceId, completed) =>
                  toggleTask.mutate({ id: taskInstanceId, completed })
                }
                onDelete={deleteInstanceById}
              />
            </div>
          ))}

          {availableTemplates.length > 0 && (
            <div className="relative animate-stagger-in" style={{ animationDelay: `${200 + instances.length * 60}ms` }}>
              <Button
                variant="outline"
                className="w-full border-dashed h-12 rounded-2xl"
                onClick={() => setShowActivateMenu(!showActivateMenu)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Activar plantilla
              </Button>

              {showActivateMenu && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-10 shadow-xl border-border/50">
                  <CardContent className="p-2">
                    {availableTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => activateTemplate(template.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-muted/50 transition-all duration-200 group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">{template.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{template.name}</p>
                            {template.recommended && (
                              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
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
