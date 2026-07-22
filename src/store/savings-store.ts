import { create } from "zustand"
import { fetchObject, createItem, updateItem, deleteItem } from "./api"

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
    const newGoal: Goal = { id: crypto.randomUUID(), ...g }
    set({ goals: [...get().goals, newGoal] })
    await createItem("/api/savings", {
      id: newGoal.id,
      name: newGoal.name,
      target: newGoal.target,
      current: newGoal.current,
      deadline: newGoal.deadline,
    })
  },
  updateGoal: async (id, g) => {
    set({ goals: get().goals.map((x) => (x.id === id ? { ...x, ...g } : x)) })
    await updateItem("/api/savings", { id, ...g })
  },
  deleteGoal: async (id) => {
    set({ goals: get().goals.filter((x) => x.id !== id) })
    await deleteItem("/api/savings", id)
  },
  addInvestment: async (i) => {
    set({ investments: [...get().investments, { id: crypto.randomUUID(), ...i }] })
  },
  updateInvestment: async (id, i) => {
    set({ investments: get().investments.map((x) => (x.id === id ? { ...x, ...i } : x)) })
  },
  deleteInvestment: async (id) => {
    set({ investments: get().investments.filter((x) => x.id !== id) })
  },
  hydrate: async () => {
    const data = await fetchObject<{ goals: Goal[]; investments: Investment[] }>("/api/savings")
    set({ goals: data.goals ?? [], investments: data.investments ?? [] })
  },
  reset: () => set({ goals: [], investments: [] }),
}))