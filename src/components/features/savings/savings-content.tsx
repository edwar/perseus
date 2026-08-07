"use client"

import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, HandCoins, Target, Landmark, TrendingUp, Wallet, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatPercentage } from "@/lib/formats"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { TabPanel } from "@/components/ui/tabs"
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

  const goalStats = useMemo(() => {
    const totalTarget = goals.reduce((sum, g) => sum + g.target, 0)
    const totalSaved = goals.reduce((sum, g) => sum + g.current, 0)
    return { totalTarget, totalSaved, count: goals.length }
  }, [goals])

  const investStats = useMemo(() => {
    const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0)
    const totalInterest = investments.reduce((sum, i) => sum + i.amount * (i.rate / 100) * (i.termDays / 365), 0)
    const activeCount = investments.filter(i => new Date(i.endDate) >= new Date()).length
    return { totalInvested, totalInterest, activeCount }
  }, [investments])

  function handleContribute(id: string, amount: number) {
    const goal = goals.find((g) => g.id === id)
    if (goal) {
      updateGoal.mutate({ id, name: goal.name, target: goal.target, current: goal.current + amount, deadline: goal.deadline })
    }
    setContributing(null)
  }

  if (isLoading) {
    return (
      <section className="space-y-6">
        {/* Summary Skeleton */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 animate-shimmer rounded bg-muted-foreground/15" />
          <div className="h-9 w-24 animate-shimmer rounded-lg bg-muted-foreground/15" />
        </div>
        {/* Cards Skeleton */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
              <div className="h-1 w-full animate-shimmer bg-muted-foreground/15" />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/25" />
                    <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" />
                  </div>
                </div>
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between"><div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" /><div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/15" /></div>
                  <div className="h-2 rounded-full animate-shimmer bg-muted-foreground/15" />
                </div>
                <div className="flex gap-2 pt-3 border-t border-border/50">
                  <div className="flex-1 h-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
                  <div className="h-9 w-9 animate-shimmer rounded-lg bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <TabPanel id="goals">
        <section className="space-y-6">
          {/* Summary */}
          {goals.length > 0 && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-stagger-in">
              <div className="relative overflow-hidden rounded-2xl bg-card border border-success/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Ahorrado</p>
                    <p className="text-lg font-extrabold text-emerald-700 tracking-tight">{formatCurrency(goalStats.totalSaved)}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-card border border-growth/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-growth/10">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-growth/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-growth to-jade-600 text-white shadow-md shadow-growth/25">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-growth">Meta total</p>
                    <p className="text-lg font-extrabold tracking-tight" style={{ color: "#00B884" }}>{formatCurrency(goalStats.totalTarget)}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-4 transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-blue-700 text-white shadow-md shadow-primary/25">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Progreso</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-lg font-extrabold text-blue-700 tracking-tight">
                        {goalStats.totalTarget > 0 ? formatPercentage((goalStats.totalSaved / goalStats.totalTarget) * 100) : "0%"}
                      </p>
                      <p className="text-[11px] text-blue-400 font-medium">global</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between animate-stagger-in" style={{ animationDelay: "100ms" }}>
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
              {goals.map((goal, i) => {
                const progress = (goal.current / goal.target) * 100
                const isComplete = progress >= 100
                return (
                  <div key={goal.id} className={cn(
                    "group relative overflow-hidden rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-stagger-in",
                    isComplete ? "border-success/30" : "border-growth/20"
                  )} style={{ animationDelay: `${150 + i * 50}ms` }}>
                    {/* Top accent */}
                    <div className={cn(
                      "h-1 w-full",
                      isComplete
                        ? "bg-linear-to-r from-success to-emerald-400"
                        : "bg-linear-to-r from-growth to-jade-400"
                    )} />

                    {/* Hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-growth/5 to-transparent" />

                    <div className="relative p-5">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                          isComplete
                            ? "bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25"
                            : "bg-linear-to-br from-growth to-jade-600 text-white shadow-md shadow-growth/25"
                        )}>
                          <Target className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm leading-tight truncate">{goal.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Meta: {formatCurrency(goal.target)}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Ahorrado</span>
                          <span className="text-sm font-bold tabular-nums">{formatCurrency(goal.current)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Fecha límite
                          </span>
                          <span className="text-sm font-semibold tabular-nums">{goal.deadline}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold text-muted-foreground">Progreso</span>
                          <span className={cn(
                            "text-[11px] font-bold",
                            isComplete ? "text-success" : "text-growth"
                          )}>{formatPercentage(progress)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700 ease-out",
                              isComplete
                                ? "bg-linear-to-r from-success to-emerald-400"
                                : "bg-linear-to-r from-growth to-jade-400"
                            )}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                        <Button variant="outline" size="sm" onClick={() => setContributing(contributing === goal.id ? null : goal.id)} className="flex-1 gap-1 h-9">
                          <HandCoins className="h-3.5 w-3.5" /> Abonar
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditGoal(goal.id)} className="h-9 w-9">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteGoalConfirm(goal.id)} className="h-9 w-9 text-danger hover:text-danger-hover hover:bg-coral-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {contributing === goal.id && (
                        <ContributeForm goalName={goal.name} onContribute={(amount) => handleContribute(goal.id, amount)} onClose={() => setContributing(null)} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </TabPanel>

      <TabPanel id="invest">
        <section className="space-y-6">
          {/* Summary */}
          {investments.length > 0 && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 animate-stagger-in">
              <div className="relative overflow-hidden rounded-2xl bg-card border border-primary/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 animate-pulse-glow pointer-events-none" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-blue-700 text-white shadow-md shadow-primary/25">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Invertido</p>
                    <p className="text-lg font-extrabold text-blue-700 tracking-tight">{formatCurrency(investStats.totalInvested)}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-card border border-success/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Interés proyectado</p>
                    <p className="text-lg font-extrabold text-emerald-700 tracking-tight">+{formatCurrency(Math.round(investStats.totalInterest))}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-4 transition-all duration-300 hover:shadow-lg">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-xp/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-xp to-purple-700 text-white shadow-md shadow-xp/25">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-xp">Activas</p>
                    <p className="text-lg font-extrabold text-purple-700 tracking-tight">{investStats.activeCount}</p>
                    <p className="text-[10px] text-purple-400 font-medium">inversiones</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between animate-stagger-in" style={{ animationDelay: "100ms" }}>
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
              {investments.map((inv, i) => {
                const today = new Date()
                const end = new Date(inv.endDate)
                const isActive = end >= today
                const totalDays = inv.termDays
                const elapsedDays = Math.floor((today.getTime() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24))
                const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
                const projectedInterest = inv.amount * (inv.rate / 100) * (inv.termDays / 365)
                return (
                  <div key={inv.id} className={cn(
                    "group relative overflow-hidden rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-stagger-in",
                    isActive ? "border-primary/20" : "border-border"
                  )} style={{ animationDelay: `${150 + i * 50}ms` }}>
                    {/* Top accent */}
                    <div className={cn(
                      "h-1 w-full",
                      isActive
                        ? "bg-linear-to-r from-primary to-blue-400"
                        : "bg-linear-to-r from-muted-foreground/30 to-muted-foreground/10"
                    )} />

                    {/* Hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-primary/5 to-transparent" />

                    <div className="relative p-5">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                          isActive
                            ? "bg-linear-to-br from-primary to-blue-700 text-white shadow-md shadow-primary/25"
                            : "bg-linear-to-br from-muted-foreground/20 to-muted-foreground/10 text-muted-foreground"
                        )}>
                          <Landmark className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm leading-tight truncate">{inv.entity}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{inv.termDays} días · {inv.rate}% EA</p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold shrink-0",
                          isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        )}>
                          {isActive ? "Activo" : "Vencido"}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Invertido</span>
                          <span className="text-sm font-bold tabular-nums">{formatCurrency(inv.amount)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Interés proyectado</span>
                          <span className="text-sm font-bold tabular-nums text-success">+{formatCurrency(Math.round(projectedInterest))}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{inv.startDate}</span>
                          <span>{inv.endDate}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold text-muted-foreground">Plazo</span>
                          <span className={cn(
                            "text-[11px] font-bold",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}>{formatPercentage(progress)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700 ease-out",
                              isActive
                                ? "bg-linear-to-r from-primary to-blue-400"
                                : "bg-linear-to-r from-muted-foreground/30 to-muted-foreground/10"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                        <Button variant="outline" size="sm" onClick={() => setEditInvestment(inv.id)} className="flex-1 gap-1 h-9">
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteInvestmentConfirm(inv.id)} className="h-9 w-9 text-danger hover:text-danger-hover hover:bg-coral-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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
