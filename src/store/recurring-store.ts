import { create } from "zustand"
import { persistData, fetchHydrate } from "./api"

export interface RecurringItem {
  id: string
  name: string
  amount: number
  type: "INCOME" | "EXPENSE"
  frequency: string
  dayOfMonth: number
  category: string
  debtId?: string
}

interface RecurringStore {
  items: RecurringItem[]
  addItem: (d: Omit<RecurringItem, "id">) => Promise<void>
  updateItem: (id: string, d: Partial<RecurringItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  hydrate: () => Promise<void>
  reset: () => void
}

export const useRecurringStore = create<RecurringStore>()((set, get) => ({
  items: [],
  addItem: async (d) => {
    set({ items: [...get().items, { id: crypto.randomUUID(), ...d }] })
    await persistData("recurring", get().items)
  },
  updateItem: async (id, d) => {
    set({ items: get().items.map((x) => x.id === id ? { ...x, ...d } : x) })
    await persistData("recurring", get().items)
  },
  deleteItem: async (id) => {
    set({ items: get().items.filter((x) => x.id !== id) })
    await persistData("recurring", get().items)
  },
  hydrate: async () => {
    set({ items: await fetchHydrate("recurring", []) })
  },
  reset: () => set({ items: [] }),
}))