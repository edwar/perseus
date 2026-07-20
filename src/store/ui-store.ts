import { create } from "zustand"

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

function getInitial(): boolean {
  if (typeof window === "undefined") return true
  return window.innerWidth >= 768
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: getInitial(),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
