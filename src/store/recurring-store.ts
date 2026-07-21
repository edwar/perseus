import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  addItem: (d: Omit<RecurringItem, "id">) => void
  updateItem: (id: string, d: Partial<RecurringItem>) => void
  deleteItem: (id: string) => void
}

export const useRecurringStore = create<RecurringStore>()(
  persist(
    (set) => ({
      items: [] as RecurringItem[],
      addItem: (d) => set((s) => ({ items: [...s.items, { id: String(Date.now()), ...d }] })),
      updateItem: (id, d) => set((s) => ({ items: s.items.map((x) => x.id === id ? { ...x, ...d } : x) })),
      deleteItem: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
    }),
    { name: "perseus-recurring" }
  )
)
