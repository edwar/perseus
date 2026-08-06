import Image from "next/image"
import { useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FileText, Trash2, X, Receipt, FileCheck, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateLong } from "@/lib/formats"
import { FIELD_LABELS } from "@/lib/constants"
import { useDocumentMutations } from "@/hooks/useDocuments"
import type { ScannedDoc } from "@/hooks/useDocuments"

interface DocumentCardProps {
  doc: ScannedDoc
}

export function DocumentCard({ doc }: DocumentCardProps) {
  const [open, setOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const { remove } = useDocumentMutations()
  const isPDF = doc.url.endsWith(".pdf")
  const isReceipt = doc.type === "receipt"

  async function handleDelete() {
    await remove.mutateAsync(doc.publicId)
    setOpen(false)
    setDeleteConfirm(false)
  }

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-2xl bg-card border border-border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 w-full h-[240px]"
        onClick={() => setOpen(true)}
      >
        {/* Content area */}
        <div className="relative h-[180px] overflow-hidden">
          {isPDF ? (
            <div className="flex h-full flex-col items-center justify-center bg-linear-to-br from-muted/50 to-muted gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-7 w-7" />
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">PDF</span>
            </div>
          ) : (
            <Image
              src={doc.url}
              alt="documento"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="200px"
            />
          )}

          {/* Delete button — show on hover */}
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-danger hover:bg-danger hover:text-white shadow-md transition-all duration-200"
              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true) }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Type badge */}
          <div className="absolute top-2 left-2 z-20">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm shadow-sm",
              isReceipt
                ? "bg-success/90 text-white"
                : "bg-primary/90 text-white"
            )}>
              {isReceipt ? <Receipt className="h-2.5 w-2.5" /> : <FileCheck className="h-2.5 w-2.5" />}
              {isReceipt ? "Recibo" : "Factura"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="h-[60px] px-3 py-2.5 flex items-center gap-2 border-t border-border/50">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold truncate">{new Date(doc.uploadedAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}</p>
            <p className="text-[10px] text-muted-foreground truncate">{isPDF ? "Documento PDF" : "Imagen"}</p>
          </div>
        </div>
      </div>

      {/* Viewer Modal — Portal escapes parent overflow */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-background shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  isReceipt ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                )}>
                  {isReceipt ? <Receipt className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">{formatDateLong(doc.uploadedAt)}</p>
                  <p className="text-xs text-muted-foreground">{isReceipt ? "Recibo" : "Factura"} {isPDF ? "· PDF" : "· Imagen"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPDF && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Abrir PDF
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-danger hover:text-danger-hover hover:bg-coral-50" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true) }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
              {isPDF ? (
                <iframe src={doc.url} title="PDF" className="h-[75vh] w-full rounded-xl border" />
              ) : (
                <div className="relative w-full" style={{ minHeight: 400, maxHeight: "70vh" }}>
                  <Image
                    src={doc.url}
                    alt="documento"
                    fill
                    className="object-contain rounded-xl"
                    sizes="(max-width: 768px) 100vw, 75vw"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Document Data */}
            {Object.entries(doc.data).filter(([, v]) => v != null && v !== "").length > 0 && (
              <div className="mx-5 mb-5 space-y-2.5 rounded-xl bg-muted/50 p-4 border-t border-border/50">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Datos extraídos</p>
                {Object.entries(doc.data).filter(([, v]) => v != null && v !== "").map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{FIELD_LABELS[key] ?? key}</span>
                    <span className="font-semibold tabular-nums">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      <ConfirmDialog
        open={deleteConfirm}
        title="Eliminar documento"
        message={`¿Eliminar este ${isReceipt ? "recibo" : "factura"}? Se borrará de la nube y del sistema.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
        loading={remove.isPending}
      />
    </>
  )
}
