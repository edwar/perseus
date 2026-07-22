import { create } from "zustand"
import { useBalanceStore } from "./balance-store"
import { fetchAll, createItem, updateItem, deleteItem } from "./api"

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
  hydrate: () => Promise<void>
  addTransaction: (tx: Omit<Transaction, "id">) => Promise<void>
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  reset: () => void
}

export const useTransactionStore = create<TransactionStore>()((set, get) => ({
  transactions: [],
  hydrate: async () => {
    const items = await fetchAll<Transaction>("/api/transactions")
    set({ transactions: items })
  },
  addTransaction: async (tx) => {
    const newTx: Transaction = { id: crypto.randomUUID(), ...tx }
    set((state) => ({ transactions: [...state.transactions, newTx] }))
    useBalanceStore.getState().addToBalance(txImpact(newTx))
    await createItem("/api/transactions", {
      id: newTx.id,
      description: newTx.description,
      amount: newTx.amount,
      type: newTx.type,
      category: newTx.category,
      date: newTx.date,
      recurring: newTx.recurring,
      frequency: newTx.frequency,
      next_date: newTx.nextDate,
    })
  },
  updateTransaction: async (id, tx) => {
    const prev = get().transactions.find((x) => x.id === id)
    set((state) => ({
      transactions: state.transactions.map((x) => (x.id === id ? { ...x, ...tx } : x)),
    }))
    if (prev) {
      const bal = useBalanceStore.getState()
      bal.addToBalance(-txImpact(prev))
      bal.addToBalance(txImpact({ ...prev, ...tx }))
    }
    await updateItem("/api/transactions", { id, ...tx, next_date: tx.nextDate })
  },
  deleteTransaction: async (id) => {
    const tx = get().transactions.find((x) => x.id === id)
    set((state) => ({ transactions: state.transactions.filter((x) => x.id !== id) }))
    if (tx) useBalanceStore.getState().addToBalance(-txImpact(tx))
    await deleteItem("/api/transactions", id)
  },
  reset: () => set({ transactions: [] }),
}))