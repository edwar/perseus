import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"

interface ContributeFormProps {
  goalName: string
  onContribute: (amount: number) => void
  onClose: () => void
}

export function ContributeForm({ goalName, onContribute, onClose }: ContributeFormProps) {
  const [amount, setAmount] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount) return
    onContribute(Number(amount))
    setAmount("")
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-lg border p-3">
      <p className="text-xs font-medium">Abonar a {goalName}</p>
      <div className="flex gap-2">
        <div className="flex-1">
          <CurrencyInput value={amount} onChange={setAmount} placeholder="0" className="h-8 text-sm" autoFocus />
        </div>
        <Button type="submit" size="sm" disabled={!amount}>Abonar</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>X</Button>
      </div>
    </form>
  )
}
