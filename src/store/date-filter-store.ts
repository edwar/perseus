import { create } from "zustand"

export type DateFilterMode = "month" | "range" | "comparison"

interface DateRange {
  start: string
  end: string
}

interface DateFilterState {
  mode: DateFilterMode
  selectedMonth: string
  startDate: string
  endDate: string
  comparePeriods: string[]
  setMode: (mode: DateFilterMode) => void
  setSelectedMonth: (month: string) => void
  setStartDate: (date: string) => void
  setEndDate: (date: string) => void
  setComparePeriod: (index: number, month: string) => void
  addComparePeriod: () => void
  removeComparePeriod: (index: number) => void
  getActiveRange: () => DateRange
  getCompareRanges: () => DateRange[] | null
  getLabel: () => string
}

function monthToRange(month: string): DateRange {
  const [y, m] = month.split("-").map(Number)
  const lastDay = new Date(y, m, 0).getDate()
  return {
    start: `${y}-${String(m).padStart(2, "0")}-01`,
    end: `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
  }
}

function formatMonthShort(month: string): string {
  const parts = month.split("-")
  if (parts.length !== 2) return month
  const y = Number(parts[0])
  const m = Number(parts[1])
  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) return month
  const d = new Date(y, m - 1, 1)
  return d.toLocaleDateString("es-CO", { month: "short", year: "numeric" })
}

function formatMonthShortNoYear(month: string): string {
  const parts = month.split("-")
  if (parts.length !== 2) return month
  const y = Number(parts[0])
  const m = Number(parts[1])
  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) return month
  const d = new Date(y, m - 1, 1)
  return d.toLocaleDateString("es-CO", { month: "short" })
}

function todayStr(): string {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`
}

const now = new Date()
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
const currentMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`

export const useDateFilterStore = create<DateFilterState>()((set, get) => ({
  mode: "month",
  selectedMonth: currentMonth,
  startDate: currentMonthStart,
  endDate: todayStr(),
  comparePeriods: [currentMonth, currentMonth],

  setMode: (mode) => set({ mode }),
  setSelectedMonth: (selectedMonth) => set({ selectedMonth }),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),

  setComparePeriod: (index, month) =>
    set((s) => {
      const periods = [...s.comparePeriods]
      periods[index] = month
      return { comparePeriods: periods }
    }),

  addComparePeriod: () =>
    set((s) => {
      if (s.comparePeriods.length >= 6) return s
      return { comparePeriods: [...s.comparePeriods, currentMonth] }
    }),

  removeComparePeriod: (index) =>
    set((s) => {
      if (s.comparePeriods.length <= 2) return s
      return { comparePeriods: s.comparePeriods.filter((_, i) => i !== index) }
    }),

  getActiveRange: () => {
    const s = get()
    if (s.mode === "month") return monthToRange(s.selectedMonth)
    if (s.mode === "comparison" && s.comparePeriods.length > 0) return monthToRange(s.comparePeriods[0])
    return { start: s.startDate, end: s.endDate }
  },

  getCompareRanges: () => {
    const s = get()
    if (s.mode !== "comparison") return null
    return s.comparePeriods.map((p) => monthToRange(p))
  },

  getLabel: () => {
    const s = get()
    if (s.mode === "month") return formatMonthShort(s.selectedMonth)
    if (s.mode === "range") {
      const from = new Date(s.startDate + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short" })
      const to = new Date(s.endDate + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
      return `${from} – ${to}`
    }
    return s.comparePeriods.map((p) => formatMonthShortNoYear(p)).join(" vs ")
  },
}))
