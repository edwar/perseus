import { create } from "zustand"

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
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "debts", data: get().debts }) })
  },
  updateDebt: async (id, d) => {
    set({ debts: get().debts.map((x) => x.id === id ? { ...x, ...d } : x) })
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "debts", data: get().debts }) })
  },
  deleteDebt: async (id) => {
    set({ debts: get().debts.filter((x) => x.id !== id) })
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "debts", data: get().debts }) })
  },
  hydrate: async () => {
    const res = await fetch("/api/data")
    const json = await res.json()
    set({ debts: json.debts ?? [] })
  },
  reset: () => set({ debts: [] }),
}))
