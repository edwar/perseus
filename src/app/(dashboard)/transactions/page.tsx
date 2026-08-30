"use client"

import { useEffect, useState, useMemo } from "react"
import { Plus, Receipt, TrendingUp, TrendingDown, ArrowDown, Hash } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useTransactions, useTransactionMutations } from "@/hooks/useData"
import { usePagination } from "@/hooks/use-pagination"
import { formatCurrency } from "@/lib/formats"
import { TransactionsLoadingSkeleton } from "@/components/features/transactions/transactions-loading-skeleton"
import { TransactionFilters, type Tab } from "@/components/features/transactions/transaction-filters"
import { TransactionItem } from "@/components/features/transactions/transaction-item"
import { InlineEditForm } from "@/components/features/transactions/inline-edit-form"
import { NewTransactionForm } from "@/components/features/transactions/new-transaction-form"
import { Pagination } from "@/components/ui/pagination"

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions()
  const { update, remove } = useTransactionMutations()
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<Tab>("all")
  const [page, setPage] = useState(1)
  const [showNewForm, setShowNewForm] = useState(false)
  const [editTx, setEditTx] = useState<string | null>(null)
  const [deleteTx, setDeleteTx] = useState<string | null>(null)
  const setHeaderAction = useHeaderStore((s) => s.setAction)

  useEffect(() => {
    setHeaderAction(
      <div className="hidden md:block">
        <Button size="sm" onClick={() => setShowNewForm(true)}>
          <Plus className="h-4 w-4" /> Crear
        </Button>
      </div>
    )
    return () => setHeaderAction(null)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, tab])

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0)
    return { income, expense, net: income - expense, count: transactions.length }
  }, [transactions])

  const filterFn = (t: typeof transactions[0]) => {
    const matchesTab = tab === "all" ? true : tab === "recurring" ? !!t.recurring : !t.recurring
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  }

  const { filtered, paginated, safePage, totalPages } = usePagination({
    items: transactions,
    page,
    pageSize: 10,
    filterFn,
  })

  if (isLoading) return <TransactionsLoadingSkeleton />

  if (showNewForm) {
    return <div className="w-full max-w-full overflow-hidden"><NewTransactionForm onClose={() => setShowNewForm(false)} /></div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-hidden pb-20">
      <div className="flex md:hidden mt-6 sm:mt-10">
        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      {/* Summary Cards */}
      {transactions.length > 0 && (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 animate-stagger-in">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-success/20 p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
            <div className="absolute -right-4 -top-4 h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" />
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-success">Ingresos</p>
                <p className="text-sm sm:text-lg font-extrabold text-emerald-700 tracking-tight">{formatCurrency(stats.income)}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-danger/20 p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:shadow-danger/10">
            <div className="absolute -right-4 -top-4 h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-danger/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-linear-to-br from-danger to-coral-600 text-white shadow-md shadow-danger/25">
                <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-danger">Gastos</p>
                <p className="text-sm sm:text-lg font-extrabold text-coral-700 tracking-tight">{formatCurrency(stats.expense)}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border p-3 sm:p-4 transition-all duration-300 hover:shadow-lg">
            <div className="absolute -right-4 -top-4 h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-primary/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-blue-700 text-white shadow-md shadow-primary/25">
                <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-primary">Neto</p>
                <p className={`text-sm sm:text-lg font-extrabold tracking-tight ${stats.net >= 0 ? "text-emerald-700" : "text-coral-700"}`}>
                  {stats.net >= 0 ? "+" : ""}{formatCurrency(stats.net)}
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border p-3 sm:p-4 transition-all duration-300 hover:shadow-lg">
            <div className="absolute -right-4 -top-4 h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-xp/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "3s" }} />
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-linear-to-br from-xp to-purple-700 text-white shadow-md shadow-xp/25">
                <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-xp">Total</p>
                <p className="text-sm sm:text-lg font-extrabold text-purple-700 tracking-tight">{stats.count}</p>
                <p className="text-[9px] sm:text-[10px] text-purple-400 font-medium">transacciones</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <TransactionFilters search={search} tab={tab} onSearchChange={setSearch} onTabChange={setTab} />

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <Empty
            icon={Receipt}
            title="No hay transacciones"
            description={search ? "Intenta con otra búsqueda" : "Registra tu primera transacción para empezar"}
            action={!search ? <Button size="sm" onClick={() => setShowNewForm(true)}><Plus className="h-3 w-3" /> Crear</Button> : undefined}
          />
        ) : (
          <div>
            {paginated.map((tx, i) => (
              <div key={tx.id} className="animate-stagger-in" style={{ animationDelay: `${i * 30}ms` }}>
                {editTx === tx.id ? (
                  <InlineEditForm
                    tx={tx}
                    onSave={(d) => { update.mutate({ ...tx, ...d }); setEditTx(null) }}
                    onCancel={() => setEditTx(null)}
                  />
                ) : (
                  <TransactionItem tx={tx} onEdit={setEditTx} onDelete={setDeleteTx} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        open={!!deleteTx}
        title="Eliminar transacción"
        message={`¿Estás seguro de eliminar "${transactions.find((t) => t.id === deleteTx)?.description}"?`}
        onConfirm={() => { if (deleteTx) remove.mutate(deleteTx); setDeleteTx(null) }}
        onCancel={() => setDeleteTx(null)}
      />
    </div>
  )
}
