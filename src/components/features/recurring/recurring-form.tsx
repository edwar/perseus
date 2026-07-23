import { useState } from "react"
import { X } from "lucide-react"
import { FREQ_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useBudgets, useDebts } from "@/hooks/useData"
import type { RecurringItem } from "@/hooks/use-recurring"

interface RecurringFormProps {
  editItem: RecurringItem | null
  onSave: (data: Omit<RecurringItem, "id">) => void
  onCancel: () => void
  isPending?: boolean
}

export function RecurringForm({ editItem, onSave, onCancel, isPending }: RecurringFormProps) {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix" required />
              </div>

              <div className="space-y-1.5">
                <Label>Monto</Label>
                <CurrencyInput value={amount} onChange={setAmount} placeholder="0" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Frecuencia</Label>
                <Select value={frequency} onValueChange={(value) => value && setFrequency(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{(v) => FREQ_LABELS[v]}</SelectValue>
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
            <div className="flex md:justify-end">
              <Button type="submit" className="w-full md:w-auto md:end" disabled={isPending}>
                {isPending ? "Guardando..." : editItem ? "Guardar cambios" : "Crear recurrente"}
              </Button>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
