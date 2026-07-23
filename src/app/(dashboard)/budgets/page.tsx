"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus, PiggyBank } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useBudgets, useBudgetMutations, useTransactions, type Budget } from "@/hooks/useData"
import { BudgetsLoadingSkeleton } from "@/components/features/budgets/budgets-loading-skeleton"
import { BudgetCard } from "@/components/features/budgets/budget-card"
import { BudgetSummary } from "@/components/features/budgets/budget-summary"
import { BudgetForm } from "@/components/features/budgets/budget-form"
import { ActivitiesModal } from "@/components/features/budgets/activities-modal"

export default function BudgetsPage() {
  const { data: transactionsData } = useTransactions()
  const transactions = transactionsData ?? []
  const { data: budgetsData, isLoading } = useBudgets()
  const budgets = budgetsData ?? []
  const { add: addBudget, update: updateBudget, remove: removeBudget } = useBudgetMutations()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewActivities, setViewActivities] = useState<Budget | null>(null)

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const tx of transactions) {
      if (tx.type !== "EXPENSE") continue
      map[tx.category] = (map[tx.category] ?? 0) + tx.amount
    }
    return map
  }, [transactions])

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

  if (isLoading) return <BudgetsLoadingSkeleton />

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

      {budgets.length > 0 && <BudgetSummary budgets={budgets} />}

      {budgets.length === 0 ? (
        <Empty icon={PiggyBank} title="No hay presupuestos" description="Crea tu primer presupuesto para controlar tus gastos" action={<Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={spentByCategory[budget.category] ?? 0}
              onEdit={(id) => { setEditing(id); setShowForm(true) }}
              onDelete={setDeleteConfirm}
              onViewActivities={setViewActivities}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Eliminar presupuesto"
        message={`¿Estás seguro de eliminar el presupuesto de "${budgets.find((b) => b.id === deleteConfirm)?.category}"?`}
        onConfirm={() => { if (deleteConfirm) removeBudget.mutate(deleteConfirm); setDeleteConfirm(null) }}
        onCancel={() => setDeleteConfirm(null)}
      />

      {viewActivities && (
        <ActivitiesModal budget={viewActivities} onClose={() => setViewActivities(null)} />
      )}
    </div>
  )
}
