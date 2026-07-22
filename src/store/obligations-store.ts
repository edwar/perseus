import { create } from "zustand"

export interface Obligation {
  id: string
  name: string
}

export interface MonthlyCheck {
  month: string
  paid: string[]
}

interface ObligationsStore {
  obligations: Obligation[]
  checks: MonthlyCheck[]
  addObligation: (o: Omit<Obligation, "id">) => Promise<void>
  updateObligation: (id: string, o: Partial<Obligation>) => Promise<void>
  deleteObligation: (id: string) => Promise<void>
  togglePaid: (obligationId: string, month: string) => Promise<void>
  hydrate: () => Promise<void>
  reset: () => void
}

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export const useObligationsStore = create<ObligationsStore>()((set, get) => ({
  obligations: [],
  checks: [],
  addObligation: async (o) => {
    set({ obligations: [...get().obligations, { id: crypto.randomUUID(), ...o }] })
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "obligations", data: { obligations: get().obligations, checks: get().checks } }) })
  },
  updateObligation: async (id, o) => {
    set({ obligations: get().obligations.map((x) => x.id === id ? { ...x, ...o } : x) })
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "obligations", data: { obligations: get().obligations, checks: get().checks } }) })
  },
  deleteObligation: async (id) => {
    set({ obligations: get().obligations.filter((x) => x.id !== id) })
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "obligations", data: { obligations: get().obligations, checks: get().checks } }) })
  },
  togglePaid: async (obligationId, month) => {
    const existing = get().checks.find((c) => c.month === month)
    if (existing) {
      const paid = existing.paid.includes(obligationId)
        ? existing.paid.filter((id) => id !== obligationId)
        : [...existing.paid, obligationId]
      set({ checks: get().checks.map((c) => c.month === month ? { ...c, paid } : c) })
    } else {
      set({ checks: [...get().checks, { month, paid: [obligationId] }] })
    }
    await fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "obligations", data: { obligations: get().obligations, checks: get().checks } }) })
  },
  hydrate: async () => {
    const res = await fetch("/api/data")
    const json = await res.json()
    set({ obligations: json.obligations?.obligations ?? [], checks: json.obligations?.checks ?? [] })
  },
  reset: () => set({ obligations: [], checks: [] }),
}))
