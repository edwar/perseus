import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ObligationFormProps {
  initial?: { name: string }
  onSave: (d: { name: string }) => void
  onClose: () => void
  isPending?: boolean
}

export function ObligationForm({ initial, onSave, onClose, isPending }: ObligationFormProps) {
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
        <div className="flex md:justify-end">
          <Button className="w-full md:w-auto md:end" disabled={!name || isPending} onClick={() => onSave({ name })}>
            {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear obligación"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
