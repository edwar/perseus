"use client"

import { useState } from "react"
import { Plus, Target, X, HandCoins, Landmark, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Empty } from "@/components/ui/empty"
import { Tabs, TabPanel } from "@/components/ui/tabs"
import { useSavings, useSavingsMutations, type Goal, type Investment } from "@/hooks/useData"

export default function SavingsPage() {
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

  const freqLabels: Record<string, string> = {
    DAILY: "Diario", WEEKLY: "Semanal", BIWEEKLY: "Quincenal",
    MONTHLY: "Mensual", QUARTERLY: "Trimestral", YEARLY: "Anual",
  }

  function handleContribute(id: string, amount: number) {
    const goal = goals.find((g) => g.id === id)
    if (goal) {
      updateGoal.mutate({ id, name: goal.name, target: goal.target, current: goal.current + amount, deadline: goal.deadline })
    }
    setContributing(null)
  }

  return (
    <div className="space-y-6 mt-10 md:mt-0">
      <Tabs tabs={[{ id: "goals", label: "Metas de Ahorro", icon: <Target className="h-4 w-4" /> }, { id: "invest", label: "Inversiones", icon: <Landmark className="h-4 w-4" /> }]}>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-xl bg-muted p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                    <div>
                      <div className="h-4 w-32 rounded bg-muted-foreground/20" />
                      <div className="mt-1 h-3 w-24 rounded bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="h-5 w-24 rounded bg-muted-foreground/20" />
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-muted-foreground/20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                <NewGoalForm onSave={async (d) => { await addGoal.mutateAsync({ current: 0, ...d }); setShowNewGoal(false) }} onClose={() => setShowNewGoal(false)} isPending={addGoal.isPending} />
              )}

              {editGoal && (() => {
                const g = goals.find((x) => x.id === editGoal)
                if (!g) return null
                return <NewGoalForm initial={g} onSave={async (d) => { await updateGoal.mutateAsync({ id: editGoal, current: g.current, ...d }); setEditGoal(null) }} onClose={() => setEditGoal(null)} isPending={updateGoal.isPending} />
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
                            <p className="text-xs text-muted-foreground">Meta: ${goal.target.toLocaleString("es-CO")}</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-semibold">${goal.current.toLocaleString("es-CO")}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground">{Math.round(progress)}% · {goal.deadline}</p>
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
                <NewInvestmentForm onClose={() => setShowNewInvestment(false)} onSave={async (d) => { await addInvestment.mutateAsync(d); setShowNewInvestment(false) }} isPending={addInvestment.isPending} />
              )}

              {editInvestment && (() => {
                const c = investments.find((x) => x.id === editInvestment)
                if (!c) return null
                return <NewInvestmentForm initial={c} onSave={async (d) => { await updateInvestment.mutateAsync({ id: editInvestment, ...d }); setEditInvestment(null) }} onClose={() => setEditInvestment(null)} isPending={updateInvestment.isPending} />
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
                            <span className="font-semibold">${inv.amount.toLocaleString("es-CO")}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Interés proyectado</span>
                            <span className="font-semibold text-emerald-600">+${Math.round(projectedInterest).toLocaleString("es-CO")}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{inv.startDate}</span>
                            <span>{inv.endDate}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted">
                            <div className={cn("h-2 rounded-full", isActive ? "bg-blue-500" : "bg-muted-foreground/30")} style={{ width: `${progress}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground">{Math.round(progress)}% del plazo</p>
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
          </>
        )}
        </Tabs>

      <ConfirmDialog open={!!deleteGoalConfirm} title="Eliminar meta" message={`¿Estás seguro de eliminar "${goals.find((g) => g.id === deleteGoalConfirm)?.name}"?`} onConfirm={() => { if (deleteGoalConfirm) deleteGoal.mutate(deleteGoalConfirm); setDeleteGoalConfirm(null) }} onCancel={() => setDeleteGoalConfirm(null)} />
      <ConfirmDialog open={!!deleteInvestmentConfirm} title="Eliminar inversión" message={`¿Estás seguro de eliminar la inversión de "${investments.find((c) => c.id === deleteInvestmentConfirm)?.entity}"?`} onConfirm={() => { if (deleteInvestmentConfirm) deleteInvestment.mutate(deleteInvestmentConfirm); setDeleteInvestmentConfirm(null) }} onCancel={() => setDeleteInvestmentConfirm(null)} />
    </div>
  )
}

function NewGoalForm({ initial, onSave, onClose, isPending }: {
  initial?: Goal
  onSave?: (d: { name: string; target: number; deadline: string }) => void
  onClose: () => void
  isPending?: boolean
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [target, setTarget] = useState(initial ? String(initial.target) : "")
  const [deadline, setDeadline] = useState(initial?.deadline ?? "")

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{initial ? "Editar" : "Nueva"} meta</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Fondo de emergencia" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Meta</Label>
            <CurrencyInput value={target} onChange={setTarget} placeholder="0" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Fecha límite</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <Button className="w-full" disabled={!name || !target || isPending} onClick={() => onSave?.({ name, target: Number(target), deadline })}>
            {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear meta"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function NewInvestmentForm({ initial, onClose, onSave, isPending }: {
  initial?: Investment
  onClose: () => void
  onSave: (inv: Omit<Investment, "id">) => void
  isPending?: boolean
}) {
  const [entity, setEntity] = useState(initial?.entity ?? "")
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "")
  const [rate, setRate] = useState(initial ? String(initial.rate) : "")
  const [termDays, setTermDays] = useState(initial ? String(initial.termDays) : "")
  const [startDate, setStartDate] = useState(initial?.startDate ?? "")
  const termOptions = [30, 60, 90, 180, 360, 720]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entity || !amount || !rate || !termDays || !startDate) return
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + Number(termDays))
    onSave({ entity, amount: Number(amount), rate: Number(rate), termDays: Number(termDays), startDate, endDate: end.toISOString().split("T")[0] })
    onClose()
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{initial ? "Editar" : "Nueva"} inversión</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Entidad financiera</Label>
            <Input value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="Ej: Bancolombia" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Monto</Label>
            <CurrencyInput value={amount} onChange={setAmount} placeholder="0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Tasa EA %</Label>
              <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Ej: 11.5" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Plazo (días)</Label>
              <Select value={termDays} onValueChange={(v) => v && setTermDays(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {termOptions.map((d) => (<SelectItem key={d} value={String(d)}>{d} días</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Fecha de apertura</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={!entity || !amount || !rate || !termDays || !startDate || isPending}>
            {isPending ? "Guardando..." : initial ? "Guardar cambios" : "Crear inversión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ContributeForm({ goalName, onContribute, onClose }: {
  goalName: string
  onContribute: (amount: number) => void
  onClose: () => void
}) {
  const [amount, setAmount] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount) return
    onContribute(Number(amount))
    setAmount("")
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-lg border p-3">
      <p className="text-xs font-medium">Abonar a {goalName}</p>
      <div className="flex gap-2">
        <div className="flex-1">
          <CurrencyInput value={amount} onChange={setAmount} placeholder="0" className="h-8 text-sm" autoFocus />
        </div>
        <Button type="submit" size="sm" disabled={!amount}>Abonar</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>X</Button>
      </div>
    </form>
  )
}
