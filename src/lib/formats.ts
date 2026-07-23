export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("es-CO")}`
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CO")
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatMonthYear(monthStr: string): string {
  const [y, month] = monthStr.split("-").map(Number)
  const d = new Date(y, month - 1, 1)
  return d.toLocaleDateString("es", { month: "long", year: "numeric" })
}
