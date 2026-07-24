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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mt-10 md:hidden">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl bg-muted p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-shimmer rounded-xl bg-muted-foreground/20" />
                <div className="space-y-2">
                  <div className="h-3 w-20 animate-shimmer rounded bg-muted-foreground/20" />
                  <div className="h-6 w-28 animate-shimmer rounded bg-muted-foreground/20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-shimmer rounded-xl bg-muted" />
                  <div className="space-y-2">
                    <div className="h-3 w-16 animate-shimmer rounded bg-muted" />
                    <div className="h-6 w-12 animate-shimmer rounded bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <div className="border-b px-6 py-4">
            <div className="h-4 w-36 animate-shimmer rounded bg-muted" />
          </div>
          <div className="p-5">
            <div className="h-40 animate-shimmer rounded-lg bg-muted" />
          </div>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          <Card><div className="border-b px-6 py-4"><div className="h-4 w-36 animate-shimmer rounded bg-muted" /></div><div className="p-5"><div className="h-52 animate-shimmer rounded-lg bg-muted" /></div></Card>
          <Card><div className="border-b px-6 py-4"><div className="h-4 w-36 animate-shimmer rounded bg-muted" /></div><div className="p-5"><div className="h-52 animate-shimmer rounded-lg bg-muted" /></div></Card>
        </div>

        <Card>
          <div className="border-b px-6 py-4">
            <div className="h-4 w-40 animate-shimmer rounded bg-muted" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3">
                <div className="h-9 w-9 animate-shimmer rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-40 animate-shimmer rounded bg-muted" />
                  <div className="h-2.5 w-24 animate-shimmer rounded bg-muted" />
                </div>
                <div className="h-4 w-20 animate-shimmer rounded bg-muted" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mt-10 md:hidden">Dashboard</h1>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 p-5 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/5" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-100">Balance total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 p-5 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/5" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-100">Ingresos del mes</p>
              <p className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-rose-500 to-rose-700 p-5 text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/30">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/5" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <ArrowDownRight className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-rose-100">Gastos del mes</p>
              <p className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      <GamificationStats />

      <div className="grid gap-5 sm:grid-cols-2">
        <SpendingPie data={spendingByCategory} />
        <IncomeBar data={monthlyChart} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <DailyExpensesChart transactions={allTransactions} />
        <TopExpensesChart transactions={allTransactions} />
      </div>

      <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
        <div className="border-b px-6 py-4">
          <p className="font-semibold">Transacciones recientes</p>
        </div>
        <div className="divide-y">
          {paginatedTxs.map((tx) => (
            <div key={tx.id}>
              {editTx === tx.id ? (
                <DashboardInlineEdit tx={tx} onSave={(d) => { updateTransaction(tx.id, d); setEditTx(null) }} onCancel={() => setEditTx(null)} />
              ) : (
                <div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", tx.type === "INCOME" ? "bg-emerald-100" : "bg-red-100")}>
                      {tx.type === "INCOME" ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : <ArrowDownRight className="h-4 w-4 text-red-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className={cn("text-xs", tx.category ? "text-muted-foreground" : tx.type === "INCOME" ? "text-emerald-600 font-medium" : "text-red-600 font-medium")}>{tx.category ?? (tx.type === "INCOME" ? "Ingreso" : "Gasto")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
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
          {recentTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-blue-100/50">
                <ArrowLeftRight className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-foreground">No hay transacciones</h3>
              <p className="mb-4 max-w-xs text-sm text-muted-foreground">Registra tu primera transacción para ver tu actividad aquí</p>
              <Button size="sm" className="gap-1.5" onClick={() => window.location.href = "/transactions"}>
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
