"use client"

import { useState } from "react"
import { Plus, X, Pencil, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { OBLIGATION_FREQ_LABELS } from "@/lib/constants"
import { useObligationTemplates, useObligationMutations, type ObligationTemplate } from "@/hooks/use-obligations-v2"

const EMOJIS = ["💧", "🏋️", "📚", "🛒", "🏠", "💪", "🎯", "🧘", "🥗", "💊", "🧹", "👔", "💰", "📞", "✈️", "🎨", "✓", "⭐", "🔥", "✅"]

const CATEGORIES = [
  "Salud", "Hogar", "Trabajo", "Ejercicio", "Educación", "Compras", "Personal",
]

const DAYS = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
]

interface TemplateManagerProps {
  onClose: () => void
}

export function TemplateManager({ onClose }: TemplateManagerProps) {
  const { data: templates = [] } = useObligationTemplates()
  const { addTemplate, updateTemplate, deleteTemplate } = useObligationMutations()
  const [editing, setEditing] = useState<ObligationTemplate | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Mis Plantillas</h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}>
            <Plus className="h-4 w-4" /> Crear
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showForm && (
        <TemplateForm
          initial={editing}
          onSave={async (data) => {
            if (editing) {
              await updateTemplate.mutateAsync({ ...editing, ...data } as ObligationTemplate)
            } else {
              await addTemplate.mutateAsync(data)
            }
            setShowForm(false)
            setEditing(null)
          }}
          onClose={() => { setShowForm(false); setEditing(null) }}
          isPending={addTemplate.isPending || updateTemplate.isPending}
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {templates.map((t) => (
          <Card key={t.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {OBLIGATION_FREQ_LABELS[t.frequency] ?? t.frequency}
                    {t.timesPerDay > 1 && ` · ${t.timesPerDay}x/día`}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setEditing(t); setShowForm(true) }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(t.id)} className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {t.tasks.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.tasks.map((task) => (
                    <span key={task.id} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {task.emoji} {task.name}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && !showForm && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Crea tu primera plantilla</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Agrega tareas para cada plantilla y márcalas como completadas cada día
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Crear plantilla
            </Button>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Eliminar plantilla"
        message="Se eliminarán también todas las instancias y tareas creadas. ¿Continuar?"
        onConfirm={() => { if (deleteConfirm) deleteTemplate.mutate(deleteConfirm); setDeleteConfirm(null) }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

function TemplateForm({ initial, onSave, onClose, isPending }: {
  initial?: ObligationTemplate | null
  onSave: (data: Omit<ObligationTemplate, "id" | "tasks"> & { tasks?: { name: string; emoji?: string }[] }) => void
  onClose: () => void
  isPending?: boolean
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [emoji, setEmoji] = useState(initial?.emoji ?? "📋")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [frequency, setFrequency] = useState(initial?.frequency ?? "daily")
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(initial?.daysOfWeek ?? [])
  const [timesPerDay, setTimesPerDay] = useState(initial?.timesPerDay ?? 1)
  const [tasks, setTasks] = useState<{ name: string; emoji: string }[]>(
    initial?.tasks.map(t => ({ name: t.name, emoji: t.emoji })) ?? []
  )

  function toggleDay(day: number) {
    setDaysOfWeek(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  function addTask() {
    setTasks(prev => [...prev, { name: "", emoji: "✓" }])
  }

  function updateTask(index: number, field: "name" | "emoji", value: string) {
    setTasks(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t))
  }

  function removeTask(index: number) {
    setTasks(prev => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return
    const validTasks = tasks.filter(t => t.name.trim())
    onSave({
      name,
      emoji,
      category: category || null,
      frequency: frequency as ObligationTemplate["frequency"],
      daysOfWeek: frequency === "weekly" ? daysOfWeek : null,
      timesPerDay,
      tasks: validTasks.length > 0 ? validTasks : undefined,
    })
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{initial ? "Editar" : "Nueva"} plantilla</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    emoji === e ? "bg-primary/20 scale-110 ring-2 ring-primary" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Rutina gym" />
            </div>
            <div className="space-y-1">
              <Label>Categoría</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Frecuencia</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as ObligationTemplate["frequency"])}>
                <SelectTrigger className="w-full">
                  <SelectValue>{(v) => OBLIGATION_FREQ_LABELS[v] ?? v}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="once">Una vez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Veces por día</Label>
              <Select value={String(timesPerDay)} onValueChange={(v) => setTimesPerDay(Number(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "vez" : "veces"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label>Días de la semana</Label>
              <div className="flex gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleDay(d.value)}
                    className={`h-10 w-10 rounded-lg text-xs font-medium transition-all ${
                      daysOfWeek.includes(d.value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tareas</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addTask} className="h-6 gap-1 text-xs">
                <Plus className="h-3 w-3" /> Agregar tarea
              </Button>
            </div>
            {tasks.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Sin tareas — se marcará como completada la plantilla completa
              </p>
            )}
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Select value={task.emoji} onValueChange={(v) => v && updateTask(i, "emoji", v)}>
                    <SelectTrigger className="w-14 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EMOJIS.map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={task.name}
                    onChange={(e) => updateTask(i, "name", e.target.value)}
                    placeholder="Nombre de la tarea"
                    className="flex-1 h-8 text-sm"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(i)} className="h-8 w-8 shrink-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto md:ml-auto" disabled={!name || isPending}>
            {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear plantilla"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
