import { useState, Suspense, lazy } from "react"
import { ArrowLeft, ArrowUp, ArrowDown, ScanLine, PenLine, Repeat, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FREQ_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useTransactionMutations, useBudgets, useRecurring, useDebts, useDebtMutations } from "@/hooks/useData"
import type { ReceiptData } from "@/lib/ia"

const Scanner = lazy(() => import("@/components/scanner").then((m) => ({ default: m.Scanner })) as Promise<{ default: React.ComponentType<{ mode: "receipt"; onResult: (data: ReceiptData) => void }> }>)

interface NewTransactionFormProps {
  onClose: () => void
}

type Step = "type" | "frequency" | "pick" | "method" | "manual" | "scan"

export function NewTransactionForm({ onClose }: NewTransactionFormProps) {
  const { data: budgets } = useBudgets()
  const { data: recurringItems } = useRecurring()
  const { data: debts } = useDebts()
  const { add } = useTransactionMutations()
  const { update: updateDebt } = useDebtMutations()
  const [step, setStep] = useState<Step>("type")
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [isScanned, setIsScanned] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState("MONTHLY")
  const [dayOfMonth, setDayOfMonth] = useState("")
  const [debtId, setDebtId] = useState("")

  async function handleSave() {
    const txAmount = Number(amount) || 0
    await add.mutateAsync({
      description: description || "Transacción",
      amount: txAmount,
      type,
      category,
      date: new Date().toISOString().split("T")[0],
    })
    if (debtId) {
      const debt = (debts ?? []).find((d) => d.id === debtId)
      if (debt) {
        await updateDebt.mutateAsync({ ...debt, remaining: debt.remaining - txAmount, paid: debt.paid + 1 })
      }
    }
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
    <Card className="overflow-hidden mt-10 md:mt-0">
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
            {(recurringItems ?? []).filter((item) => item.type === type).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => {
                  setDescription(item.name)
                  setAmount(String(item.amount))
                  setCategory(item.category)
                  setFrequency(item.frequency)
                  setDayOfMonth(String(item.dayOfMonth))
                  setDebtId(item.debtId ?? "")
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
                    {(budgets ?? []).length === 0 ? (
                      <div className="px-3 py-6 text-center text-xs text-muted-foreground space-y-2"><p>No hay presupuestos</p><Button size="sm" onClick={() => window.location.href = "/budgets"}>Ir a Presupuestos</Button></div>
                    ) : (budgets ?? []).map((b) => (
                      <SelectItem key={b.id} value={b.category}>{b.category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isRecurring && (
              <p className="text-xs text-muted-foreground">Transacción recurrente — se registra como pago de este {type === "EXPENSE" ? "gasto" : "ingreso"} periódico.</p>
            )}
            <div className="flex md:justify-end">
              <Button className="w-full md:w-auto md:end" onClick={handleSave} disabled={add.isPending}>
                {add.isPending ? "Guardando..." : `Guardar ${type === "EXPENSE" ? "gasto" : "ingreso"}${isRecurring ? " recurrente" : ""}`}
              </Button>
            </div>
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
                        {(budgets ?? []).length === 0 ? (
                          <div className="px-3 py-6 text-center text-xs text-muted-foreground space-y-2"><p>No hay presupuestos</p><Button size="sm" onClick={() => window.location.href = "/budgets"}>Ir a Presupuestos</Button></div>
                        ) : (budgets ?? []).map((b) => (
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
                          <SelectValue>{(v) => FREQ_LABELS[v]}</SelectValue>
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

                <Button className="w-full" onClick={handleSave} disabled={add.isPending}>
                  {add.isPending ? "Guardando..." : "Confirmar y guardar"}
                </Button>
              </div>
            ) : (
              <Suspense fallback={<div className="h-48 animate-shimmer rounded-lg bg-muted" />}>
                <Scanner mode="receipt" onResult={handleReceiptResult} />
              </Suspense>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
