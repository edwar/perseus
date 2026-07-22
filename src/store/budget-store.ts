import { create } from "zustand"

export interface BudgetItem {
  name: string
  amount: number
}

export interface Budget {
  id: string
  category: string
  amount: number
  color: string
  items?: BudgetItem[]
}

interface BudgetStore {
  budgets: Budget[]
  upsertBudget: (b: Omit<Budget, "id"> & { id?: string }) => Promise<void>
  deleteBudget: (id: string) => Promise<void>
  hydrate: () => Promise<void>
  reset: () => void
}

export const useBudgetStore = create<BudgetStore>()((set, get) => ({
  budgets: [],
  upsertBudget: async (b) => {
    if (b.id) {
      set({ budgets: get().budgets.map((x) => (x.id === b.id ? { ...x, ...b } : x)) })
    } else {
      set({ budgets: [...get().budgets, { id: crypto.randomUUID(), ...b }] })
    }
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "budgets", data: get().budgets }) })
  },
  deleteBudget: async (id) => {
    set({ budgets: get().budgets.filter((x) => x.id !== id) })
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "budgets", data: get().budgets }) })
  },
  hydrate: async () => {
    const res = await fetch("/api/data")
    const json = await res.json()
    set({ budgets: json.budgets ?? [] })
  },
  reset: () => set({ budgets: [] }),
}))
