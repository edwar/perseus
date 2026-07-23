import { useState } from "react"
import { X, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import type { Investment } from "@/hooks/use-savings"

interface InvestmentFormProps {
  initial?: Investment
  onClose: () => void
  onSave: (inv: Omit<Investment, "id">) => void
  isPending?: boolean
}

export function InvestmentForm({ initial, onClose, onSave, isPending }: InvestmentFormProps) {
  const [entity, setEntity] = useState(initial?.entity ?? "")
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "")
  const [rate, setRate] = useState(initial ? String(initial.rate) : "")
  const [termDays, setTermDays] = useState(initial ? String(initial.termDays) : "")
  const [startDate, setStartDate] = useState(initial?.startDate ?? "")
  const termOptions = [30, 60, 90, 180, 360, 720]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entity || !amount || !rate || !termDays || !startDate) return
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + Number(termDays))
    onSave({ entity, amount: Number(amount), rate: Number(rate), termDays: Number(termDays), startDate, endDate: end.toISOString().split("T")[0] })
    onClose()
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{initial ? "Editar" : "Nueva"} inversión</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Entidad financiera</Label>
            <Input value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="Ej: Bancolombia" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Monto</Label>
            <CurrencyInput value={amount} onChange={setAmount} placeholder="0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Tasa EA %</Label>
              <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Ej: 11.5" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Plazo (días)</Label>
              <Select value={termDays} onValueChange={(v) => v && setTermDays(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {termOptions.map((d) => (<SelectItem key={d} value={String(d)}>{d} días</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Fecha de apertura</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={!entity || !amount || !rate || !termDays || !startDate || isPending}>
            {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear inversión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
