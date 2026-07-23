import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/ui/currency-input"
import type { Transaction } from "@/hooks/use-transactions"

interface InlineEditFormProps {
  tx: Transaction
  onSave: (data: Partial<Transaction>) => void
  onCancel: () => void
}

export function InlineEditForm({ tx, onSave, onCancel }: InlineEditFormProps) {
  const [description, setDescription] = useState(tx.description)
  const [amount, setAmount] = useState(String(tx.amount))
  const [category, setCategory] = useState(tx.category)

  return (
    <div className="flex items-center gap-2 px-6 py-3">
      <Input value={description} onChange={(e) => setDescription(e.target.value)} className="flex-1 h-8 text-sm" />
      <CurrencyInput value={amount} onChange={(v) => setAmount(v)} className="h-8 w-28 text-sm" />
      <Button size="sm" onClick={() => onSave({ description, amount: Number(amount) || 0, category })}>Guardar</Button>
      <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
    </div>
  )
}
