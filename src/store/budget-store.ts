import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Budget {
  id: string
  category: string
  amount: number
  color: string
}

interface BudgetStore {
  budgets: Budget[]
  upsertBudget: (b: Omit<Budget, "id"> & { id?: string }) => void
  deleteBudget: (id: string) => void
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      budgets: [],
      upsertBudget: (b) =>
        set((state) => {
          if (b.id) return { budgets: state.budgets.map((x) => (x.id === b.id ? { ...x, ...b } : x)) }
          return { budgets: [...state.budgets, { id: String(Date.now()), ...b }] }
        }),
      deleteBudget: (id) => set((s) => ({ budgets: s.budgets.filter((x) => x.id !== id) })),
    }),
    { name: "perseus-budgets" }
  )
)
