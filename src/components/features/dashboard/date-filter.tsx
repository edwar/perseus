"use client"

import { useRef, useEffect, useState } from "react"
import { CalendarDays, ChevronDown, CalendarRange, ArrowLeftRight } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { useDateFilterStore, type DateFilterMode } from "@/store/date-filter-store"
import { MONTHS } from "@/lib/constants"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i)

const TABS: Array<{ id: DateFilterMode; label: string; icon: React.ReactNode }> = [
  { id: "month", label: "Mes", icon: <CalendarDays className="h-3.5 w-3.5" /> },
  { id: "range", label: "Rango", icon: <CalendarRange className="h-3.5 w-3.5" /> },
  { id: "comparison", label: "Comparar", icon: <ArrowLeftRight className="h-3.5 w-3.5" /> },
]

export function DateFilter({ monthOnly = false }: { monthOnly?: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const tabs = monthOnly ? TABS.filter((t) => t.id === "month") : TABS

  const {
    mode,
    selectedMonth,
    startDate,
    endDate,
    comparePeriods,
    setMode,
    setSelectedMonth,
    setStartDate,
    setEndDate,
    setComparePeriod,
    addComparePeriod,
    removeComparePeriod,
    getLabel,
  } = useDateFilterStore()

  useEffect(() => {
    if (monthOnly && mode !== "month") {
      setMode("month")
    }
  }, [monthOnly, mode, setMode])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const target = e.target as Node
        if (target instanceof Element && target.closest("[data-slot='select-content']")) return
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const [year, month] = selectedMonth.split("-").map(Number)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-background px-3 py-1.5 text-sm font-medium transition-all hover:bg-accent",
          open && "border-primary/40 bg-accent"
        )}
      >
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <span className="max-w-[180px] truncate">{getLabel()}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 rounded-2xl border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b p-1.5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                  mode === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4">
            {mode === "month" && (
              <MonthPanel
                month={month}
                year={year}
                onMonthChange={setSelectedMonth}
              />
            )}
            {mode === "range" && (
              <RangePanel
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
              />
            )}
            {mode === "comparison" && (
              <ComparisonPanel
                periods={comparePeriods}
                onPeriodChange={setComparePeriod}
                onAdd={addComparePeriod}
                onRemove={removeComparePeriod}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function MonthPanel({
  month,
  year,
  onMonthChange,
}: {
  month: number
  year: number
  onMonthChange: (v: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground">Seleccionar mes</p>
      <div className="grid grid-cols-3 gap-1.5">
        {MONTHS.map((name, i) => {
          const m = i + 1
          const isSelected = month === m
          return (
            <button
              key={m}
              onClick={() => onMonthChange(`${year}-${String(m).padStart(2, "0")}`)}
              className={cn(
                "rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {name.slice(0, 3)}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <p className="text-xs text-muted-foreground">Año</p>
        <div className="flex gap-1">
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => onMonthChange(`${y}-${String(month).padStart(2, "0")}`)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                year === y
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RangePanel({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: {
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
}) {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (startDate && endDate) {
      return { from: new Date(startDate), to: new Date(endDate) }
    }
    return undefined
  })

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange)
    if (selectedRange?.from) {
      onStartChange(formatDateStr(selectedRange.from))
    }
    if (selectedRange?.to) {
      onEndChange(formatDateStr(selectedRange.to))
    }
  }

  return (
    <div className="space-y-3">
      <Calendar
        mode="range"
        defaultMonth={range?.from}
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
      />
      <div className="flex gap-1.5 pt-1">
        {[
          { label: "Este mes", start: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`, end: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()).padStart(2, "0")}` },
          { label: "Últimos 7 días", start: getDaysAgo(7), end: todayStr() },
          { label: "Últimos 30 días", start: getDaysAgo(30), end: todayStr() },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => { onStartChange(preset.start); onEndChange(preset.end) }}
            className="rounded-lg bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ComparisonPanel({
  periods,
  onPeriodChange,
  onAdd,
  onRemove,
}: {
  periods: string[]
  onPeriodChange: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}) {
  const labels = ["A", "B", "C", "D", "E", "F"]
  return (
    <div className="space-y-3">
      {periods.map((period, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Periodo {labels[i]}
            </p>
            {periods.length > 2 && (
              <button
                onClick={() => onRemove(i)}
                className="text-xs text-muted-foreground hover:text-danger transition-colors"
              >
                Quitar
              </button>
            )}
          </div>
          <MonthYearSelect value={period} onChange={(v) => onPeriodChange(i, v)} />
        </div>
      ))}
      {periods.length < 6 && (
        <button
          onClick={onAdd}
          className="w-full rounded-xl border border-dashed border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          + Agregar periodo
        </button>
      )}
    </div>
  )
}

function MonthSelect({
  value,
  onChange,
  yearValue,
}: {
  value: string
  onChange: (v: string) => void
  yearValue: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(`${yearValue}-${v}`)}>
      <SelectTrigger size="sm" className="flex-1 text-xs">
        <SelectValue>
          {(v) => MONTHS[Number(v) - 1] || v}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {MONTHS.map((name, i) => (
          <SelectItem key={i} value={String(i + 1).padStart(2, "0")}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function YearSelect({
  value,
  onChange,
  monthValue,
}: {
  value: string
  onChange: (v: string) => void
  monthValue: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(`${v}-${monthValue}`)}>
      <SelectTrigger size="sm" className="w-20 text-xs">
        <SelectValue>
          {(v) => v}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {YEARS.map((yr) => (
          <SelectItem key={yr} value={String(yr)}>
            {yr}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function MonthYearSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const parts = value.split("-")
  const y = parts[0] || String(CURRENT_YEAR)
  const m = parts[1] || "01"
  return (
    <div className="flex gap-1.5">
      <YearSelect value={y} onChange={onChange} monthValue={m} />
      <MonthSelect value={m} onChange={onChange} yearValue={y} />
    </div>
  )
}

function formatDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function todayStr(): string {
  return formatDateStr(new Date())
}

function getDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}
