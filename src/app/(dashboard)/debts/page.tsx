"use client"

import { useEffect, useState, useMemo } from "react"
import { TrendingDown, Plus, AlertTriangle, DollarSign, TrendingUp } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useDebts, useDebtMutations } from "@/hooks/useData"
import { formatCurrency, formatPercentage } from "@/lib/formats"
import { DebtForm } from "@/components/features/debts/debt-form"
import { DebtCard } from "@/components/features/debts/debt-card"

export default function DebtsPage() {
  const { data, isLoading } = useDebts()
  const debts = data ?? []
  const { add: addDebt, update: updateDebt, remove: removeDebt } = useDebtMutations()
  const [showAddDebt, setShowAddDebt] = useState(false)
  const [editDebtId, setEditDebtId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const setHeaderAction = useHeaderStore((s) => s.setAction)

  useEffect(() => {
    setHeaderAction(
      <div className="hidden md:block">
        <Button size="sm" onClick={() => setShowAddDebt(true)}>
          <Plus className="h-4 w-4" /> Crear
        </Button>
      </div>
    )
    return () => setHeaderAction(null)
  }, [])

  const stats = useMemo(() => {
    const totalRemaining = debts.reduce((sum, d) => sum + d.remaining, 0)
    const totalMonthly = debts.reduce((sum, d) => sum + d.monthly, 0)
    const totalOriginal = debts.reduce((sum, d) => sum + d.total, 0)
    const overallProgress = totalOriginal > 0 ? ((totalOriginal - totalRemaining) / totalOriginal) * 100 : 0
    return { totalRemaining, totalMonthly, overallProgress, count: debts.length }
  }, [debts])

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
      <div className="space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-hidden">
        <div className="flex md:hidden mt-6"><div className="h-9 w-24 animate-shimmer rounded-lg bg-muted" /></div>

        {/* Summary Skeleton */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-14 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-5 w-24 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
              <div className="h-1 w-full animate-shimmer bg-muted-foreground/15" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/25" />
                      <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" />
                    </div>
                  </div>
                  <div className="h-6 w-12 animate-shimmer rounded-full bg-muted-foreground/15" />
                </div>
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between"><div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" /><div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/15" /></div>
                  <div className="flex justify-between"><div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/15" /><div className="h-4 w-20 animate-shimmer rounded bg-muted-foreground/15" /></div>
                  <div className="flex justify-between"><div className="h-3 w-14 animate-shimmer rounded bg-muted-foreground/15" /><div className="h-4 w-16 animate-shimmer rounded bg-muted-foreground/15" /></div>
                </div>
                <div className="mb-1"><div className="h-2 rounded-full animate-shimmer bg-muted-foreground/15" /></div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                  <div className="flex-1 h-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
                  <div className="h-9 w-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-hidden">
      <div className="flex md:hidden mt-6">
        <Button className="gap-2" onClick={() => setShowAddDebt(true)}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      {showAddDebt && (
        <DebtForm onSave={(d) => handleSave(d)} onClose={() => setShowAddDebt(false)} isPending={addDebt.isPending} />
      )}

      {editDebtId && editDebt && (
        <DebtForm
          initial={{ name: editDebt.name, category: editDebt.category, total: editDebt.total, remaining: editDebt.remaining, rate: editDebt.rate, monthly: editDebt.monthly, installments: editDebt.installments ?? 0, paid: editDebt.paid }}
          onSave={(d) => handleSave(d, editDebtId)}
          onClose={() => setEditDebtId(null)}
          isPending={updateDebt.isPending}
        />
      )}

      {/* Summary Cards */}
      {debts.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 animate-stagger-in">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-danger/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-danger/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-danger/5 animate-pulse-glow pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-danger to-coral-600 text-white shadow-md shadow-danger/25">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-danger">Total pendiente</p>
                <p className="text-lg font-extrabold text-coral-700 tracking-tight">{formatCurrency(stats.totalRemaining)}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-card border border-warning/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-warning/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-warning/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-warning to-orange-600 text-white shadow-md shadow-warning/25">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warning">Cuota mensual</p>
                <p className="text-lg font-extrabold text-orange-700 tracking-tight">{formatCurrency(stats.totalMonthly)}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-card border border-success/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Progreso total</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-lg font-extrabold text-emerald-700 tracking-tight">{formatPercentage(stats.overallProgress)}</p>
                  <p className="text-[11px] text-emerald-400 font-medium">pagado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {debts.length === 0 && !showAddDebt ? (
        <Empty icon={TrendingDown} title="No hay deudas" description="Registra tu primera deuda para hacer seguimiento" action={<Button size="sm" onClick={() => setShowAddDebt(true)}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {debts.map((debt, i) => (
            <div key={debt.id} className="animate-stagger-in" style={{ animationDelay: `${i * 50}ms` }}>
              <DebtCard
                debt={debt}
                onEdit={setEditDebtId}
                onDelete={setDeleteConfirm}
              />
            </div>
          ))}
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
