import { create } from "zustand"

interface BalanceState {
  balance: number
  setBalance: (n: number) => void
  addToBalance: (n: number) => void
  hydrate: (n: number) => void
}

export const useBalanceStore = create<BalanceState>()((set) => ({
  balance: 0,
  setBalance: (n) => set({ balance: n }),
  addToBalance: (n) => set((s) => ({ balance: s.balance + n })),
  hydrate: (n) => set({ balance: n }),
}))
