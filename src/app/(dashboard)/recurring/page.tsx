"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Repeat, ArrowDown, ArrowUp, TrendingUp, TrendingDown } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRecurring, useRecurringMutations } from "@/hooks/useData"
import { formatCurrency } from "@/lib/formats"
import { RecurringForm } from "@/components/features/recurring/recurring-form"
import { RecurringCard } from "@/components/features/recurring/recurring-card"

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
      <div className="hidden md:block">
        <Button size="sm" className="gap-1" onClick={() => { setEditingId(null); setShowForm(true) }}>
          <Plus className="h-4 w-4" /> Crear
        </Button>
      </div>
    )
    return () => setHeaderAction(null)
  }, [setHeaderAction])

  const stats = useMemo(() => {
    const income = items.filter(i => i.type === "INCOME").reduce((sum, i) => sum + i.amount, 0)
    const expense = items.filter(i => i.type === "EXPENSE").reduce((sum, i) => sum + i.amount, 0)
    return { income, expense, net: income - expense, incomeCount: items.filter(i => i.type === "INCOME").length, expenseCount: items.filter(i => i.type === "EXPENSE").length }
  }, [items])

  const incomeItems = items.filter(i => i.type === "INCOME")
  const expenseItems = items.filter(i => i.type === "EXPENSE")

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-hidden">
      <div className="flex md:hidden mt-6">
        <Button onClick={() => { setEditingId(null); setShowForm(true) }}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      {showForm && (
        <RecurringForm
          editItem={editingId ? items.find((i) => i.id === editingId) ?? null : null}
          onSave={async (data) => {
            if (editingId) {
              await update.mutateAsync({ id: editingId, ...data })
              setEditingId(null)
              setShowForm(false)
            } else {
              await add.mutateAsync(data)
              setShowForm(false)
            }
          }}
          onCancel={() => { setShowForm(false); setEditingId(null) }}
          isPending={add.isPending || update.isPending}
        />
      )}

      {isLoading ? (
        <div className="space-y-6">
          {/* Loading summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 animate-shimmer rounded-xl bg-muted-foreground/15" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                      <div className="h-6 w-28 animate-shimmer rounded bg-muted-foreground/15" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Income section skeleton */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 animate-shimmer rounded-lg bg-muted-foreground/15" />
              <div className="h-4 w-36 animate-shimmer rounded bg-muted-foreground/15" />
              <div className="h-4 w-6 animate-shimmer rounded bg-muted-foreground/15" />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={`income-${i}`} className="border-l-4 border-l-success/30 border-0 shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 animate-shimmer rounded-xl bg-muted-foreground/15" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/15" />
                          <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" />
                        </div>
                      </div>
                      <div className="h-6 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                    </div>
                    <div className="pt-3 border-t border-border/50 flex gap-2">
                      <div className="h-6 w-16 animate-shimmer rounded-full bg-muted-foreground/15" />
                      <div className="h-6 w-14 animate-shimmer rounded-full bg-muted-foreground/15" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Expense section skeleton */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 animate-shimmer rounded-lg bg-muted-foreground/15" />
              <div className="h-4 w-34 animate-shimmer rounded bg-muted-foreground/15" />
              <div className="h-4 w-6 animate-shimmer rounded bg-muted-foreground/15" />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={`expense-${i}`} className="border-l-4 border-l-danger/30 border-0 shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 animate-shimmer rounded-xl bg-muted-foreground/15" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/15" />
                          <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" />
                        </div>
                      </div>
                      <div className="h-6 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                    </div>
                    <div className="pt-3 border-t border-border/50 flex gap-2">
                      <div className="h-6 w-16 animate-shimmer rounded-full bg-muted-foreground/15" />
                      <div className="h-6 w-14 animate-shimmer rounded-full bg-muted-foreground/15" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : items.length === 0 && !showForm ? (
        <Empty icon={Repeat} title="No hay recurrentes" description="Agrega ingresos o gastos recurrentes para automatizar tu registro" action={<Button size="sm" onClick={() => { setEditingId(null); setShowForm(true) }}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-stagger-in">
            {/* Income Summary */}
            <div className="relative overflow-hidden rounded-2xl bg-card border border-success/20 p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" />
              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-success">Ingresos</p>
                  <p className="text-lg sm:text-xl font-extrabold text-emerald-700 tracking-tight">{formatCurrency(stats.income)}</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">{stats.incomeCount} recurrentes</p>
                </div>
              </div>
            </div>

            {/* Expense Summary */}
            <div className="relative overflow-hidden rounded-2xl bg-card border border-danger/20 p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-danger/10">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-danger/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-danger to-coral-600 text-white shadow-md shadow-danger/25">
                  <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-danger">Gastos</p>
                  <p className="text-lg sm:text-xl font-extrabold text-coral-700 tracking-tight">{formatCurrency(stats.expense)}</p>
                  <p className="text-[10px] sm:text-[11px] text-coral-400 font-medium">{stats.expenseCount} recurrentes</p>
                </div>
              </div>
            </div>

            {/* Net Summary */}
            <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-4 sm:p-5 transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-blue-700 text-white shadow-md shadow-primary/25">
                  <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary">Neto mensual</p>
                  <p className={`text-lg sm:text-xl font-extrabold tracking-tight ${stats.net >= 0 ? "text-emerald-700" : "text-coral-700"}`}>
                    {stats.net >= 0 ? "+" : ""}{formatCurrency(stats.net)}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">{items.length} total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Income Section */}
          {incomeItems.length > 0 && (
            <div className="animate-stagger-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10">
                  <ArrowDown className="h-4 w-4 text-success" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Ingresos recurrentes</h2>
                <span className="text-xs text-muted-foreground font-medium">({incomeItems.length})</span>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {incomeItems.map((item, i) => (
                  <div key={item.id} className="animate-stagger-in" style={{ animationDelay: `${150 + i * 40}ms` }}>
                    <RecurringCard
                      item={item}
                      onEdit={(id) => { setEditingId(id); setShowForm(true) }}
                      onDelete={setDeleteConfirm}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expense Section */}
          {expenseItems.length > 0 && (
            <div className="animate-stagger-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-danger/10">
                  <ArrowUp className="h-4 w-4 text-danger" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Gastos recurrentes</h2>
                <span className="text-xs text-muted-foreground font-medium">({expenseItems.length})</span>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {expenseItems.map((item, i) => (
                  <div key={item.id} className="animate-stagger-in" style={{ animationDelay: `${250 + i * 40}ms` }}>
                    <RecurringCard
                      item={item}
                      onEdit={(id) => { setEditingId(id); setShowForm(true) }}
                      onDelete={setDeleteConfirm}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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
