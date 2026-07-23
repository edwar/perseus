import { useState } from "react"
import { X, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/ui/currency-input"
import type { Goal } from "@/hooks/use-savings"

interface GoalFormProps {
  initial?: Goal
  onSave?: (d: { name: string; target: number; deadline: string }) => void
  onClose: () => void
  isPending?: boolean
}

export function GoalForm({ initial, onSave, onClose, isPending }: GoalFormProps) {
  const [name, setName] = useState(initial?.name ?? "")
  const [target, setTarget] = useState(initial ? String(initial.target) : "")
  const [deadline, setDeadline] = useState(initial?.deadline ?? "")

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{initial ? "Editar" : "Nueva"} meta</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Fondo de emergencia" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Meta</Label>
              <CurrencyInput value={target} onChange={setTarget} placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Fecha límite</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <div className="flex md:justify-end">
            <Button className="w-full md:w-auto md:end" disabled={!name || !target || isPending} onClick={() => onSave?.({ name, target: Number(target), deadline })}>
              {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear meta"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
