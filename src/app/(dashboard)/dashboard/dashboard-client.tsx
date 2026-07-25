"use client"

import { useEffect, useState } from "react"
import { cn, formatCurrency } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, Pencil, Trash2, Wallet, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { useTransactionStore } from "@/store/transaction-store"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { GamificationStats } from "@/components/features/dashboard/gamification-stats"
import { SpendingPie, IncomeBar, DailyExpensesChart, TopExpensesChart } from "./charts"

interface DashboardClientProps {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  allTransactions: Array<{
    id: string
    amount: number
    description: string
    type: string
    date: string
    category: string | null
    categoryColor: string | null
  }>
  recentTransactions: Array<{
    id: string
    amount: number
    description: string
    type: string
    date: string
    category: string | null
    categoryColor: string | null
  }>
  spendingByCategory: Array<{ name: string; value: number }>
  monthlyChart: Array<{ month: string; income: number; expenses: number }>
}

export function DashboardClient({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  allTransactions,
  recentTransactions,
  spendingByCategory,
  monthlyChart,
}: DashboardClientProps) {
  const updateTransaction = useTransactionStore((s) => s.updateTransaction)
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const [editTx, setEditTx] = useState<string | null>(null)
  const [deleteTx, setDeleteTx] = useState<string | null>(null)
  const [txPage, setTxPage] = useState(1)
  const PAGE_SIZE = 5
  const totalPages = Math.max(1, Math.ceil(recentTransactions.length / PAGE_SIZE))
  const safePage = txPage > totalPages ? 1 : txPage
  const paginatedTxs = recentTransactions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t) }, [])
  if (!ready) {
    return (
      <div className="space-y-6 min-h-screen">
        <h1 className="text-2xl font-bold mt-10 md:hidden">Dashboard</h1>

        {/* Hero Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 p-6 overflow-hidden">
              <div className="h-11 w-11 shrink-0 animate-shimmer rounded-2xl bg-muted-foreground/15 mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/15" />
                <div className="h-8 w-32 animate-shimmer rounded bg-muted-foreground/15" />
              </div>
            </div>
          ))}
        </div>

        {/* Gamification Stats Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 animate-shimmer rounded-2xl bg-muted-foreground/15" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-16 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-6 w-12 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-2.5 w-20 animate-shimmer rounded bg-muted-foreground/10" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
              <div className="border-b px-6 py-4">
                <div className="h-4 w-36 animate-shimmer rounded bg-muted-foreground/15" />
              </div>
              <div className="p-5">
                <div className="h-52 animate-shimmer rounded-lg bg-muted-foreground/10" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
              <div className="border-b px-6 py-4">
                <div className="h-4 w-36 animate-shimmer rounded bg-muted-foreground/15" />
              </div>
              <div className="p-5">
                <div className="h-52 animate-shimmer rounded-lg bg-muted-foreground/10" />
              </div>
            </div>
          ))}
        </div>

        {/* Transactions Skeleton */}
        <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <div className="border-b px-6 py-4 bg-gradient-to-r from-muted/50 to-transparent">
            <div className="h-4 w-40 animate-shimmer rounded bg-muted-foreground/15" />
          </div>
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-border/50 last:border-b-0">
                <div className="flex items-center gap-3.5 pl-2">
                  <div className="h-10 w-10 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-shimmer rounded bg-muted-foreground/20" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-16 animate-shimmer rounded-md bg-muted-foreground/15" />
                      <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/15" />
                    </div>
                  </div>
                </div>
                <div className="h-4 w-24 animate-shimmer rounded bg-muted-foreground/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold mt-10 md:hidden">Dashboard</h1>

      {/* Hero Cards — Balance */}
      <div className="relative">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-float-orb pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-success/5 blur-3xl animate-float-orb pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="grid gap-4 sm:grid-cols-3 relative">
          <div className="group hero-card relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 via-blue-600 to-blue-800 p-6 text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/35 animate-stagger-in" style={{ animationDelay: "0ms" }}>
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 animate-pulse-glow" />
            <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm mb-4 ring-1 ring-white/20">
                <Wallet className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-blue-100/80">Balance total</p>
              <p className="stat-number mt-1 drop-shadow-lg">{formatCurrency(totalBalance)}</p>
            </div>
          </div>

          <div className="group hero-card relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-400 via-emerald-500 to-emerald-700 p-6 text-white shadow-xl shadow-success/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-success/35 animate-stagger-in" style={{ animationDelay: "60ms" }}>
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 animate-pulse-glow" style={{ animationDelay: "1s" }} />
            <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm mb-4 ring-1 ring-white/20">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-emerald-100/80">Ingresos del mes</p>
              <p className="stat-number mt-1 drop-shadow-lg">{formatCurrency(monthlyIncome)}</p>
            </div>
          </div>

          <div className="group hero-card relative overflow-hidden rounded-2xl bg-linear-to-br from-coral-300 via-coral-400 to-coral-600 p-6 text-white shadow-xl shadow-danger/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-danger/35 animate-stagger-in" style={{ animationDelay: "120ms" }}>
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 animate-pulse-glow" style={{ animationDelay: "2s" }} />
            <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm mb-4 ring-1 ring-white/20">
                <ArrowDownRight className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-coral-100/80">Gastos del mes</p>
              <p className="stat-number mt-1 drop-shadow-lg">{formatCurrency(monthlyExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      <GamificationStats />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="animate-stagger-in" style={{ animationDelay: "480ms" }}><SpendingPie data={spendingByCategory} /></div>
        <div className="animate-stagger-in" style={{ animationDelay: "540ms" }}><IncomeBar data={monthlyChart} /></div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="animate-stagger-in" style={{ animationDelay: "600ms" }}><DailyExpensesChart transactions={allTransactions} /></div>
        <div className="animate-stagger-in" style={{ animationDelay: "660ms" }}><TopExpensesChart transactions={allTransactions} /></div>
      </div>

      <Card className="overflow-hidden rounded-2xl border-0 shadow-lg animate-stagger-in" style={{ animationDelay: "720ms" }}>
        <div className="border-b px-6 py-4 bg-gradient-to-r from-muted/50 to-transparent">
          <p className="font-semibold text-sm">Transacciones recientes</p>
        </div>
        <div className="divide-y">
          {paginatedTxs.map((tx) => (
            <div key={tx.id}>
              {editTx === tx.id ? (
                <DashboardInlineEdit tx={tx} onSave={(d) => { updateTransaction(tx.id, d); setEditTx(null) }} onCancel={() => setEditTx(null)} />
              ) : (
                <div className="flex items-center justify-between px-6 py-3.5 transition-all duration-200 hover:bg-muted/40 hover:pl-7">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-110", tx.type === "INCOME" ? "bg-emerald-100" : "bg-coral-100")}>
                      {tx.type === "INCOME" ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : <ArrowDownRight className="h-4 w-4 text-danger" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className={cn("text-xs", tx.category ? "text-muted-foreground" : tx.type === "INCOME" ? "text-emerald-600 font-medium" : "text-danger font-medium")}>{tx.category ?? (tx.type === "INCOME" ? "Ingreso" : "Gasto")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${tx.type === "INCOME" ? "text-emerald-600" : "text-danger"}`}>
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                    <Button variant="ghost" size="icon-xs" onClick={() => setEditTx(tx.id)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" onClick={() => setDeleteTx(tx.id)} className="text-danger hover:text-danger-hover">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl animate-pulse-glow" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 ring-1 ring-blue-100/50">
                  <ArrowLeftRight className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-1.5 text-base font-bold text-foreground">Tu journey financiero empieza aquí</h3>
              <p className="mb-5 max-w-xs text-sm text-muted-foreground leading-relaxed">Registra tu primera transacción y empieza a construir hábitos financieros saludables</p>
              <Button size="sm" className="gap-1.5 rounded-xl shadow-md shadow-primary/20" onClick={() => window.location.href = "/transactions"}>
                <ArrowUpRight className="h-3.5 w-3.5" /> Ir a Transacciones
              </Button>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 border-t px-6 py-3">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={safePage <= 1} onClick={() => setTxPage(safePage - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === safePage ? "default" : "ghost"} size="sm" className="h-7 w-7 p-0 text-xs" onClick={() => setTxPage(p)}>
                {p}
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={safePage >= totalPages} onClick={() => setTxPage(safePage + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </Card>

      <ConfirmDialog open={!!deleteTx} title="Eliminar transacción" message={`¿Estás seguro?`} onConfirm={() => { if (deleteTx) deleteTransaction(deleteTx); setDeleteTx(null) }} onCancel={() => setDeleteTx(null)} />
    </div>
  )
}

function DashboardInlineEdit({ tx, onSave, onCancel }: { tx: { id: string; description: string; amount: number }; onSave: (d: { description: string; amount: number }) => void; onCancel: () => void }) {
  const [description, setDescription] = useState(tx.description)
  const [amount, setAmount] = useState(String(tx.amount))
  return (
    <div className="flex items-center gap-2 px-6 py-3">
      <Input value={description} onChange={(e) => setDescription(e.target.value)} className="flex-1 h-8 text-sm" />
      <CurrencyInput value={amount} onChange={(v) => setAmount(v)} className="h-8 w-28 text-sm" />
      <Button size="sm" onClick={() => onSave({ description, amount: Number(amount) || 0 })}>Guardar</Button>
      <Button variant="ghost" size="sm" onClick={onCancel}>X</Button>
    </div>
  )
}
