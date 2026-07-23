"use client"

import { useEffect, useState } from "react"
import { Plus, Receipt } from "lucide-react"
import { useHeaderStore } from "@/store/header-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useTransactions, useTransactionMutations } from "@/hooks/useData"
import { usePagination } from "@/hooks/use-pagination"
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
  const [showNewForm, setShowNewForm] = useState(false)
  const [editTx, setEditTx] = useState<string | null>(null)
  const [deleteTx, setDeleteTx] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const setHeaderAction = useHeaderStore((s) => s.setAction)

  useEffect(() => {
    setHeaderAction(<Button size="sm" onClick={() => setShowNewForm(true)}><Plus className="h-4 w-4" /> Crear</Button>)
    return () => setHeaderAction(null)
  }, [])

  const filterFn = (t: typeof transactions[0]) => {
    const matchesTab = tab === "all" ? true : tab === "recurring" ? !!t.recurring : !t.recurring
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  }

  const { filtered, paginated, safePage, totalPages } = usePagination({
    items: transactions,
    page,
    filterFn,
  })

  if (isLoading) return <TransactionsLoadingSkeleton />

  if (showNewForm) {
    return <NewTransactionForm onClose={() => setShowNewForm(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="items-center justify-between mt-10 flex md:hidden">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </div>

      <TransactionFilters search={search} tab={tab} onSearchChange={setSearch} onTabChange={setTab} />

      <Card>
        {filtered.length === 0 ? (
          <Empty
            icon={Receipt}
            title="No hay transacciones"
            description={search ? "Intenta con otra búsqueda" : "Registra tu primera transacción para empezar"}
            action={!search ? <Button size="sm" onClick={() => setShowNewForm(true)}><Plus className="h-3 w-3" /> Crear</Button> : undefined}
          />
        ) : (
          <div>
            {paginated.map((tx) => (
              <div key={tx.id}>
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
      </Card>

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
