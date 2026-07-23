"use client"

import { useEffect, useState } from "react"
import { TrendingDown, Plus } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useDebts, useDebtMutations } from "@/hooks/useData"
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
    setHeaderAction(<Button size="sm" onClick={() => setShowAddDebt(true)}><Plus className="h-4 w-4" /> Crear</Button>)
    return () => setHeaderAction(null)
  }, [])

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
        <div className="flex items-center justify-between mt-10 md:hidden"><h1 className="text-2xl font-bold">Deudas</h1><div className="h-9 w-24 animate-shimmer rounded-lg bg-muted" /></div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-md transition-shadow hover:shadow-lg">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-6 w-32 animate-shimmer rounded bg-muted-foreground/25" />
                    <div className="mt-1 h-4 w-24 animate-shimmer rounded bg-muted-foreground/15" />
                  </div>
                  <div className="h-8 w-20 animate-shimmer rounded-lg bg-muted-foreground/20" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm"><div className="h-4 w-16 animate-shimmer rounded bg-muted-foreground/20" /><div className="h-4 w-28 animate-shimmer rounded bg-muted-foreground/20" /></div>
                  <div className="flex justify-between text-sm"><div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/20" /><div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/20" /></div>
                  <div className="flex justify-between text-sm"><div className="h-4 w-12 animate-shimmer rounded bg-muted-foreground/20" /><div className="h-4 w-16 animate-shimmer rounded bg-muted-foreground/20" /></div>
                  <div className="h-3 rounded-full animate-shimmer bg-muted-foreground/20" />
                  <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="flex-1 h-9 animate-shimmer rounded-lg bg-muted-foreground/20" />
                  <div className="h-9 w-10 animate-shimmer rounded-lg bg-muted-foreground/20" />
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

      {debts.length === 0 && !showAddDebt ? (
        <Empty icon={TrendingDown} title="No hay deudas" description="Registra tu primera deuda para hacer seguimiento" action={<Button size="sm" onClick={() => setShowAddDebt(true)}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {debts.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              onEdit={setEditDebtId}
              onDelete={setDeleteConfirm}
            />
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
