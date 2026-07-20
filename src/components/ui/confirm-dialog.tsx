"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-50 w-[90vw] max-w-sm rounded-2xl bg-popover p-6 shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { onConfirm(); onCancel() }}>Eliminar</Button>
        </div>
      </div>
    </div>
  )
}
