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
  addItem: (d: Omit<RecurringItem, "id">) => void
  updateItem: (id: string, d: Partial<RecurringItem>) => void
  deleteItem: (id: string) => void
  hydrate: () => Promise<void>
}

export const useRecurringStore = create<RecurringStore>()((set, get) => ({
  items: [],
  addItem: (d) => {
    set({ items: [...get().items, { id: crypto.randomUUID(), ...d }] })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "recurring", data: get().items }) })
  },
  updateItem: (id, d) => {
    set({ items: get().items.map((x) => x.id === id ? { ...x, ...d } : x) })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "recurring", data: get().items }) })
  },
  deleteItem: (id) => {
    set({ items: get().items.filter((x) => x.id !== id) })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "recurring", data: get().items }) })
  },
  hydrate: async () => {
    const res = await fetch("/api/data")
    const json = await res.json()
    set({ items: json.recurring ?? [] })
  },
}))
