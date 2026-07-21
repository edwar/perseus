import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useBalanceStore } from "./balance-store"

export interface Transaction {
  id: string
  description: string
  amount: number
  type: "EXPENSE" | "INCOME"
  category: string
  date: string
  recurring?: boolean
  frequency?: string
  nextDate?: string
}

function txImpact(tx: { type: string; amount: number }): number {
  return tx.type === "INCOME" ? tx.amount : -tx.amount
}

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (tx: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, tx: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (tx) => {
        const newTx = { id: String(Date.now()), ...tx }
        set((state) => ({
          transactions: [...state.transactions, newTx],
        }))
        useBalanceStore.getState().addToBalance(txImpact(newTx))
      },
      updateTransaction: (id, tx) => {
        const prev = get().transactions.find((x) => x.id === id)
        set((state) => ({
          transactions: state.transactions.map((x) => x.id === id ? { ...x, ...tx } : x),
        }))
        if (prev) {
          const bal = useBalanceStore.getState()
          bal.addToBalance(-txImpact(prev))
          bal.addToBalance(txImpact({ ...prev, ...tx }))
        }
      },
      deleteTransaction: (id) => {
        const tx = get().transactions.find((x) => x.id === id)
        set((state) => ({
          transactions: state.transactions.filter((x) => x.id !== id),
        }))
        if (tx) useBalanceStore.getState().addToBalance(-txImpact(tx))
      },
    }),
    { name: "perseus-transactions" }
  )
)
