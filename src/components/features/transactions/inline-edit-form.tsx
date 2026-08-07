import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { useBudgets } from "@/hooks/useData"
import { formatCurrency } from "@/lib/formats"
import type { Transaction } from "@/hooks/use-transactions"

interface InlineEditFormProps {
  tx: Transaction
  onSave: (data: Partial<Transaction>) => void
  onCancel: () => void
}

export function InlineEditForm({ tx, onSave, onCancel }: InlineEditFormProps) {
  const { data: budgets } = useBudgets()
  const [description, setDescription] = useState(tx.description)
  const [amount, setAmount] = useState(String(tx.amount))
  const [category, setCategory] = useState(tx.category ?? "")
  const [activity, setActivity] = useState(tx.activity ?? "")

  const selectedBudget = (budgets ?? []).find((b) => b.category === category)
  const budgetItems = selectedBudget?.items?.filter((i) => i.name) ?? []

  return (
    <div className="px-6 py-3 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" className="flex-1 h-8 text-sm min-w-0" />
        <CurrencyInput value={amount} onChange={(v) => setAmount(v)} className="h-8 w-full sm:w-36 text-sm" />
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {tx.type === "EXPENSE" && (
          <>
            <Select value={category || undefined} onValueChange={(v) => { setCategory(v === "__clear__" ? "" : (v ?? "")); setActivity("") }}>
              <SelectTrigger className="h-8 text-xs w-full sm:w-80">
                <span>{category || "Sin presupuesto"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__clear__">Sin presupuesto</SelectItem>
                {(budgets ?? []).map((b) => (
                  <SelectItem key={b.id} value={b.category}>{b.category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {category && budgetItems.length > 0 && (
              <Select value={activity || undefined} onValueChange={(v) => setActivity(v === "__clear__" ? "" : (v ?? ""))}>
                <SelectTrigger className="h-8 text-xs w-full sm:w-80">
                  <span>{activity || "Ninguna"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__">Ninguna</SelectItem>
                  {budgetItems.map((item, i) => (
                    <SelectItem key={i} value={item.name}>
                      {item.name} — {formatCurrency(item.amount)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </>
        )}
        <div className="flex items-center gap-2 sm:ml-auto">
          <Button size="sm" onClick={() => onSave({ description, amount: Number(amount) || 0, category: category || null, activity: activity || null })}>Guardar</Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
        </div>
      </div>
    </div>
  )
}
