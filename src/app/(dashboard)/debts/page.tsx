"use client"

import { useEffect, useState } from "react"
import { TrendingDown, Plus, X, Pencil, Trash2 } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Scanner } from "@/components/scanner"
import type { DebtInvoiceData } from "@/lib/ia"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Empty } from "@/components/ui/empty"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useDebts, useDebtMutations, useBudgets } from "@/hooks/useData"

export default function DebtsPage() {
  const { data, isLoading } = useDebts()
  const debts = data ?? []
  const { add: addDebt, update: updateDebt, remove: removeDebt } = useDebtMutations()
  const [showAddDebt, setShowAddDebt] = useState(false)
  const [editDebtId, setEditDebtId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const setHeaderAction = useHeaderStore((s) => s.setAction)
  useEffect(() => { setHeaderAction(<Button size="sm" onClick={() => setShowAddDebt(true)}><Plus className="h-4 w-4" /> Crear</Button>); return () => setHeaderAction(null) }, [])

  async function handleSave(data: { name: string; creditor: string; category: string; total: number; remaining: number; rate: number; monthly: number; installments: number; paid: number }, id?: string) {
    if (id) {
      await updateDebt.mutateAsync({ id, ...data, minimum: null, installments: data.installments || null } as any)
      setEditDebtId(null)
    } else {
      await addDebt.mutateAsync({ ...data, minimum: null, installments: data.installments || null } as any)
      setShowAddDebt(false)
    }
  }

  const editDebt = editDebtId ? debts.find((d) => d.id === editDebtId) : null

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mt-10 md:hidden"><h1 className="text-2xl font-bold">Deudas</h1><div className="h-9 w-24 animate-pulse rounded-lg bg-muted" /></div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-md transition-shadow hover:shadow-lg">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-6 w-32 rounded bg-muted-foreground/20" />
                    <div className="mt-1 h-4 w-24 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="h-8 w-20 rounded-lg bg-muted-foreground/20" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm"><div className="h-4 w-16 rounded bg-muted-foreground/20" /><div className="h-4 w-28 rounded bg-muted-foreground/20" /></div>
                  <div className="flex justify-between text-sm"><div className="h-4 w-24 rounded bg-muted-foreground/20" /><div className="h-4 w-24 rounded bg-muted-foreground/20" /></div>
                  <div className="flex justify-between text-sm"><div className="h-4 w-12 rounded bg-muted-foreground/20" /><div className="h-4 w-16 rounded bg-muted-foreground/20" /></div>
                  <div className="h-3 rounded-full bg-muted-foreground/20" />
                  <div className="h-3 w-20 rounded bg-muted-foreground/20" />
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="flex-1 h-9 rounded-lg bg-muted-foreground/20" />
                  <div className="h-9 w-10 rounded-lg bg-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-10 md:hidden">
        <h1 className="text-2xl font-bold">Deudas</h1>
        <Button className="gap-2" onClick={() => setShowAddDebt(true)}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      {showAddDebt && (
        <AddDebtForm onSave={(d) => handleSave(d)} onClose={() => setShowAddDebt(false)} isPending={addDebt.isPending} />
      )}

      {editDebtId && editDebt && (
        <AddDebtForm
          initial={{ name: editDebt.name, category: editDebt.category, total: editDebt.total, remaining: editDebt.remaining, rate: editDebt.rate, monthly: editDebt.monthly, installments: editDebt.installments ?? 0, paid: editDebt.paid }}
          onSave={(d) => handleSave(d, editDebtId)}
          onClose={() => setEditDebtId(null)}
          isPending={updateDebt.isPending}
        />
      )}

      {debts.length === 0 && !showAddDebt ? (
        <Empty icon={TrendingDown} title="No hay deudas" description="Registra tu primera deuda para hacer seguimiento" action={<Button size="sm" onClick={() => setShowAddDebt(true)}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {debts.map((debt) => {
            const progress = debt.total > 0 ? ((debt.total - debt.remaining) / debt.total) * 100 : 0
            return (
              <Card key={debt.id} className="rounded-2xl border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base">{debt.name}</h3>
                      <p className="text-xs text-muted-foreground">{debt.creditor}{debt.category && <span> · {debt.category}</span>}</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-red-600">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm font-bold">{debt.rate}%</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Restante</span>
                      <span className="font-bold">${debt.remaining.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cuota mensual</span>
                      <span className="font-semibold">${debt.monthly.toLocaleString("es-CO")}</span>
                    </div>
                    {debt.minimum && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pago mínimo</span>
                        <span className="font-semibold text-amber-600">${debt.minimum.toLocaleString("es-CO")}</span>
                      </div>
                    )}
                    {debt.installments && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cuotas</span>
                        <span className="font-semibold">{debt.paid} / {debt.installments}</span>
                      </div>
                    )}
                    <div className="h-2.5 rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">{Math.round(progress)}% pagado</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditDebtId(debt.id)} className="flex-1 gap-1">
                      <Pencil className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(debt.id)} className="gap-1 text-red-500 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Eliminar deuda"
        message={`¿Estás seguro de eliminar "${debts.find((d) => d.id === deleteConfirm)?.name}"?`}
        onConfirm={() => { if (deleteConfirm) removeDebt.mutate(deleteConfirm); setDeleteConfirm(null) }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

function AddDebtForm({ initial, onSave, onClose, isPending }: {
  initial?: { name: string; category: string; total: number; remaining: number; rate: number; monthly: number; installments: number; paid: number }
  onSave: (data: { name: string; creditor: string; category: string; total: number; remaining: number; rate: number; monthly: number; installments: number; paid: number }) => void
  onClose: () => void
  isPending?: boolean
}) {
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
            <Scanner mode="invoice" onResult={handleInvoiceResult} />
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

            <Button className="w-full" disabled={isPending} onClick={() => {
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
        )}
      </CardContent>
    </Card>
  )
}
