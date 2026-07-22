import { create } from "zustand"
import { persistData, fetchHydrate } from "./api"

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
    set({ debts: [...get().debts, { id: crypto.randomUUID(), ...d }] })
    await persistData("debts", get().debts)
  },
  updateDebt: async (id, d) => {
    set({ debts: get().debts.map((x) => x.id === id ? { ...x, ...d } : x) })
    await persistData("debts", get().debts)
  },
  deleteDebt: async (id) => {
    set({ debts: get().debts.filter((x) => x.id !== id) })
    await persistData("debts", get().debts)
  },
  hydrate: async () => {
    set({ debts: await fetchHydrate("debts", []) })
  },
  reset: () => set({ debts: [] }),
}))