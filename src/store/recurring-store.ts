import { create } from "zustand"
import { fetchAll, createItem, updateItem, deleteItem } from "./api"

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
    const newItem: RecurringItem = { id: crypto.randomUUID(), ...d }
    set({ items: [...get().items, newItem] })
    await createItem("/api/recurring", {
      id: newItem.id,
      name: newItem.name,
      amount: newItem.amount,
      type: newItem.type,
      frequency: newItem.frequency,
      day_of_month: newItem.dayOfMonth,
      category: newItem.category,
      debt_id: newItem.debtId,
    })
  },
  updateItem: async (id, d) => {
    set({ items: get().items.map((x) => (x.id === id ? { ...x, ...d } : x)) })
    await updateItem("/api/recurring", {
      id,
      ...d,
      day_of_month: d.dayOfMonth,
      debt_id: d.debtId,
    })
  },
  deleteItem: async (id) => {
    set({ items: get().items.filter((x) => x.id !== id) })
    await deleteItem("/api/recurring", id)
  },
  hydrate: async () => {
    const items = await fetchAll<RecurringItem>("/api/recurring")
    set({ items })
  },
  reset: () => set({ items: [] }),
}))