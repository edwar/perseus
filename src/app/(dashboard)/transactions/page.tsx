"use client"

import { useEffect, useState } from "react"
import { Search, Plus, X, ArrowLeft, ArrowDown, ArrowUp, ScanLine, PenLine, Repeat, Calendar, Receipt, Pencil, Trash2 } from "lucide-react"
import { Scanner } from "@/components/scanner"
import type { ReceiptData } from "@/lib/ia"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useTransactionStore, type Transaction } from "@/store/transaction-store"
import { useBudgetStore } from "@/store/budget-store"
import { useRecurringStore } from "@/store/recurring-store"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

type Tab = "all" | "recurring" | "occasional"

const freqLabels: Record<string, string> = {
  DAILY: "Diario", WEEKLY: "Semanal", BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual", QUARTERLY: "Trimestral", YEARLY: "Anual",
}

const tabLabels: Record<Tab, string> = {
  all: "Todas",
  recurring: "Recurrentes",
  occasional: "Ocasionales",
}

export default function TransactionsPage() {
  const transactions = useTransactionStore((s) => s.transactions)
  const updateTransaction = useTransactionStore((s) => s.updateTransaction)
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<Tab>("all")
  const [showNewForm, setShowNewForm] = useState(false)
  const [editTx, setEditTx] = useState<string | null>(null)
  const [deleteTx, setDeleteTx] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t) }, [])

  const filtered = transactions
    .filter((t) => tab === "all" ? true : tab === "recurring" ? t.recurring : !t.recurring)
    .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()))

  if (!ready) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Transacciones</h1><div className="h-9 w-36 animate-pulse rounded-lg bg-muted" /></div>
        <div className="grid gap-2 sm:grid-cols-[1fr_180px]"><div className="h-10 animate-pulse rounded-xl bg-muted" /><div className="h-10 animate-pulse rounded-xl bg-muted" /></div>
        <Card><div className="divide-y">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div></Card>
      </div>
    )
  }

  if (showNewForm) {
    return <NewTransactionForm onClose={() => setShowNewForm(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar transacciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <SelectTrigger className="w-full">
            <SelectValue>{(v) => tabLabels[v as Tab]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="recurring">Recurrentes</SelectItem>
            <SelectItem value="occasional">Ocasionales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <Empty icon={Receipt} title="No hay transacciones" description={search ? "Intenta con otra búsqueda" : "Registra tu primera transacción para empezar"} action={!search ? <Button size="sm" onClick={() => setShowNewForm(true)}><Plus className="h-3 w-3" /> Crear</Button> : undefined} />
        ) : (
        <div className="divide-y">
          {filtered.map((tx) => (
            <div key={tx.id}>
              {editTx === tx.id ? (
                <InlineEditForm
                  tx={tx}
                  onSave={(d) => { updateTransaction(tx.id, d); setEditTx(null) }}
                  onCancel={() => setEditTx(null)}
                />
              ) : (
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  {tx.recurring && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                      <Repeat className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      {(tx.category || (tx.type === "INCOME" ? "Ingreso" : "Gasto"))} · {tx.date}
                      {tx.recurring && tx.nextDate && (
                        <Badge variant="outline" className="flex items-center gap-0.5 border-amber-200 text-amber-600">
                          <Calendar className="h-3 w-3" />
                          Próximo: {tx.nextDate}
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                    {tx.type === "INCOME" ? "+" : "-"}$
                    {tx.amount.toLocaleString("es-CO")}
                  </span>
                  <Button variant="ghost" size="icon-xs" onClick={() => setEditTx(tx.id)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon-xs" onClick={() => setDeleteTx(tx.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              )}
            </div>
          ))}
        </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTx}
        title="Eliminar transacción"
        message={`¿Estás seguro de eliminar "${transactions.find((t) => t.id === deleteTx)?.description}"?`}
        onConfirm={() => { if (deleteTx) deleteTransaction(deleteTx); setDeleteTx(null) }}
        onCancel={() => setDeleteTx(null)}
      />
    </div>
  )
}

function InlineEditForm({ tx, onSave, onCancel }: {
  tx: Transaction
  onSave: (d: Partial<Transaction>) => void
  onCancel: () => void
}) {
  const [description, setDescription] = useState(tx.description)
  const [amount, setAmount] = useState(String(tx.amount))
  const [category, setCategory] = useState(tx.category)

  return (
    <div className="flex items-center gap-2 px-6 py-3">
      <Input value={description} onChange={(e) => setDescription(e.target.value)} className="flex-1 h-8 text-sm" />
      <CurrencyInput value={amount} onChange={(v) => setAmount(v)} className="h-8 w-28 text-sm" />
      <Button size="sm" onClick={() => onSave({ description, amount: Number(amount) || 0, category })}>Guardar</Button>
      <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
    </div>
  )
}

function NewTransactionForm({ onClose }: { onClose: () => void }) {
  const budgets = useBudgetStore((s) => s.budgets)
  const recurringItems = useRecurringStore((s) => s.items)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const [step, setStep] = useState<"type" | "frequency" | "pick" | "method" | "manual" | "scan">("type")
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [isScanned, setIsScanned] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState("MONTHLY")
  const [dayOfMonth, setDayOfMonth] = useState("")

  function handleSave() {
    addTransaction({
      description: description || "Transacción",
      amount: Number(amount) || 0,
      type,
      category,
      date: new Date().toISOString().split("T")[0],
    })
    onClose()
  }

  function handleReceiptResult(data: ReceiptData) {
    if (data.merchant) setDescription(data.merchant)
    if (data.amount) setAmount(String(data.amount))
    setIsScanned(true)
  }

  function reset() {
    setStep("type")
    setType("EXPENSE")
    setDescription("")
    setAmount("")
    setCategory("")
    setIsScanned(false)
    setIsRecurring(false)
    setFrequency("MONTHLY")
    setDayOfMonth("")
    onClose()
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        {step !== "type" && (
          <Button variant="ghost" size="icon" onClick={() => setStep("type")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className={cn("font-medium", step === "type" && "text-foreground")}>Tipo</span>
          <span>/</span>
          <span className={cn("font-medium", (step === "frequency" || step === "pick") && "text-foreground")}>Frecuencia</span>
          <span>/</span>
          <span className={cn("font-medium", (step === "method" || step === "manual" || step === "scan") && "text-foreground")}>Método</span>
          <span>/</span>
          <span className={cn("font-medium", (step === "manual" || step === "scan") && "text-foreground")}>Detalles</span>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} className="ml-auto">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {step === "type" && (
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">¿Qué tipo de transacción quieres registrar?</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="ghost"
              onClick={() => { setType("EXPENSE"); setStep("frequency") }}
              className="group flex h-auto w-auto flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-red-50 p-8 transition-all hover:border-red-300 hover:bg-red-100"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 transition-transform group-hover:scale-110">
                <ArrowUp className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-700">Gasto</p>
                <p className="text-xs text-red-500">Salida de dinero</p>
              </div>
            </Button>
            <Button
              variant="ghost"
              onClick={() => { setType("INCOME"); setStep("frequency") }}
              className="group flex h-auto w-auto flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-emerald-50 p-8 transition-all hover:border-emerald-300 hover:bg-emerald-100"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110">
                <ArrowDown className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-700">Ingreso</p>
                <p className="text-xs text-emerald-500">Entrada de dinero</p>
              </div>
            </Button>
          </div>
        </CardContent>
      )}

      {step === "frequency" && (
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">¿Este {type === "EXPENSE" ? "gasto" : "ingreso"} es ocasional o recurrente?</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="ghost"
              onClick={() => { setIsRecurring(false); setStep("method") }}
              className="group flex h-auto w-auto flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-card p-8 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform group-hover:scale-110">
                <PenLine className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">Ocasional</p>
                <p className="text-xs text-muted-foreground">Solo una vez</p>
              </div>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setStep("pick")}
              className="group flex h-auto w-auto flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-card p-8 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-transform group-hover:scale-110">
                <Repeat className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">Recurrente</p>
                <p className="text-xs text-muted-foreground">Se repite cada mes</p>
              </div>
            </Button>
          </div>
        </CardContent>
      )}

      {step === "pick" && (
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {type === "EXPENSE" ? "¿Qué gasto recurrente estás pagando?" : "¿Qué ingreso recurrente recibiste?"}
          </p>
          <div className="space-y-2">
            {recurringItems.filter((item) => item.type === type).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => {
                  setDescription(item.name)
                  setAmount(String(item.amount))
                  setCategory(item.category)
                  setFrequency(item.frequency)
                  setDayOfMonth(String(item.dayOfMonth))
                  setIsRecurring(true)
                  setStep("method")
                }}
                className="flex w-full items-center justify-between rounded-lg border border-input bg-card px-4 py-3 text-left transition-colors hover:bg-accent"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <span className={cn("text-sm font-semibold", type === "INCOME" ? "text-emerald-600" : "text-red-600")}>
                  {type === "INCOME" ? "+" : "-"}${item.amount.toLocaleString("es-CO")}
                </span>
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={() => { setIsRecurring(true); setStep("method") }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
            >
              <Plus className="h-4 w-4" /> Otro recurrente no listado
            </Button>
          </div>
        </CardContent>
      )}

      {step === "method" && (
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">¿Cómo quieres registrar este {type === "EXPENSE" ? "gasto" : "ingreso"}?</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="ghost"
              onClick={() => setStep("manual")}
              className="group flex h-auto w-auto flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-card p-8 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform group-hover:scale-110">
                <PenLine className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">Manual</p>
                <p className="text-xs text-muted-foreground">Escribir los datos a mano</p>
              </div>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setStep("scan")}
              className="group flex h-auto w-auto flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-card p-8 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 transition-transform group-hover:scale-110">
                <ScanLine className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">Escanear</p>
                <p className="text-xs text-muted-foreground">Subir screenshot del pago</p>
              </div>
            </Button>
          </div>
        </CardContent>
      )}

      {step === "manual" && (
        <CardContent>
          <div className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", type === "EXPENSE" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600")}>
                {type === "EXPENSE" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </div>
              <p className="text-sm font-medium">{type === "EXPENSE" ? "Gasto" : "Ingreso"}</p>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setStep("scan")}
                className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ScanLine className="h-3 w-3" />
                Escanear
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={type === "EXPENSE" ? "¿En qué gastaste?" : "¿De dónde viene el dinero?"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <CurrencyInput id="amount" value={amount} onChange={setAmount} placeholder="0" />
            </div>

            {type === "EXPENSE" && !isRecurring && (
              <div className="space-y-2">
                <Label>Presupuesto que afecta</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar presupuesto" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.length === 0 ? (
                      <div className="px-3 py-6 text-center text-xs text-muted-foreground space-y-2"><p>No hay presupuestos</p><Button size="sm" onClick={() => window.location.href = "/budgets"}>Ir a Presupuestos</Button></div>
                    ) : budgets.map((b) => (
                      <SelectItem key={b.id} value={b.category}>{b.category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isRecurring && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Frecuencia</Label>
                  <Select value={frequency} onValueChange={(v) => v && setFrequency(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue>{(v) => freqLabels[v]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Diario</SelectItem>
                      <SelectItem value="WEEKLY">Semanal</SelectItem>
                      <SelectItem value="BIWEEKLY">Quincenal</SelectItem>
                      <SelectItem value="MONTHLY">Mensual</SelectItem>
                      <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                      <SelectItem value="YEARLY">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Día del mes</Label>
                  <Input type="number" min={1} max={31} value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} placeholder="15" />
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleSave}>
              Guardar {type === "EXPENSE" ? "gasto" : "ingreso"}{isRecurring && " recurrente"}
            </Button>
          </div>
        </CardContent>
      )}

      {step === "scan" && (
        <CardContent>
          <div className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <ScanLine className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Escanear screenshot</p>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setStep("manual")}
                className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <PenLine className="h-3 w-3" />
                Manual
              </Button>
            </div>

            {isScanned ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description-scan">Descripción</Label>
                  <Input
                    id="description-scan"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount-scan">Monto</Label>
                  <CurrencyInput id="amount-scan" value={amount} onChange={setAmount} />
                </div>

                {type === "EXPENSE" && !isRecurring && (
                  <div className="space-y-2">
                    <Label>Presupuesto que afecta</Label>
                    <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar presupuesto" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgets.length === 0 ? (
                      <div className="px-3 py-6 text-center text-xs text-muted-foreground space-y-2"><p>No hay presupuestos</p><Button size="sm" onClick={() => window.location.href = "/budgets"}>Ir a Presupuestos</Button></div>
                        ) : budgets.map((b) => (
                          <SelectItem key={b.id} value={b.category}>{b.category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {isRecurring && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Frecuencia</Label>
                      <Select value={frequency} onValueChange={(v) => v && setFrequency(v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue>{(v) => freqLabels[v]}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">Diario</SelectItem>
                          <SelectItem value="WEEKLY">Semanal</SelectItem>
                          <SelectItem value="BIWEEKLY">Quincenal</SelectItem>
                          <SelectItem value="MONTHLY">Mensual</SelectItem>
                          <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                          <SelectItem value="YEARLY">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Día del mes</Label>
                      <Input type="number" min={1} max={31} value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} placeholder="15" />
                    </div>
                  </div>
                )}

                <Button className="w-full" onClick={handleSave}>
                  Confirmar y guardar
                </Button>
              </div>
            ) : (
              <Scanner mode="receipt" onResult={handleReceiptResult} />
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}


