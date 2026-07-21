import { create } from "zustand"

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
  hydrate: () => Promise<void>
}

export const useSavingsStore = create<SavingsStore>()((set, get) => ({
  goals: [],
  investments: [],
  addGoal: (g) => {
    set({ goals: [...get().goals, { id: crypto.randomUUID(), ...g }] })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "savings", data: { goals: get().goals, investments: get().investments } }) })
  },
  updateGoal: (id, g) => {
    set({ goals: get().goals.map((x) => x.id === id ? { ...x, ...g } : x) })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "savings", data: { goals: get().goals, investments: get().investments } }) })
  },
  deleteGoal: (id) => {
    set({ goals: get().goals.filter((x) => x.id !== id) })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "savings", data: { goals: get().goals, investments: get().investments } }) })
  },
  addInvestment: (i) => {
    set({ investments: [...get().investments, { id: crypto.randomUUID(), ...i }] })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "savings", data: { goals: get().goals, investments: get().investments } }) })
  },
  updateInvestment: (id, i) => {
    set({ investments: get().investments.map((x) => x.id === id ? { ...x, ...i } : x) })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "savings", data: { goals: get().goals, investments: get().investments } }) })
  },
  deleteInvestment: (id) => {
    set({ investments: get().investments.filter((x) => x.id !== id) })
    fetch("/api/data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "savings", data: { goals: get().goals, investments: get().investments } }) })
  },
  hydrate: async () => {
    const res = await fetch("/api/data")
    const json = await res.json()
    set({ goals: json.savings?.goals ?? [], investments: json.savings?.investments ?? [] })
  },
}))
