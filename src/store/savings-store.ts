import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

export interface Investment {
  id: string
  entity: string
  amount: number
  rate: number
  termDays: number
  startDate: string
  endDate: string
}

interface SavingsStore {
  goals: Goal[]
  investments: Investment[]
  addGoal: (g: Omit<Goal, "id">) => void
  updateGoal: (id: string, g: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addInvestment: (i: Omit<Investment, "id">) => void
  updateInvestment: (id: string, i: Partial<Investment>) => void
  deleteInvestment: (id: string) => void
}

export const useSavingsStore = create<SavingsStore>()(
  persist(
    (set) => ({
      goals: [] as Goal[],
      investments: [] as Investment[],
      addGoal: (g) => set((s) => ({ goals: [...s.goals, { id: String(Date.now()), ...g }] })),
      updateGoal: (id, g) => set((s) => ({ goals: s.goals.map((x) => x.id === id ? { ...x, ...g } : x) })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((x) => x.id !== id) })),
      addInvestment: (i) => set((s) => ({ investments: [...s.investments, { id: String(Date.now()), ...i }] })),
      updateInvestment: (id, i) => set((s) => ({ investments: s.investments.map((x) => x.id === id ? { ...x, ...i } : x) })),
      deleteInvestment: (id) => set((s) => ({ investments: s.investments.filter((x) => x.id !== id) })),
    }),
    { name: "perseus-savings" }
  )
)
