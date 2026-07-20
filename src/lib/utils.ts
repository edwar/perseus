import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = "COP"
): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(date))
}

export function formatRelativeDate(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diff = target.getTime() - now.getTime()
  const days = Math.round(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "Hoy"
  if (days === 1) return "Mañana"
  if (days === -1) return "Ayer"
  if (days < 0) return `Hace ${Math.abs(days)} días`
  return `En ${days} días`
}
