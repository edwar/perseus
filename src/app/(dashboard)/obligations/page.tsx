"use client"

import { useState, useEffect } from "react"
import { Plus, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useObligations, useObligationsMutations } from "@/hooks/useData"
import { useHeaderStore } from "@/store/header-store"
import { formatMonthYear } from "@/lib/formats"
import { ObligationForm } from "@/components/features/obligations/obligation-form"
import { ObligationItem } from "@/components/features/obligations/obligation-item"

export default function ObligationsPage() {
  const { data: obligationsData, isLoading } = useObligations()
  const obligations = obligationsData?.obligations ?? []
  const checks = obligationsData?.checks ?? []
  const { add, update, remove, togglePaid } = useObligationsMutations()
  const setHeaderAction = useHeaderStore((s) => s.setAction)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setHeaderAction(
      <Button size="sm" className="gap-1" onClick={() => { setEditId(null); setShowForm(true) }}>
        <Plus className="h-4 w-4" /> Crear
      </Button>
    )
    return () => setHeaderAction(null)
  }, [setHeaderAction])

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonthNum = today.getMonth() + 1
  const thisMonthStr = `${currentYear}-${String(currentMonthNum).padStart(2, "0")}`
  const [currentMonth, setCurrentMonth] = useState(thisMonthStr)
  const isCurrentMonth = currentMonth === thisMonthStr

  const currentCheck = checks.find((c) => c.month === currentMonth)
  const paidIds = currentCheck?.paid ?? []
  const total = obligations.length
  const paid = obligations.filter((o) => paidIds.includes(o.id)).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mt-10 md:hidden"><h1 className="text-2xl font-bold">Obligaciones</h1><div className="h-9 w-24 animate-shimmer rounded-lg bg-muted" /></div>
        <Card>
          <CardContent className="flex items-center justify-between py-3 px-4">
            <div className="h-8 w-8 animate-shimmer rounded-lg bg-muted-foreground/20" />
            <div className="flex-1 text-center">
              <div className="h-4 w-32 mx-auto rounded animate-shimmer bg-muted-foreground/20" />
              <div className="mt-1 h-3 w-20 mx-auto rounded animate-shimmer bg-muted-foreground/20" />
            </div>
            <div className="h-8 w-8 animate-shimmer rounded-lg bg-muted-foreground/20" />
          </CardContent>
          <div className="h-2 bg-muted mx-5 mb-4 rounded-full overflow-hidden">
            <div className="h-full animate-shimmer bg-muted-foreground/20 rounded-full" style={{ width: "50%" }} />
          </div>
        </Card>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-3 py-3 px-4">
                <div className="h-7 w-7 shrink-0 rounded-full animate-shimmer bg-muted-foreground/20" />
                <div className="flex-1 min-w-0">
                  <div className="h-3 w-32 rounded animate-shimmer bg-muted-foreground/20" />
                </div>
                <div className="h-6 w-6 rounded animate-shimmer bg-muted-foreground/20" />
                <div className="h-6 w-6 rounded animate-shimmer bg-muted-foreground/20" />
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
        <h1 className="text-2xl font-bold">Obligaciones</h1>
        <Button className="gap-2" onClick={() => { setEditId(null); setShowForm(true) }}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-3 px-4">
          <Button variant="outline" size="sm" onClick={() => {
            const [y, m] = currentMonth.split("-").map(Number)
            const next = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`
            setCurrentMonth(next)
          }}><ChevronLeft className="h-5 w-5" /></Button>
          <div className="text-center flex-1">
            <p className="text-sm font-semibold capitalize">{formatMonthYear(currentMonth)}</p>
            {total > 0 && <p className="text-xs text-muted-foreground">{paid} de {total} pagadas</p>}
          </div>
          <Button variant="outline" size="sm" disabled={isCurrentMonth} onClick={() => {
            const [y, m] = currentMonth.split("-").map(Number)
            const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`
            setCurrentMonth(next)
          }}><ChevronRight className="h-5 w-5" /></Button>
        </CardContent>
        {total > 0 && (
          <div className="h-2 bg-muted mx-5 mb-4 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(paid / total) * 100}%` }} />
          </div>
        )}
      </Card>

      {showForm && (
        <ObligationForm
          initial={editId ? obligations.find((o) => o.id === editId) ?? undefined : undefined}
          onSave={async (d) => {
            if (editId) { await update.mutateAsync({ id: editId, ...d }); setEditId(null) } else { await add.mutateAsync(d) }
            setShowForm(false)
          }}
          onClose={() => { setShowForm(false); setEditId(null) }}
          isPending={add.isPending || update.isPending}
        />
      )}

      {obligations.length === 0 && !showForm ? (
        <Empty icon={Check} title="No hay obligaciones" description="Agrega tus pagos mensuales recurrentes para hacer seguimiento" action={<Button size="sm" onClick={() => setShowForm(true)}><Plus className="h-3 w-3" /> Crear obligación</Button>} />
      ) : (
        <div className="space-y-2">
          {obligations.map((obl) => (
            <ObligationItem
              key={obl.id}
              obligation={obl}
              isPaid={paidIds.includes(obl.id)}
              onTogglePaid={(id) => togglePaid.mutate({ obligationId: id, month: currentMonth })}
              onEdit={(id) => { setEditId(id); setShowForm(true) }}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Eliminar obligación" message={`¿Estás seguro?`} onConfirm={() => { if (deleteId) remove.mutate(deleteId); setDeleteId(null) }} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
