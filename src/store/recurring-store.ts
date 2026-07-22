import { create } from "zustand"

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

const API = "/api/data"
const save = (items: RecurringItem[]) =>
  fetch(API, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "recurring", data: items }) })

export const useRecurringStore = create<RecurringStore>()((set, get) => ({
  items: [],
  addItem: async (d) => {
    const newItem = { id: crypto.randomUUID(), ...d }
    set({ items: [...get().items, newItem] })
    await save(get().items)
  },
  updateItem: async (id, d) => {
    set({ items: get().items.map((x) => x.id === id ? { ...x, ...d } : x) })
    await save(get().items)
  },
  deleteItem: async (id) => {
    set({ items: get().items.filter((x) => x.id !== id) })
    await save(get().items)
  },
  hydrate: async () => {
    const res = await fetch(API)
    const json = await res.json()
    set({ items: json.recurring ?? [] })
  },
  reset: () => set({ items: [] }),
}))
