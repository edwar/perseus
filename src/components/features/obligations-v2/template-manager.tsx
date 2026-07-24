"use client"

import { useState } from "react"
import { Plus, X, Pencil, Trash2, Dumbbell, BookOpen, ShoppingBag, Home, Heart, Briefcase, Sparkles } from "lucide-react"
import { OBLIGATION_FREQ_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useObligationTemplates, useObligationMutations, type ObligationTemplate } from "@/hooks/use-obligations-v2"

const EMOJIS = ["💧", "🏋️", "📚", "🛒", "🏠", "💪", "🎯", "🧘", "🥗", "💊", "🧹", "👔", "💰", "📞", "✈️", "🎨"]

const CATEGORIES = [
  { label: "Salud", icon: Heart, color: "bg-rose-100 text-rose-600" },
  { label: "Hogar", icon: Home, color: "bg-blue-100 text-blue-600" },
  { label: "Trabajo", icon: Briefcase, color: "bg-violet-100 text-violet-600" },
  { label: "Ejercicio", icon: Dumbbell, color: "bg-emerald-100 text-emerald-600" },
  { label: "Educación", icon: BookOpen, color: "bg-amber-100 text-amber-600" },
  { label: "Compras", icon: ShoppingBag, color: "bg-cyan-100 text-cyan-600" },
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
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Mis Plantillas
        </h2>
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
              await updateTemplate.mutateAsync({ ...editing, ...data })
            } else {
              await addTemplate.mutateAsync(data as Omit<ObligationTemplate, "id">)
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
            <CardContent className="flex items-center gap-3 p-4">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && !showForm && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-amber-400 mb-4" />
            <h3 className="font-semibold mb-2">Crea tu primera plantilla</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Las plantillas te permiten reutilizar tareas recurrentes
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
        message="Se eliminarán también todas las instancias creadas. ¿Continuar?"
        onConfirm={() => { if (deleteConfirm) deleteTemplate.mutate(deleteConfirm); setDeleteConfirm(null) }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

function TemplateForm({ initial, onSave, onClose, isPending }: {
  initial?: ObligationTemplate | null
  onSave: (data: Omit<ObligationTemplate, "id">) => void
  onClose: () => void
  isPending?: boolean
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [emoji, setEmoji] = useState(initial?.emoji ?? "📋")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [frequency, setFrequency] = useState(initial?.frequency ?? "daily")
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(initial?.daysOfWeek ?? [])
  const [timesPerDay, setTimesPerDay] = useState(initial?.timesPerDay ?? 1)

  function toggleDay(day: number) {
    setDaysOfWeek(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return
    onSave({
      name,
      emoji,
      category: category || null,
      frequency: frequency as ObligationTemplate["frequency"],
      daysOfWeek: frequency === "weekly" ? daysOfWeek : null,
      timesPerDay,
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-all ${emoji === e ? "bg-primary/20 scale-110 ring-2 ring-primary" : "bg-muted hover:bg-muted/80"
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
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Tomar agua" />
            </div>
            <div className="space-y-1">
              <Label>Categoría</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.label} value={c.label}>{c.label}</SelectItem>
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
                    className={`h-10 w-10 rounded-lg text-xs font-medium transition-all ${daysOfWeek.includes(d.value)
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

          <div className="block gap-2">
            <Button type="button" variant="outline" className="w-full" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="w-full" disabled={!name || isPending}>
              {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear plantilla"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
