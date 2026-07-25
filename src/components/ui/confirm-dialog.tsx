"use client"

import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function ConfirmDialog({ open, title, message, confirmLabel = "Eliminar", onConfirm, onCancel, loading }: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  loading?: boolean
}) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-[200] w-[90vw] max-w-sm rounded-2xl bg-popover p-6 shadow-2xl animate-stagger-in" style={{ animationDuration: "0.2s" }}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={loading} onClick={onCancel}>Cancelar</Button>
          <Button className="bg-danger hover:bg-danger-hover text-white" disabled={loading} onClick={async () => { await onConfirm(); onCancel() }}>
            {loading ? "Eliminando..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
