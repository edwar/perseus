import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  addDebt: (d: Omit<Debt, "id">) => void
  updateDebt: (id: string, d: Partial<Debt>) => void
  deleteDebt: (id: string) => void
}

export const useDebtStore = create<DebtStore>()(
  persist(
    (set) => ({
      debts: [] as Debt[],
      addDebt: (d) => set((s) => ({ debts: [...s.debts, { id: String(Date.now()), ...d }] })),
      updateDebt: (id, d) => set((s) => ({ debts: s.debts.map((x) => x.id === id ? { ...x, ...d } : x) })),
      deleteDebt: (id) => set((s) => ({ debts: s.debts.filter((x) => x.id !== id) })),
    }),
    { name: "perseus-debts" }
  )
)
