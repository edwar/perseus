"use client"

import { useState, useEffect } from "react"
import { Plus, Repeat, ArrowUp, ArrowDown, Pencil, Trash2, X } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Empty } from "@/components/ui/empty"
import { useRecurring, useRecurringMutations, type RecurringItem } from "@/hooks/useData"
import { useBudgets, useDebts } from "@/hooks/useData"

const freqLabels: Record<string, string> = {
  DAILY: "Diario", WEEKLY: "Semanal", BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual", QUARTERLY: "Trimestral", YEARLY: "Anual",
}

export default function RecurringPage() {
  const { data: recurringData, isLoading } = useRecurring()
  const items = recurringData ?? []
  const { add, update, remove } = useRecurringMutations()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const setHeaderAction = useHeaderStore((s) => s.setAction)

  useEffect(() => {
    setHeaderAction(
      <Button size="sm" className="gap-1" onClick={() => { setEditingId(null); setShowForm(true) }}>
        <Plus className="h-4 w-4" /> Crear
      </Button>
    )
    return () => setHeaderAction(null)
  }, [setHeaderAction])

  return (
    <div className="space-y-6">
      <div className="items-center justify-between mt-10 flex md:hidden">
        <h1 className="text-2xl font-bold">Recurrentes</h1>
        <Button onClick={() => { setEditingId(null); setShowForm(true) }}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      {showForm && (
        <RecurringForm
          editItem={editingId ? items.find((i) => i.id === editingId) ?? null : null}
          onSave={(data) => {
            if (editingId) {
              update.mutate({ id: editingId, ...data })
              setEditingId(null)
              setShowForm(false)
            } else {
              add.mutate(data)
              setShowForm(false)
            }
          }}
          onCancel={() => { setShowForm(false); setEditingId(null) }}
        />
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-muted p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-10 rounded-full bg-muted-foreground/20" />
                  <div>
                    <div className="h-4 w-18 rounded bg-muted-foreground/20" />
                    <div className="mt-1 h-3 w-16 rounded bg-muted-foreground/20" />
                  </div>
                </div>
                <div className="h-7 w-24 rounded bg-muted-foreground/20" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-16 rounded bg-muted-foreground/20" />
                  <div className="h-3 w-12 rounded bg-muted-foreground/20" />
                </div>
                <div className="flex gap-1">
                  <div className="h-8 w-8 rounded bg-muted-foreground/20" />
                  <div className="h-8 w-8 rounded bg-muted-foreground/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 && !showForm ? (
        <Empty icon={Repeat} title="No hay recurrentes" description="Agrega ingresos o gastos recurrentes para automatizar tu registro" action={<Button size="sm" onClick={() => { setEditingId(null); setShowForm(true) }}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} size="sm">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      item.type === "INCOME" ? "bg-emerald-100" : "bg-red-100"
                    )}>
                      {item.type === "INCOME"
                        ? <ArrowDown className={cn("h-5 w-5 text-emerald-600")} />
                        : <ArrowUp className={cn("h-5 w-5 text-red-600")} />
                      }
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-lg font-bold",
                    item.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                  )}>
                    {item.type === "INCOME" ? "+" : "-"}$
                    {item.amount.toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Repeat className="h-3 w-3" />
                      {freqLabels[item.frequency] ?? item.frequency}
                    </span>
                    <span>Día {item.dayOfMonth}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingId(item.id); setShowForm(true) }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(item.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Eliminar recurrente"
        message={`¿Estás seguro de eliminar "${items.find((i) => i.id === deleteConfirm)?.name}"?`}
        onConfirm={() => { if (deleteConfirm) remove.mutate(deleteConfirm); setDeleteConfirm(null) }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

function RecurringForm({ editItem, onSave, onCancel }: {
  editItem: RecurringItem | null
  onSave: (data: Omit<RecurringItem, "id">) => void
  onCancel: () => void
}) {
  const { data: budgets } = useBudgets()
  const { data: debts } = useDebts()
  const [name, setName] = useState(editItem?.name ?? "")
  const [amount, setAmount] = useState(String(editItem?.amount ?? ""))
  const [type, setType] = useState<"INCOME" | "EXPENSE">(editItem?.type ?? "EXPENSE")
  const [frequency, setFrequency] = useState(editItem?.frequency ?? "MONTHLY")
  const [dayOfMonth, setDayOfMonth] = useState(String(editItem?.dayOfMonth ?? ""))
  const [category, setCategory] = useState(editItem?.category ?? "")
  const [debtId, setDebtId] = useState(editItem?.debtId ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      name, type, frequency,
      amount: Number(amount),
      dayOfMonth: Number(dayOfMonth),
      category,
      debtId: debtId || undefined,
    })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{editItem ? "Editar" : "Nuevo"} recurrente</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "EXPENSE" ? "secondary" : "outline"}
                onClick={() => setType("EXPENSE")}
                className="flex-1"
              >
                Gasto
              </Button>
              <Button
                type="button"
                variant={type === "INCOME" ? "secondary" : "outline"}
                onClick={() => setType("INCOME")}
                className="flex-1"
              >
                Ingreso
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix" required />
            </div>

            {type === "EXPENSE" && (
              <div className="space-y-1.5">
                <Label>Presupuesto que afecta</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar presupuesto" />
                  </SelectTrigger>
                  <SelectContent>
                    {!budgets || budgets.length === 0 ? (
                      <div className="px-3 py-6 text-center text-xs text-muted-foreground space-y-2">
                        <p>No hay presupuestos</p>
                        <Button size="sm" onClick={() => window.location.href = "/budgets"}>Ir a Presupuestos</Button>
                      </div>
                    ) : budgets.map((b) => (
                      <SelectItem key={b.id} value={b.category}>{b.category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Monto</Label>
              <CurrencyInput value={amount} onChange={setAmount} placeholder="0" required />
            </div>

            {type === "EXPENSE" && debts && debts.length > 0 && (
              <div className="space-y-1.5">
                <Label>Asociar a deuda (opcional)</Label>
                <Select value={debtId} onValueChange={(v) => v && setDebtId(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(v: string) => {
                        if (!v) return "Ninguna"
                        const d = debts.find((d) => d.id === v)
                        return d ? `${d.name} — $${d.remaining.toLocaleString("es-CO")}` : v
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ninguna</SelectItem>
                    {debts.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} — ${d.remaining.toLocaleString("es-CO")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Frecuencia</Label>
                <Select value={frequency} onValueChange={(value) => value && setFrequency(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{(v) => freqLabels[v]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Diario</SelectItem>
                    <SelectItem value="WEEKLY">Semanal</SelectItem>
                    <SelectItem value="BIWEEKLY">Quincenal</SelectItem>
                    <SelectItem value="MONTHLY">Mensual</SelectItem>
                    <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                    <SelectItem value="YEARLY">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Día del mes</Label>
                <Input type="number" min={1} max={31} value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} placeholder="15" />
              </div>
            </div>

            <Button type="submit" className="w-full">
              {editItem ? "Guardar cambios" : "Crear recurrente"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
