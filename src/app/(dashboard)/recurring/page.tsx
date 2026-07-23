"use client"

import { useState, useEffect } from "react"
import { Plus, Repeat } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRecurring, useRecurringMutations } from "@/hooks/useData"
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
      <Button size="sm" className="gap-1" onClick={() => { setEditingId(null); setShowForm(true) }}>
        <Plus className="h-4 w-4" /> Crear
      </Button>
    )
    return () => setHeaderAction(null)
  }, [setHeaderAction])

  return (
    <div className="space-y-6">
      <div className="items-center justify-between mt-10 flex md:hidden">
        <h1 className="text-2xl font-bold">Recurrentes</h1>
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 28 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-10 animate-shimmer rounded-full bg-muted-foreground/20" />
                    <div>
                      <div className="h-4 w-18 animate-shimmer rounded bg-muted-foreground/20" />
                      <div className="mt-1 h-3 w-16 animate-shimmer rounded bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="h-7 w-24 animate-shimmer rounded bg-muted-foreground/20" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/20" />
                    <div className="h-3 w-12 animate-shimmer rounded bg-muted-foreground/20" />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-8 w-8 animate-shimmer rounded bg-muted-foreground/20" />
                    <div className="h-8 w-8 animate-shimmer rounded bg-muted-foreground/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 && !showForm ? (
        <Empty icon={Repeat} title="No hay recurrentes" description="Agrega ingresos o gastos recurrentes para automatizar tu registro" action={<Button size="sm" onClick={() => { setEditingId(null); setShowForm(true) }}><Plus className="h-3 w-3" /> Crear</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <RecurringCard
              key={item.id}
              item={item}
              onEdit={(id) => { setEditingId(id); setShowForm(true) }}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
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
