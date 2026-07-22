import { create } from "zustand"
import { fetchObject, updateItem, deleteItem } from "./api"

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

export const useObligationsStore = create<ObligationsStore>()((set, get) => ({
  obligations: [],
  checks: [],
  addObligation: async (o) => {
    const id = crypto.randomUUID()
    set({ obligations: [...get().obligations, { id, ...o }] })
    await fetch("/api/obligations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "obligation", id, name: o.name }),
    })
  },
  updateObligation: async (id, o) => {
    set({ obligations: get().obligations.map((x) => (x.id === id ? { ...x, ...o } : x)) })
    await updateItem("/api/obligations", { id, name: o.name })
  },
  deleteObligation: async (id) => {
    set({ obligations: get().obligations.filter((x) => x.id !== id) })
    await deleteItem("/api/obligations", id)
  },
  togglePaid: async (obligationId, month) => {
    const existing = get().checks.find((c) => c.month === month)
    if (existing) {
      const paid = existing.paid.includes(obligationId)
        ? existing.paid.filter((id) => id !== obligationId)
        : [...existing.paid, obligationId]
      set({ checks: get().checks.map((c) => (c.month === month ? { ...c, paid } : c)) })
    } else {
      set({ checks: [...get().checks, { month, paid: [obligationId] }] })
    }
    await fetch("/api/obligations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "toggle", month, obligation_id: obligationId }),
    })
  },
  hydrate: async () => {
    const data = await fetchObject<{ obligations: Obligation[]; checks: MonthlyCheck[] }>("/api/obligations", { obligations: [], checks: [] })
    set({ obligations: data.obligations ?? [], checks: data.checks ?? [] })
  },
  reset: () => set({ obligations: [], checks: [] }),
}))