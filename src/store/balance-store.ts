import { create } from "zustand"
import { persist } from "zustand/middleware"

interface BalanceState {
  balance: number
  setBalance: (n: number) => void
  addToBalance: (n: number) => void
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set) => ({
      balance: 0,
      setBalance: (n) => set({ balance: n }),
      addToBalance: (n) => set((s) => ({ balance: s.balance + n })),
    }),
    { name: "perseus-balance" }
  )
)
