"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const COLORS = ["#1D4ED8", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#2563eb", "#6366f1"]

export function SpendingPie({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <Card>
      <div className="border-b px-6 py-4"><p className="font-semibold">Gastos por categoría</p></div>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: unknown) => `$${(v as number).toLocaleString("es-CO")}`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1">
          {data.slice(0, 5).map((cat, i) => (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{cat.name}</span>
              </div>
              <span className="font-medium">${cat.value.toLocaleString("es-CO")}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function IncomeBar({ data }: { data: Array<{ month: string; income: number; expenses: number }> }) {
  return (
    <Card>
      <div className="border-b px-6 py-4"><p className="font-semibold">Ingresos vs Gastos</p></div>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: unknown) => `$${((v as number) / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: unknown) => `$${(v as number).toLocaleString("es-CO")}`} />
            <Bar dataKey="income" name="Ingresos" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
