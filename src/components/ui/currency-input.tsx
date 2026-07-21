"use client"

import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function formatCurrency(val: string): string {
  const normalized = val.replace(",", ".")
  const dotIndex = normalized.indexOf(".")
  if (dotIndex === -1) {
    const digits = val.replace(/\D/g, "")
    if (!digits) return ""
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const intPart = normalized.slice(0, dotIndex).replace(/\D/g, "")
  const decPart = normalized.slice(dotIndex + 1).replace(/\D/g, "").slice(0, 2)
  if (!intPart && !decPart) return ""
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  const hasDecimalSep = normalized.includes(".")
  if (hasDecimalSep && !decPart) return `${formattedInt},`
  return decPart ? `${formattedInt},${decPart}` : formattedInt
}

function parseInput(raw: string): string {
  const cleaned = raw.replace(/[^\d,]/g, "")
  const parts = cleaned.split(",")
  if (parts.length > 2) {
    return parts[0] + "," + parts.slice(1).join("")
  }
  const dec = parts[1]
  if (dec && dec.length > 2) {
    return parts[0] + "," + dec.slice(0, 2)
  }
  return cleaned
}

function cursorAfterFormat(rawBefore: string, cursorPos: number): number {
  const formatted = formatCurrency(parseInput(rawBefore))

  const rawUntil = rawBefore.slice(0, cursorPos)
  const cleanUntil = parseInput(rawUntil)

  const formattedClean = formatCurrency(cleanUntil)

  if (formattedClean === formatted) return formatted.length

  let pos = 0
  for (let i = 0; i < formattedClean.length && pos < formatted.length; i++) {
    if (formatted[pos] !== formattedClean[i]) break
    pos++
  }
  while (pos < formatted.length && (formatted[pos] === "." || formatted[pos] === ",")) {
    pos++
  }
  return pos
}

export function CurrencyInput({ value, onChange, className, ...props }: {
  value: string | number
  onChange: (value: string) => void
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type">) {
  const displayValue = typeof value === "number" ? String(value) : value

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const raw = input.value
    const cursor = input.selectionStart ?? 0
    const parsed = parseInput(raw)
    const normalized = parsed.replace(",", ".")
    onChange(normalized)

    requestAnimationFrame(() => {
      const newPos = cursorAfterFormat(raw, cursor)
      input.setSelectionRange(newPos, newPos)
    })
  }, [onChange])

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">$</span>
      <Input
        type="text"
        inputMode="decimal"
        value={formatCurrency(displayValue)}
        onChange={handleChange}
        className={cn("pl-7", className)}
        {...props}
      />
    </div>
  )
}
