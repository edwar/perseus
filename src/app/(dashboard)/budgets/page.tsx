"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus, PiggyBank } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useBudgets, useBudgetMutations, useTransactions, type Budget } from "@/hooks/useData"
import { useDateFilterStore } from "@/store/date-filter-store"
import { BudgetsLoadingSkeleton } from "@/components/features/budgets/budgets-loading-skeleton"
import { BudgetCard } from "@/components/features/budgets/budget-card"
import { BudgetSummary } from "@/components/features/budgets/budget-summary"
import { BudgetForm } from "@/components/features/budgets/budget-form"
import { ActivitiesModal } from "@/components/features/budgets/activities-modal"
import { DateFilter } from "@/components/features/dashboard/date-filter"

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

  const { getActiveRange } = useDateFilterStore()
  const activeRange = getActiveRange()

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.date >= activeRange.start && t.date <= activeRange.end)
  }, [transactions, activeRange])

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const tx of filteredTransactions) {
      if (tx.type !== "EXPENSE" || !tx.category) continue
      map[tx.category] = (map[tx.category] ?? 0) + tx.amount
    }
    return map
  }, [filteredTransactions])

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
      <div className="hidden md:flex items-center gap-2">
        <DateFilter monthOnly />
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus className="h-4 w-4" /> Crear
        </Button>
      </div>
    )
    return () => setHeaderAction(null)
  }, [setHeaderAction])

  if (isLoading) return <BudgetsLoadingSkeleton />

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-hidden">
      <div className="flex md:hidden mt-6 items-center justify-between gap-2">
        <DateFilter monthOnly />
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

      {budgets.length > 0 && <BudgetSummary budgets={budgets} transactions={filteredTransactions} />}

      {budgets.length === 0 ? (
        <Empty icon={PiggyBank} title="No hay presupuestos" description="Crea tu primer presupuesto para controlar tus gastos" action={<Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {budgets.map((budget, i) => (
            <div key={budget.id} className="animate-stagger-in" style={{ animationDelay: `${150 + i * 50}ms` }}>
              <BudgetCard
                budget={budget}
                spent={spentByCategory[budget.category] ?? 0}
                onEdit={(id) => { setEditing(id); setShowForm(true) }}
                onDelete={setDeleteConfirm}
                onViewActivities={setViewActivities}
              />
            </div>
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
