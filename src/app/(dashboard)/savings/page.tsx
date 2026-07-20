"use client"

import { useEffect, useState } from "react"
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
import { useSavingsStore, type Goal, type Investment } from "@/store/savings-store"

export default function SavingsPage() {
  const goals = useSavingsStore((s) => s.goals)
  const investments = useSavingsStore((s) => s.investments)
  const addGoal = useSavingsStore((s) => s.addGoal)
  const updateGoal = useSavingsStore((s) => s.updateGoal)
  const deleteGoalStore = useSavingsStore((s) => s.deleteGoal)
  const addInvestment = useSavingsStore((s) => s.addInvestment)
  const updateInvestment = useSavingsStore((s) => s.updateInvestment)
  const deleteInvestmentStore = useSavingsStore((s) => s.deleteInvestment)
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [contributing, setContributing] = useState<string | null>(null)
  const [showNewInvestment, setShowNewInvestment] = useState(false)
  const [editGoal, setEditGoal] = useState<string | null>(null)
  const [editInvestment, setEditInvestment] = useState<string | null>(null)
  const [deleteGoal, setDeleteGoal] = useState<string | null>(null)
  const [deleteInvestment, setDeleteInvestment] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t) }, [])

  if (!ready) {
    return (
      <div className="space-y-6">
        <div className="flex gap-1 rounded-xl bg-muted p-1"><div className="flex-1 h-9 animate-pulse rounded-lg bg-muted-foreground/10" /><div className="flex-1 h-9 animate-pulse rounded-lg bg-muted-foreground/10" /></div>
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold"><div className="h-6 w-40 animate-pulse rounded bg-muted" /></h2><div className="h-9 w-28 animate-pulse rounded-lg bg-muted" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}><CardContent>
              <div className="flex items-center gap-3"><div className="h-10 w-10 animate-pulse rounded-full bg-muted" /><div className="flex-1 space-y-1.5"><div className="h-4 w-32 animate-pulse rounded bg-muted" /><div className="h-3 w-24 animate-pulse rounded bg-muted" /></div></div>
              <div className="mt-4 space-y-2"><div className="flex justify-between"><div className="h-3 w-16 animate-pulse rounded bg-muted" /><div className="h-3 w-24 animate-pulse rounded bg-muted" /></div><div className="h-2 animate-pulse rounded-full bg-muted" /></div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  const freqLabels: Record<string, string> = {
    DAILY: "Diario", WEEKLY: "Semanal", BIWEEKLY: "Quincenal",
    MONTHLY: "Mensual", QUARTERLY: "Trimestral", YEARLY: "Anual",
  }

  function handleContribute(id: string, amount: number) {
    updateGoal(id, { current: (goals.find((g) => g.id === id)?.current ?? 0) + amount })
    setContributing(null)
  }

  return (
    <div className="space-y-6">
      <Tabs tabs={[{ id: "goals", label: "Metas de Ahorro", icon: <Target className="h-4 w-4" /> }, { id: "invest", label: "Inversiones", icon: <Landmark className="h-4 w-4" /> }]}>

        <TabPanel id="goals">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Metas de Ahorro</h2>
              <Button className="gap-2" onClick={() => setShowNewGoal(true)}>
                <Plus className="h-4 w-4" /> Crear
              </Button>
            </div>

            {showNewGoal && (
              <NewGoalForm onSave={(d) => { addGoal({ current: 0, ...d }); setShowNewGoal(false) }} onClose={() => setShowNewGoal(false)} />
            )}

            {editGoal && (() => {
              const g = goals.find((x) => x.id === editGoal)
              if (!g) return null
              return <NewGoalForm initial={g} onSave={(d) => { updateGoal(editGoal, d); setEditGoal(null) }} onClose={() => setEditGoal(null)} />
            })()}

            {goals.length === 0 && !showNewGoal ? (
              <Empty icon={Target} title="No hay metas de ahorro" description="Crea tu primera meta para empezar a ahorrar" action={<Button size="sm" onClick={() => setShowNewGoal(true)}><Plus className="h-3 w-3" /> Crear</Button>} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
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
                        <Button variant="ghost" size="sm" onClick={() => setDeleteGoal(goal.id)} className="gap-1 text-red-500 hover:text-red-700">
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
              <NewInvestmentForm onClose={() => setShowNewInvestment(false)} onSave={(d) => { addInvestment(d); setShowNewInvestment(false) }} />
            )}

            {editInvestment && (() => {
              const c = investments.find((x) => x.id === editInvestment)
              if (!c) return null
              return <NewInvestmentForm initial={c} onSave={(d) => { updateInvestment(editInvestment, d); setEditInvestment(null) }} onClose={() => setEditInvestment(null)} />
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
                        <Button variant="ghost" size="sm" onClick={() => setDeleteInvestment(inv.id)} className="gap-1 text-red-500 hover:text-red-700">
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
      </Tabs>

      <ConfirmDialog open={!!deleteGoal} title="Eliminar meta" message={`¿Estás seguro de eliminar "${goals.find((g) => g.id === deleteGoal)?.name}"?`} onConfirm={() => { if (deleteGoal) deleteGoalStore(deleteGoal); setDeleteGoal(null) }} onCancel={() => setDeleteGoal(null)} />
      <ConfirmDialog open={!!deleteInvestment} title="Eliminar inversión" message={`¿Estás seguro de eliminar la inversión de "${investments.find((c) => c.id === deleteInvestment)?.entity}"?`} onConfirm={() => { if (deleteInvestment) deleteInvestmentStore(deleteInvestment); setDeleteInvestment(null) }} onCancel={() => setDeleteInvestment(null)} />
    </div>
  )
}

function NewGoalForm({ initial, onSave, onClose }: {
  initial?: Goal
  onSave?: (d: { name: string; target: number; deadline: string }) => void
  onClose: () => void
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
          <Button className="w-full" disabled={!name || !target} onClick={() => onSave?.({ name, target: Number(target), deadline })}>
            {initial ? "Guardar cambios" : "Crear meta"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function NewInvestmentForm({ initial, onClose, onSave }: {
  initial?: Investment
  onClose: () => void
  onSave: (inv: Omit<Investment, "id">) => void
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
          <Button type="submit" className="w-full" disabled={!entity || !amount || !rate || !termDays || !startDate}>
            {initial ? "Guardar cambios" : "Crear inversión"}
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
