import { create } from "zustand"
import { fetchAll, createItem, updateItem, deleteItem } from "./api"

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
      await updateItem("/api/budgets", { ...b, items: JSON.stringify(b.items) })
    } else {
      const newBudget: Budget = { id: crypto.randomUUID(), ...b }
      set({ budgets: [...get().budgets, newBudget] })
      await createItem("/api/budgets", { ...newBudget, items: JSON.stringify(newBudget.items) })
    }
  },
  deleteBudget: async (id) => {
    set({ budgets: get().budgets.filter((x) => x.id !== id) })
    await deleteItem("/api/budgets", id)
  },
  hydrate: async () => {
    const items = await fetchAll<Budget>("/api/budgets")
    set({ budgets: items })
  },
  reset: () => set({ budgets: [] }),
}))