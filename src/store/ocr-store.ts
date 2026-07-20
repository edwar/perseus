import { create } from "zustand"
import { persist } from "zustand/middleware"

export const OCR_MONTHLY_LIMIT = 1000

interface OcrStore {
  used: number
  month: string
  quotaExceeded: boolean
  noKey: boolean
  increment: () => void
  setQuotaExceeded: (v: boolean) => void
  setNoKey: (v: boolean) => void
}

export function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}`
}

export function computeRemaining(used: number, month: string): number {
  if (month !== currentMonth()) return OCR_MONTHLY_LIMIT
  return Math.max(0, OCR_MONTHLY_LIMIT - used)
}

export const useOcrStore = create<OcrStore>()(
  persist(
    (set) => ({
      used: 0,
      month: currentMonth(),
      quotaExceeded: false,
      noKey: false,
      increment: () =>
        set((state) => {
          const m = currentMonth()
          if (state.month !== m) {
            return { used: 1, month: m, quotaExceeded: false }
          }
          const next = state.used + 1
          return { used: next, quotaExceeded: next >= OCR_MONTHLY_LIMIT }
        }),
      setQuotaExceeded: (v) => set({ quotaExceeded: v }),
      setNoKey: (v) => set({ noKey: v }),
    }),
    { name: "ocr-quota" }
  )
)
