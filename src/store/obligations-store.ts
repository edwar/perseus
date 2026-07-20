import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  addObligation: (o: Omit<Obligation, "id">) => void
  updateObligation: (id: string, o: Partial<Obligation>) => void
  deleteObligation: (id: string) => void
  togglePaid: (obligationId: string, month: string) => void
}

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export const useObligationsStore = create<ObligationsStore>()(
  persist(
    (set) => ({
      obligations: [],
      checks: [],
      addObligation: (o) => set((s) => ({ obligations: [...s.obligations, { id: String(Date.now()), ...o }] })),
      updateObligation: (id, o) => set((s) => ({ obligations: s.obligations.map((x) => x.id === id ? { ...x, ...o } : x) })),
      deleteObligation: (id) => set((s) => ({ obligations: s.obligations.filter((x) => x.id !== id) })),
      togglePaid: (obligationId, month) =>
        set((s) => {
          const existing = s.checks.find((c) => c.month === month)
          if (existing) {
            const paid = existing.paid.includes(obligationId)
              ? existing.paid.filter((id) => id !== obligationId)
              : [...existing.paid, obligationId]
            return { checks: s.checks.map((c) => c.month === month ? { ...c, paid } : c) }
          }
          return { checks: [...s.checks, { month, paid: [obligationId] }] }
        }),
    }),
    { name: "perseus-obligations" }
  )
)
