import { create } from "zustand"
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
  hydrate: () => Promise<void>
  addTransaction: (tx: Omit<Transaction, "id">) => Promise<void>
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  reset: () => void
}

export const useTransactionStore = create<TransactionStore>()((set, get) => ({
  transactions: [],
  hydrate: async () => {
    const res = await fetch("/api/data")
    const json = await res.json()
    const data = json.data ?? json
    const transactions: Transaction[] = data.transactions ?? data
    set({ transactions })
  },
  addTransaction: async (tx) => {
    const newTx: Transaction = { id: crypto.randomUUID(), ...tx }
    set((state) => ({
      transactions: [...state.transactions, newTx],
    }))
    useBalanceStore.getState().addToBalance(txImpact(newTx))
    await fetch("/api/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "transactions", data: get().transactions }),
    })
  },
  updateTransaction: async (id, tx) => {
    const prev = get().transactions.find((x) => x.id === id)
    set((state) => ({
      transactions: state.transactions.map((x) =>
        x.id === id ? { ...x, ...tx } : x
      ),
    }))
    if (prev) {
      const bal = useBalanceStore.getState()
      bal.addToBalance(-txImpact(prev))
      bal.addToBalance(txImpact({ ...prev, ...tx }))
    }
    await fetch("/api/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "transactions", data: get().transactions }),
    })
  },
  deleteTransaction: async (id) => {
    const tx = get().transactions.find((x) => x.id === id)
    set((state) => ({
      transactions: state.transactions.filter((x) => x.id !== id),
    }))
    if (tx) useBalanceStore.getState().addToBalance(-txImpact(tx))
    await fetch("/api/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "transactions", data: get().transactions }),
    })
  },
  reset: () => set({ transactions: [] }),
}))
