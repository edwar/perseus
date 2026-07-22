import { create } from "zustand"
import { fetchAll, createItem, updateItem, deleteItem } from "./api"

interface Debt {
  id: string
  name: string
  creditor: string
  category: string
  total: number
  remaining: number
  rate: number
  monthly: number
  minimum: number | null
  installments: number | null
  paid: number
}

interface DebtStore {
  debts: Debt[]
  addDebt: (d: Omit<Debt, "id">) => Promise<void>
  updateDebt: (id: string, d: Partial<Debt>) => Promise<void>
  deleteDebt: (id: string) => Promise<void>
  hydrate: () => Promise<void>
  reset: () => void
}

export const useDebtStore = create<DebtStore>()((set, get) => ({
  debts: [],
  addDebt: async (d) => {
    const newDebt: Debt = { id: crypto.randomUUID(), ...d }
    set({ debts: [...get().debts, newDebt] })
    await createItem("/api/debts", { id: newDebt.id, ...d })
  },
  updateDebt: async (id, d) => {
    set({ debts: get().debts.map((x) => (x.id === id ? { ...x, ...d } : x)) })
    await updateItem("/api/debts", { id, ...d })
  },
  deleteDebt: async (id) => {
    set({ debts: get().debts.filter((x) => x.id !== id) })
    await deleteItem("/api/debts", id)
  },
  hydrate: async () => {
    const items = await fetchAll<Debt>("/api/debts")
    set({ debts: items })
  },
  reset: () => set({ debts: [] }),
}))