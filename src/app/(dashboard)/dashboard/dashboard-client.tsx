"use client"

import { useState } from "react"
import { cn, formatCurrency } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, Pencil, Trash2, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { useTransactionStore } from "@/store/transaction-store"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface DashboardClientProps {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  recentTransactions: Array<{
    id: string
    amount: number
    description: string
    type: string
    date: string
    category: string | null
    categoryColor: string | null
  }>
}

export function DashboardClient({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  recentTransactions,
}: DashboardClientProps) {
  const updateTransaction = useTransactionStore((s) => s.updateTransaction)
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const [editTx, setEditTx] = useState<string | null>(null)
  const [deleteTx, setDeleteTx] = useState<string | null>(null)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Balance total</p>
              <p className={cn("text-xl font-bold", totalBalance >= 0 ? "text-emerald-600" : "text-red-600")}>{formatCurrency(totalBalance)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <ArrowUpRight className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ingresos del mes</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(monthlyIncome)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gastos del mes</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(monthlyExpenses)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="border-b px-6 py-4">
          <p className="font-semibold">Transacciones recientes</p>
        </div>
        <div className="divide-y">
          {recentTransactions.map((tx) => (
            <div key={tx.id}>
              {editTx === tx.id ? (
                <DashboardInlineEdit tx={tx} onSave={(d) => { updateTransaction(tx.id, d); setEditTx(null) }} onCancel={() => setEditTx(null)} />
              ) : (
              <div className="flex items-center justify-between px-6 py-3">
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
            <Empty icon={ArrowLeftRight} title="No hay transacciones" description="Registra tu primera transacción para ver tu actividad aquí" action={<Button size="sm" onClick={() => window.location.href = "/transactions"}>Ir a Transacciones</Button>} />
          )}
        </div>
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
