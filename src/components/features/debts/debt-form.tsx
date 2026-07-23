import { useState, Suspense, lazy } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useBudgets } from "@/hooks/useData"
import type { DebtInvoiceData } from "@/lib/ia"

const Scanner = lazy(() => import("@/components/scanner").then((m) => ({ default: m.Scanner })) as Promise<{ default: React.ComponentType<{ mode: "invoice"; onResult: (data: DebtInvoiceData) => void }> }>)

interface DebtFormProps {
  initial?: { name: string; category: string; total: number; remaining: number; rate: number; monthly: number; installments: number; paid: number }
  onSave: (data: { name: string; creditor: string; category: string; total: number; remaining: number; rate: number; monthly: number; installments: number; paid: number }) => void
  onClose: () => void
  isPending?: boolean
}

export function DebtForm({ initial, onSave, onClose, isPending }: DebtFormProps) {
  const { data: budgetData } = useBudgets()
  const budgets = budgetData ?? []
  const [name, setName] = useState(initial?.name ?? "")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [total, setTotal] = useState(initial ? String(initial.total) : "")
  const [remaining, setRemaining] = useState(initial ? String(initial.remaining) : "")
  const [rate, setRate] = useState(initial ? String(initial.rate) : "")
  const [monthly, setMonthly] = useState(initial ? String(initial.monthly) : "")
  const [installments, setInstallments] = useState(initial?.installments ? String(initial.installments) : "")
  const [installmentsPaid, setInstallmentsPaid] = useState<number | null>(initial?.paid ?? null)
  const [scanned, setScanned] = useState(!!initial)

  function handleInvoiceResult(data: DebtInvoiceData) {
    if (data.acreedor && !name) {
      setName(`Tarjeta ${data.acreedor}`)
    }
    if (data.totalCuotas) setInstallments(String(data.totalCuotas))
    if (data.cuotasPagadas != null) setInstallmentsPaid(data.cuotasPagadas)
    if (data.montoTotal) setTotal(String(data.montoTotal))
    if (data.saldoActual != null) {
      setRemaining(String(data.saldoActual))
    } else if (data.montoTotal) {
      setRemaining(String(data.montoTotal))
    }
    if (data.pagoMinimo) setMonthly(String(data.pagoMinimo))
    if (data.tasaInteres != null) setRate(String(data.tasaInteres))
    setScanned(true)
  }

  return (
    <Card className="rounded-2xl border-0 shadow-md">
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">{initial ? "Editar" : "Nueva"} deuda</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!initial && (
          <div className="mb-4">
            <Label className="mb-2 block text-xs font-medium">Escanear factura</Label>
            <Suspense fallback={<div className="h-48 animate-shimmer rounded-lg bg-muted" />}>
              <Scanner mode="invoice" onResult={handleInvoiceResult} />
            </Suspense>
          </div>
        )}

        {(scanned || initial) && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Nombre</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Tarjeta Bancolombia" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Presupuesto</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.length === 0 ? (
                      <div className="px-3 py-6 text-center text-xs text-muted-foreground space-y-2"><p>No hay presupuestos</p><button className="text-primary underline" onClick={() => window.location.href = "/budgets"}>Crear presupuesto</button></div>
                    ) : budgets.map((b) => (
                      <SelectItem key={b.id} value={b.category}>{b.category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Total</Label>
                <CurrencyInput value={total} onChange={setTotal} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Saldo pendiente</Label>
                <CurrencyInput value={remaining} onChange={setRemaining} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Tasa %</Label>
                <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Ej: 28.5" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Cuota mensual</Label>
                <CurrencyInput value={monthly} onChange={setMonthly} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Total cuotas</Label>
                <Input type="number" value={installments} onChange={(e) => setInstallments(e.target.value)} placeholder="36" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Pagadas</Label>
                <Input type="number" value={installmentsPaid ?? ""} onChange={(e) => setInstallmentsPaid(e.target.value ? Number(e.target.value) : null)} placeholder="0" />
              </div>
            </div>

            {installments && installmentsPaid != null && (
              <p className="text-xs text-muted-foreground">{Math.round((installmentsPaid / Number(installments)) * 100)}% pagado</p>
            )}

            <div className="flex md:justify-end">
              <Button className="w-full md:w-auto" disabled={isPending} onClick={() => {
                onSave({
                  name: name || "Deuda",
                  creditor: name || "Deuda",
                  category,
                  total: Number(total) || 0,
                  remaining: Number(remaining) || 0,
                  rate: Number(rate) || 0,
                  monthly: Number(monthly) || 0,
                  installments: Number(installments) || 0,
                  paid: installmentsPaid ?? 0,
                })
              }}>{isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear deuda"}</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
