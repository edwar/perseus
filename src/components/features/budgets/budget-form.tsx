import { useState, useMemo, useCallback } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/ui/currency-input"
import { BUDGET_COLORS } from "@/lib/constants"
import { formatCurrency } from "@/lib/formats"
import type { Budget } from "@/hooks/use-budgets"

interface BudgetFormProps {
  initial?: Budget
  onSave: (data: Omit<Budget, "id"> & { id?: string }) => void
  onClose: () => void
  isPending?: boolean
}

export function BudgetForm({ initial, onSave, onClose, isPending }: BudgetFormProps) {
  const [category, setCategory] = useState(initial?.category ?? "")
  const [color, setColor] = useState(initial?.color ?? BUDGET_COLORS[0])
  const [items, setItems] = useState<{ name: string; amount: string }[]>(
    Array.isArray(initial?.items) ? initial!.items.map((i: { name: string; amount: number }) => ({ name: i.name, amount: String(i.amount) })) : [{ name: "", amount: "" }]
  )

  const total = useMemo(
    () => items.reduce((sum, i) => sum + (Number.parseFloat(i.amount.replace(",", ".")) || 0), 0),
    [items]
  )

  const updateItem = useCallback((index: number, field: "name" | "amount", value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }, [])

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, { name: "", amount: "" }])
  }, [])

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) return
    const parsedItems = items
      .map((i) => ({ name: i.name.trim(), amount: Number.parseFloat(i.amount.replace(",", ".")) || 0 }))
      .filter((i) => i.name || i.amount > 0)
    const hasItems = parsedItems.length > 0 && parsedItems.some((i) => i.name)
    onSave({
      category,
      amount: hasItems ? total : Number.parseFloat(items[0]?.amount.replace(",", ".") || "0"),
      color,
      items: hasItems ? parsedItems : undefined,
    })
  }

  const isValid = category && (items.some((i) => i.amount && Number.parseFloat(i.amount.replace(",", ".")) > 0))

  return (
    <Card className="rounded-2xl border-0 shadow-md">
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">{initial ? "Editar" : "Nuevo"} presupuesto</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Categoría</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Ocio" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Actividades</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addItem} className="h-6 gap-1 text-xs">
                <Plus className="h-3 w-3" /> Añadir
              </Button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(i, "name", e.target.value)}
                    placeholder="Nombre (ej: Cine)"
                    className="h-8 text-xs"
                  />
                  <CurrencyInput
                    value={item.amount}
                    onChange={(v) => updateItem(i, "amount", v)}
                    placeholder="0"
                    className="h-8 w-28 text-xs [&>input]:h-8 [&>input]:text-xs"
                  />
                  {items.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i)} className="h-8 w-8 shrink-0">
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {items.some((i) => i.amount) && (
              <p className="text-xs text-muted-foreground">
                Total: <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Color</Label>
            <div className="flex gap-2">
              {BUDGET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex md:justify-end">
            <Button type="submit" className="w-full md:w-auto md:end" disabled={!isValid || isPending}>
              {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear presupuesto"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
