"use client"

import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ComparisonCardsProps {
  data: Array<{ income: number; expenses: number; balance: number }>
  totalBalance: number
}

const PERIOD_LABELS = ["A", "B", "C", "D", "E", "F"]

export function ComparisonCards({ data, totalBalance }: ComparisonCardsProps) {
  const items = [
    {
      icon: <Wallet className="h-5 w-5" />,
      label: "Balance total",
      value: formatCurrency(totalBalance),
      gradient: "from-blue-500 via-blue-600 to-blue-800",
      shadow: "shadow-primary/25",
    },
    {
      icon: <ArrowUpRight className="h-5 w-5" />,
      label: "Ingresos",
      values: data.map((d, i) => ({ label: PERIOD_LABELS[i], amount: formatCurrency(d.income) })),
      gradient: "from-emerald-400 via-emerald-500 to-emerald-700",
      shadow: "shadow-success/25",
    },
    {
      icon: <ArrowDownRight className="h-5 w-5" />,
      label: "Gastos",
      values: data.map((d, i) => ({ label: PERIOD_LABELS[i], amount: formatCurrency(d.expenses) })),
      gradient: "from-coral-300 via-coral-400 to-coral-600",
      shadow: "shadow-danger/25",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3 relative">
      {items.map((item) => (
        <div
          key={item.label}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white transition-all duration-300 ${item.gradient} ${item.shadow}`}
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              {item.icon}
            </div>
            <p className="text-sm font-medium text-white/80">{item.label}</p>
            {"value" in item ? (
              <p className="mt-1 text-2xl font-bold tracking-tight">{item.value}</p>
            ) : (
              <div className="mt-1 flex flex-col gap-1">
                {"values" in item && item.values.map((v) => (
                  <div key={v.label} className="flex items-center gap-2">
                    <span className="text-xs text-white/60">{v.label}:</span>
                    <p className="text-lg font-bold tracking-tight">{v.amount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
