"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Plus, Pencil, Trash2, X, PiggyBank } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useBalanceStore } from "@/store/balance-store"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Empty } from "@/components/ui/empty"
import { useBudgets, useBudgetMutations, useTransactions, type Budget } from "@/hooks/useData"

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#10b981", "#ec4899", "#14b8a6", "#f97316"]

export default function BudgetsPage() {
  const { data: transactionsData } = useTransactions()
  const transactions = transactionsData ?? []
  const { data: budgetsData, isLoading } = useBudgets()
  const budgets = budgetsData ?? []
  const totalBalance = useBalanceStore((s) => s.balance)
  const { add: addBudget, update: updateBudget, remove: removeBudget } = useBudgetMutations()
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

  const totalBudget = useMemo(() => budgets.reduce((s, b) => s + b.amount, 0), [budgets])

  async function handleSave(data: Omit<Budget, "id"> & { id?: string }) {
    if (editing) {
      await updateBudget.mutateAsync({ id: editing, ...data })
    } else {
      await addBudget.mutateAsync(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const editBudget = budgets.find((b) => b.id === editing)
  const setHeaderAction = useHeaderStore((s) => s.setAction)

  useEffect(() => {
    setHeaderAction(
      <Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}>
        <Plus className="h-4 w-4" /> Crear
      </Button>
    )
    return () => setHeaderAction(null)
  }, [setHeaderAction])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mt-10 md:hidden"><h1 className="text-2xl font-bold">Presupuestos</h1><div className="h-9 w-24 animate-pulse rounded-lg bg-muted" /></div>
        <div className="h-14 w-full animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2].map((i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-md transition-shadow hover:shadow-lg"><CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-muted-foreground/20" />
                  <div className="h-4 w-28 rounded bg-muted-foreground/20" />
                </div>
                <div className="h-4 w-32 rounded bg-muted-foreground/20" />
              </div>
              <div className="mt-3 h-2.5 rounded-full bg-muted-foreground/20" />
              <div className="mt-1.5 h-3 w-16 rounded bg-muted-foreground/20" />
              <div className="mt-3 space-y-1.5 border-t pt-3">
                <div className="h-2 w-20 rounded bg-muted-foreground/20" />
                {[1, 2].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="h-3 w-24 rounded bg-muted-foreground/20" />
                    <div className="h-3 w-20 rounded bg-muted-foreground/20" />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 h-9 rounded-lg bg-muted-foreground/20" />
                <div className="h-9 w-10 rounded-lg bg-muted-foreground/20" />
              </div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-10 md:hidden">
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <Button className="gap-2" onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      {showForm && (
        <BudgetForm
          initial={editBudget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
          isPending={addBudget.isPending || updateBudget.isPending}
        />
      )}

      {budgets.length > 0 && (
        <div className="rounded-2xl border-0 bg-card p-4 text-sm text-muted-foreground shadow-md transition-shadow hover:shadow-lg">
          Presupuesto total estimado:{" "}
          <span className="font-semibold text-foreground">${totalBudget.toLocaleString("es-CO")}</span>
          {totalBalance > 0 && (
            <>
              {" de "}
              <span className="font-semibold text-foreground">${totalBalance.toLocaleString("es-CO")}</span>
              {" — Disponible "}
              <span className="font-semibold text-foreground">${(totalBalance - totalBudget).toLocaleString("es-CO")}</span>
            </>
          )}
        </div>
      )}

      {budgets.length === 0 ? (
        <Empty icon={PiggyBank} title="No hay presupuestos" description="Crea tu primer presupuesto para controlar tus gastos" action={<Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {budgets.map((budget) => {
            const spent = spentByCategory[budget.category] ?? 0
            const percentage = (spent / budget.amount) * 100
            const isOverBudget = percentage >= 100
            const rawItems = Array.isArray(budget.items) ? budget.items : []
            const budgetItems = rawItems.filter((i: { name?: string }) => i.name)

            return (
              <Card key={budget.id} className="rounded-2xl border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col">
                <CardContent className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: budget.color }} />
                      <h3 className="font-bold text-base">{budget.category}</h3>
                    </div>
                    <span className={`text-sm font-bold ${isOverBudget ? "text-red-600" : ""}`}>
                      ${spent.toLocaleString("es-CO")} / ${budget.amount.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-muted">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? "bg-gradient-to-r from-red-400 to-red-600" : "bg-gradient-to-r from-primary/80 to-primary"}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-muted-foreground">{Math.round(percentage)}% usado</p>

                  {budgetItems.length > 0 && (
                    <div className="mt-3 flex-1 space-y-1.5 border-t pt-3 overflow-y-auto max-h-32">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actividades</p>
                      {budgetItems.map((item, i) => {
                        const itemPct = (item.amount / budget.amount) * 100
                        return (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="font-semibold">${item.amount.toLocaleString("es-CO")} ({Math.round(itemPct)}%)</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="mt-auto pt-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditing(budget.id); setShowForm(true) }} className="flex-1 gap-1">
                      <Pencil className="h-3 w-3" /> Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(budget.id)} className="gap-1 text-red-500 hover:text-red-700">
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
        onConfirm={() => { if (deleteConfirm) removeBudget.mutate(deleteConfirm); setDeleteConfirm(null) }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

function BudgetForm({ initial, onSave, onClose, isPending }: {
  initial?: Budget
  onSave: (data: Omit<Budget, "id"> & { id?: string }) => void
  onClose: () => void
  isPending?: boolean
}) {
  const [category, setCategory] = useState(initial?.category ?? "")
  const [color, setColor] = useState(initial?.color ?? COLORS[0])
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
                Total: <span className="font-semibold text-foreground">${total.toLocaleString("es-CO")}</span>
              </p>
            )}
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

          <Button type="submit" className="w-full" disabled={!isValid || isPending}>
            {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear presupuesto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
