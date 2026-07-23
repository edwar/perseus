import { useState } from "react"
import { Plus, X, Pencil, Trash2, HandCoins, Target, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatPercentage } from "@/lib/formats"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { Tabs, TabPanel } from "@/components/ui/tabs"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useSavings, useSavingsMutations, type Goal, type Investment } from "@/hooks/useData"
import { GoalForm } from "./goal-form"
import { InvestmentForm } from "./investment-form"
import { ContributeForm } from "./contribute-form"

export function SavingsContent() {
  const { data: savingsData, isLoading } = useSavings()
  const goals = savingsData?.goals ?? []
  const investments = savingsData?.investments ?? []
  const { addGoal, updateGoal, deleteGoal, addInvestment, updateInvestment, deleteInvestment } = useSavingsMutations()
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [contributing, setContributing] = useState<string | null>(null)
  const [showNewInvestment, setShowNewInvestment] = useState(false)
  const [editGoal, setEditGoal] = useState<string | null>(null)
  const [editInvestment, setEditInvestment] = useState<string | null>(null)
  const [deleteGoalConfirm, setDeleteGoalConfirm] = useState<string | null>(null)
  const [deleteInvestmentConfirm, setDeleteInvestmentConfirm] = useState<string | null>(null)

  function handleContribute(id: string, amount: number) {
    const goal = goals.find((g) => g.id === id)
    if (goal) {
      updateGoal.mutate({ id, name: goal.name, target: goal.target, current: goal.current + amount, deadline: goal.deadline })
    }
    setContributing(null)
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-36 rounded animate-shimmer bg-muted-foreground/20" />
          <div className="h-9 w-24 rounded-lg animate-shimmer bg-muted-foreground/20" />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full animate-shimmer bg-muted-foreground/20" />
                  <div className="flex-1">
                    <div className="h-4 w-28 rounded animate-shimmer bg-muted-foreground/20" />
                    <div className="mt-1 h-3 w-32 rounded animate-shimmer bg-muted-foreground/20" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded animate-shimmer bg-muted-foreground/20" />
                    <div className="h-4 w-24 rounded animate-shimmer bg-muted-foreground/20" />
                  </div>
                  <div className="h-2 w-full rounded-full animate-shimmer bg-muted-foreground/20" />
                  <div className="h-3 w-20 rounded animate-shimmer bg-muted-foreground/20" />
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="h-8 flex-1 rounded-lg animate-shimmer bg-muted-foreground/20" />
                  <div className="h-8 w-8 rounded-lg animate-shimmer bg-muted-foreground/20" />
                  <div className="h-8 w-8 rounded-lg animate-shimmer bg-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <TabPanel id="goals">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Metas de Ahorro</h2>
            <Button className="gap-2" onClick={() => setShowNewGoal(true)}>
              <Plus className="h-4 w-4" /> Crear
            </Button>
          </div>

          {showNewGoal && (
            <GoalForm onSave={async (d) => { await addGoal.mutateAsync({ current: 0, ...d }); setShowNewGoal(false) }} onClose={() => setShowNewGoal(false)} isPending={addGoal.isPending} />
          )}

          {editGoal && (() => {
            const g = goals.find((x) => x.id === editGoal)
            if (!g) return null
            return <GoalForm initial={g} onSave={async (d) => { await updateGoal.mutateAsync({ id: editGoal, current: g.current, ...d }); setEditGoal(null) }} onClose={() => setEditGoal(null)} isPending={updateGoal.isPending} />
          })()}

          {goals.length === 0 && !showNewGoal ? (
            <Empty icon={Target} title="No hay metas de ahorro" description="Crea tu primera meta para empezar a ahorrar" action={<Button size="sm" onClick={() => setShowNewGoal(true)}><Plus className="h-3 w-3" /> Crear</Button>} />
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100
                return (
                  <div key={goal.id} className="rounded-xl border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <Target className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{goal.name}</h3>
                        <p className="text-xs text-muted-foreground">Meta: {formatCurrency(goal.target)}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-semibold">{formatCurrency(goal.current)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{formatPercentage(progress)} · {goal.deadline}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setContributing(contributing === goal.id ? null : goal.id)} className="flex-1 gap-1">
                        <HandCoins className="h-3 w-3" /> Abonar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditGoal(goal.id)} className="gap-1">
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteGoalConfirm(goal.id)} className="gap-1 text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {contributing === goal.id && (
                      <ContributeForm goalName={goal.name} onContribute={(amount) => handleContribute(goal.id, amount)} onClose={() => setContributing(null)} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </TabPanel>

      <TabPanel id="invest">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Inversiones</h2>
            <Button className="gap-2" onClick={() => setShowNewInvestment(true)}>
              <Plus className="h-4 w-4" /> Crear
            </Button>
          </div>

          {showNewInvestment && (
            <InvestmentForm onClose={() => setShowNewInvestment(false)} onSave={async (d) => { await addInvestment.mutateAsync(d); setShowNewInvestment(false) }} isPending={addInvestment.isPending} />
          )}

          {editInvestment && (() => {
            const c = investments.find((x) => x.id === editInvestment)
            if (!c) return null
            return <InvestmentForm initial={c} onSave={async (d) => { await updateInvestment.mutateAsync({ id: editInvestment, ...d }); setEditInvestment(null) }} onClose={() => setEditInvestment(null)} isPending={updateInvestment.isPending} />
          })()}

          {investments.length === 0 && !showNewInvestment ? (
            <Empty icon={Landmark} title="No hay inversiones" description="Abre tu primera inversión para empezar" action={<Button size="sm" onClick={() => setShowNewInvestment(true)}><Plus className="h-3 w-3" /> Crear</Button>} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {investments.map((inv) => {
                const today = new Date()
                const end = new Date(inv.endDate)
                const isActive = end >= today
                const totalDays = inv.termDays
                const elapsedDays = Math.floor((today.getTime() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24))
                const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
                const projectedInterest = inv.amount * (inv.rate / 100) * (inv.termDays / 365)
                return (
                  <div key={inv.id} className="rounded-xl border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Landmark className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{inv.entity}</h3>
                        <p className="text-xs text-muted-foreground">{inv.termDays} días · {inv.rate}% EA</p>
                      </div>
                      <span className={cn("text-xs font-medium", isActive ? "text-emerald-600" : "text-muted-foreground")}>
                        {isActive ? "Activo" : "Vencido"}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Invertido</span>
                        <span className="font-semibold">{formatCurrency(inv.amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Interés proyectado</span>
                        <span className="font-semibold text-emerald-600">+{formatCurrency(Math.round(projectedInterest))}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{inv.startDate}</span>
                        <span>{inv.endDate}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className={cn("h-2 rounded-full", isActive ? "bg-blue-500" : "bg-muted-foreground/30")} style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{formatPercentage(progress)} del plazo</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditInvestment(inv.id)} className="flex-1 gap-1">
                        <Pencil className="h-3 w-3" /> Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteInvestmentConfirm(inv.id)} className="gap-1 text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </TabPanel>

      <ConfirmDialog open={!!deleteGoalConfirm} title="Eliminar meta" message={`¿Estás seguro de eliminar "${goals.find((g) => g.id === deleteGoalConfirm)?.name}"?`} onConfirm={() => { if (deleteGoalConfirm) deleteGoal.mutate(deleteGoalConfirm); setDeleteGoalConfirm(null) }} onCancel={() => setDeleteGoalConfirm(null)} />
      <ConfirmDialog open={!!deleteInvestmentConfirm} title="Eliminar inversión" message={`¿Estás seguro de eliminar la inversión de "${investments.find((c) => c.id === deleteInvestmentConfirm)?.entity}"?`} onConfirm={() => { if (deleteInvestmentConfirm) deleteInvestment.mutate(deleteInvestmentConfirm); setDeleteInvestmentConfirm(null) }} onCancel={() => setDeleteInvestmentConfirm(null)} />
    </>
  )
}
