"use client"

import { useEffect, useState } from "react"
import { Plus, X, Pencil, Trash2, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Empty } from "@/components/ui/empty"
import { useObligationsStore } from "@/store/obligations-store"
import { useHeaderStore } from "@/store/header-store"

export default function ObligationsPage() {
  const obligations = useObligationsStore((s) => s.obligations)
  const checks = useObligationsStore((s) => s.checks)
  const togglePaid = useObligationsStore((s) => s.togglePaid)
  const addObligation = useObligationsStore((s) => s.addObligation)
  const updateObligation = useObligationsStore((s) => s.updateObligation)
  const deleteObligation = useObligationsStore((s) => s.deleteObligation)
  const setHeaderAction = useHeaderStore((s) => s.setAction)
  const budgets = useBudgetStore((s) => s.budgets)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })

  useEffect(() => {
    setHeaderAction(<Button size="sm" onClick={() => { setEditId(null); setShowForm(true) }}><Plus className="h-4 w-4" /> Crear</Button>)
    return () => setHeaderAction(null)
  }, [])

  const monthName = (m: string) => {
    const d = new Date(m + "-01")
    return d.toLocaleDateString("es", { month: "long", year: "numeric" })
  }

  const currentCheck = checks.find((c) => c.month === currentMonth)
  const paidIds = currentCheck?.paid ?? []
  const total = obligations.length
  const paid = obligations.filter((o) => paidIds.includes(o.id)).length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold max-md:hidden">Obligaciones</h1>

      {/* Month navigation */}
      <Card>
        <CardContent className="flex items-center justify-between py-3">
          <Button variant="ghost" size="sm" onClick={() => {
            const d = new Date(currentMonth + "-01")
            d.setMonth(d.getMonth() - 1)
            setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`)
          }}><ChevronLeft className="h-4 w-4" /></Button>
          <div className="text-center">
            <p className="text-sm font-semibold capitalize">{monthName(currentMonth)}</p>
            {total > 0 && <p className="text-xs text-muted-foreground">{paid} de {total} pagadas</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => {
            const d = new Date(currentMonth + "-01")
            d.setMonth(d.getMonth() + 1)
            setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`)
          }}><ChevronRight className="h-4 w-4" /></Button>
        </CardContent>
        {total > 0 && (
          <div className="h-2 bg-muted mx-5 mb-4 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(paid / total) * 100}%` }} />
          </div>
        )}
      </Card>

      {showForm && (
        <ObligationForm
          initial={editId ? obligations.find((o) => o.id === editId) ?? undefined : undefined}
          onSave={(d) => {
            if (editId) { updateObligation(editId, d); setEditId(null) } else { addObligation(d) }
            setShowForm(false)
          }}
          onClose={() => { setShowForm(false); setEditId(null) }}
        />
      )}

      {obligations.length === 0 && !showForm ? (
        <Empty icon={Check} title="No hay obligaciones" description="Agrega tus pagos mensuales recurrentes para hacer seguimiento" action={<Button size="sm" onClick={() => setShowForm(true)}><Plus className="h-3 w-3" /> Crear obligación</Button>} />
      ) : (
      <div className="space-y-2">
        {obligations.map((obl) => {
          const isPaid = paidIds.includes(obl.id)
          return (
            <Card key={obl.id} className={isPaid ? "opacity-60" : ""}>
              <CardContent className="flex items-center gap-3 py-3 px-4">
                <button
                  onClick={() => togglePaid(obl.id, currentMonth)}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isPaid ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/30 hover:border-primary"
                  )}
                >
                  {isPaid && <Check className="h-3.5 w-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium truncate", isPaid && "line-through")}>{obl.name}</p>
                </div>
                <Button variant="ghost" size="icon-xs" onClick={() => { setEditId(obl.id); setShowForm(true) }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon-xs" onClick={() => setDeleteId(obl.id)} className="text-red-500">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Eliminar obligación" message={`¿Estás seguro?`} onConfirm={() => { if (deleteId) deleteObligation(deleteId); setDeleteId(null) }} onCancel={() => setDeleteId(null)} />
    </div>
  )
}

import { cn } from "@/lib/utils"

function ObligationForm({ initial, onSave, onClose }: {
  initial?: { name: string }
  onSave: (d: { name: string }) => void
  onClose: () => void
}) {
  const [name, setName] = useState(initial?.name ?? "")

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{initial ? "Editar" : "Nueva"} obligación</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Nombre</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Arriendo" />
        </div>
        <Button className="w-full" disabled={!name} onClick={() => onSave({ name })}>
          {initial ? "Guardar cambios" : "Crear obligación"}
        </Button>
      </CardContent>
    </Card>
  )
}
