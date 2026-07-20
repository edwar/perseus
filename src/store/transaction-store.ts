import { create } from "zustand"
import { persist } from "zustand/middleware"

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

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (tx: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, tx: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [...state.transactions, { id: String(Date.now()), ...tx }],
        })),
      updateTransaction: (id, tx) =>
        set((state) => ({
          transactions: state.transactions.map((x) => x.id === id ? { ...x, ...tx } : x),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((x) => x.id !== id),
        })),
    }),
    { name: "perseus-transactions" }
  )
)
