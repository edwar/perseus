import { create } from "zustand"
import { fetchHydrate, persistData } from "./api"

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
  addGoal: (g: Omit<Goal, "id">) => Promise<void>
  updateGoal: (id: string, g: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  addInvestment: (i: Omit<Investment, "id">) => Promise<void>
  updateInvestment: (id: string, i: Partial<Investment>) => Promise<void>
  deleteInvestment: (id: string) => Promise<void>
  hydrate: () => Promise<void>
  reset: () => void
}

export const useSavingsStore = create<SavingsStore>()((set, get) => ({
  goals: [],
  investments: [],
  addGoal: async (g) => {
    set({ goals: [...get().goals, { id: crypto.randomUUID(), ...g }] })
    await persistData("savings", { goals: get().goals, investments: get().investments })
  },
  updateGoal: async (id, g) => {
    set({ goals: get().goals.map((x) => x.id === id ? { ...x, ...g } : x) })
    await persistData("savings", { goals: get().goals, investments: get().investments })
  },
  deleteGoal: async (id) => {
    set({ goals: get().goals.filter((x) => x.id !== id) })
    await persistData("savings", { goals: get().goals, investments: get().investments })
  },
  addInvestment: async (i) => {
    set({ investments: [...get().investments, { id: crypto.randomUUID(), ...i }] })
    await persistData("savings", { goals: get().goals, investments: get().investments })
  },
  updateInvestment: async (id, i) => {
    set({ investments: get().investments.map((x) => x.id === id ? { ...x, ...i } : x) })
    await persistData("savings", { goals: get().goals, investments: get().investments })
  },
  deleteInvestment: async (id) => {
    set({ investments: get().investments.filter((x) => x.id !== id) })
    await persistData("savings", { goals: get().goals, investments: get().investments })
  },
  hydrate: async () => {
    const data = await fetchHydrate("savings", { goals: [], investments: [] })
    set({ goals: data.goals ?? [], investments: data.investments ?? [] })
  },
  reset: () => set({ goals: [], investments: [] }),
}))