"use client"

import { useEffect, useState, useMemo } from "react"
import { Plus, Pencil, Trash2, X, PiggyBank } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useTransactionStore } from "@/store/transaction-store"
import { useBudgetStore, type Budget } from "@/store/budget-store"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Empty } from "@/components/ui/empty"

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#10b981", "#ec4899", "#14b8a6", "#f97316"]

export default function BudgetsPage() {
  const transactions = useTransactionStore((s) => s.transactions)
  const budgets = useBudgetStore((s) => s.budgets)
  const upsertBudget = useBudgetStore((s) => s.upsertBudget)
  const deleteBudget = useBudgetStore((s) => s.deleteBudget)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const tx of transactions) {
      if (tx.type !== "EXPENSE") continue
      map[tx.category] = (map[tx.category] ?? 0) + tx.amount
    }
    return map
  }, [transactions])

  function handleSave(data: Omit<Budget, "id"> & { id?: string }) {
    upsertBudget(editing ? { id: editing, ...data } : data)
    setShowForm(false)
    setEditing(null)
  }

  const editBudget = budgets.find((b) => b.id === editing)
  const setHeaderAction = useHeaderStore((s) => s.setAction)
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t) }, [])
  useEffect(() => { setHeaderAction(<Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}><Plus className="h-4 w-4" /> Crear</Button>); return () => setHeaderAction(null) }, [])

  if (!ready) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Presupuestos</h1><div className="h-9 w-36 animate-pulse rounded-lg bg-muted" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent>
              <div className="flex items-center gap-2"><div className="h-3 w-3 animate-pulse rounded-full bg-muted" /><div className="h-4 w-28 animate-pulse rounded bg-muted flex-1" /><div className="h-4 w-32 animate-pulse rounded bg-muted" /></div>
              <div className="mt-3 h-2 animate-pulse rounded-full bg-muted" />
              <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
            </CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold max-md:hidden">Presupuestos</h1>

      {showForm && (
        <BudgetForm
          initial={editBudget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {budgets.length === 0 ? (
        <Empty icon={PiggyBank} title="No hay presupuestos" description="Crea tu primer presupuesto para controlar tus gastos" action={<Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {budgets.map((budget) => {
            const spent = spentByCategory[budget.category] ?? 0
            const percentage = (spent / budget.amount) * 100
            const isOverBudget = percentage >= 100
            return (
              <Card key={budget.id}>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: budget.color }} />
                      <h3 className="font-semibold">{budget.category}</h3>
                    </div>
                    <span className={`text-sm font-semibold ${isOverBudget ? "text-red-600" : ""}`}>
                      ${spent.toLocaleString("es-CO")} / ${budget.amount.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${isOverBudget ? "bg-red-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{Math.round(percentage)}% usado</p>

                  <div className="mt-3 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(budget.id); setShowForm(true) }} className="flex-1 gap-1">
                      <Pencil className="h-3 w-3" /> Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(budget.id)} className="gap-1 text-red-500 hover:text-red-700">
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
        title="Eliminar presupuesto"
        message={`¿Estás seguro de eliminar el presupuesto de "${budgets.find((b) => b.id === deleteConfirm)?.category}"?`}
        onConfirm={() => { if (deleteConfirm) deleteBudget(deleteConfirm); setDeleteConfirm(null) }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

function BudgetForm({ initial, onSave, onClose }: {
  initial?: Budget
  onSave: (data: Omit<Budget, "id"> & { id?: string }) => void
  onClose: () => void
}) {
  const [category, setCategory] = useState(initial?.category ?? "")
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "")
  const [color, setColor] = useState(initial?.color ?? COLORS[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category || !amount) return
    onSave({ category, amount: Number(amount), color })
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">{initial ? "Editar" : "Nuevo"} presupuesto</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Categoría</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Alimentos" />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Presupuesto mensual</Label>
            <CurrencyInput value={amount} onChange={setAmount} placeholder="0" />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Color</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
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

          <Button type="submit" className="w-full" disabled={!category || !amount}>
            {initial ? "Guardar cambios" : "Crear presupuesto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
