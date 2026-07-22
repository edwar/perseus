import { create } from "zustand"
import { useBalanceStore } from "./balance-store"
import { persistData, fetchHydrate } from "./api"

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
    set({ transactions: await fetchHydrate<Transaction[]>("transactions", []) })
  },
  addTransaction: async (tx) => {
    const newTx: Transaction = { id: crypto.randomUUID(), ...tx }
    set((state) => ({ transactions: [...state.transactions, newTx] }))
    useBalanceStore.getState().addToBalance(txImpact(newTx))
    await persistData("transactions", get().transactions)
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
    await persistData("transactions", get().transactions)
  },
  deleteTransaction: async (id) => {
    const tx = get().transactions.find((x) => x.id === id)
    set((state) => ({ transactions: state.transactions.filter((x) => x.id !== id) }))
    if (tx) useBalanceStore.getState().addToBalance(-txImpact(tx))
    await persistData("transactions", get().transactions)
  },
  reset: () => set({ transactions: [] }),
}))