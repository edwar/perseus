import { create } from "zustand"
import type { ReactNode } from "react"

interface HeaderStore {
  action: ReactNode | null
  setAction: (action: ReactNode | null) => void
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  action: null,
  setAction: (action) => set({ action }),
}))
