import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FileText, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateLong } from "@/lib/formats"
import { FIELD_LABELS } from "@/lib/constants"
import type { ScannedDoc } from "@/hooks/useDocuments"

interface DocumentCardProps {
  doc: ScannedDoc
  onDelete?: () => void
}

export function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  const [open, setOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isPDF = doc.url.endsWith(".pdf")

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch(`/api/documents?publicId=${encodeURIComponent(doc.publicId)}`, { method: "DELETE" })
      onDelete?.()
      setOpen(false)
    } catch {
      console.error("Error al eliminar de Cloudinary")
    } finally {
      setDeleting(false)
      setDeleteConfirm(false)
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden h-[200px] w-[200px] rounded-sm cursor-pointer" onClick={() => setOpen(true)}>
        <div className="absolute top-2 right-2 z-20">
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-white bg-white hover:bg-red-500 rounded-full" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true) }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div
          className={cn(
            "relative flex-1 bg-muted",
            doc.type === "invoice" && "flex items-center justify-center"
          )}
        >
          {doc.type === "invoice" ? (
            <div className="flex w-full h-full flex-col items-center gap-2 text-muted-foreground">
              <FileText className="h-full w-full" />
              <span className="text-xs">Factura</span>
            </div>
          ) : (
            <Image
              src={doc.url}
              alt="documento"
              fill
              className="object-cover"
              sizes="200px"
            />
          )}
        </div>
        <div className="absolute bottom-0 w-full h-8 bg-white z-10 flex justify-center items-center">
          <p className="text-xs text-muted-foreground font-bold">{new Date(doc.uploadedAt).toLocaleDateString("es-CO")}</p>
        </div>
      </Card>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-screen md:w-[60vw] flex-col rounded-xl bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 p-4 pb-0">
              <div>
                <p className="text-sm text-muted-foreground">{formatDateLong(doc.uploadedAt)}</p>
                <p className="text-xs text-muted-foreground capitalize">{doc.type === "receipt" ? "Recibo" : "Factura"}</p>
              </div>
              <div className="flex items-center gap-2">
                {isPDF && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-1 h-4 w-4" /> Abrir PDF
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true) }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {isPDF ? (
                <iframe src={doc.url} title="PDF" className="h-[70vh] w-full rounded-lg" />
              ) : doc.type === "receipt" ? (
                <div className="relative max-h-[60vh] w-full" style={{ minHeight: 300 }}>
                  <Image
                    src={doc.url}
                    alt="documento"
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-lg bg-muted py-16">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {Object.entries(doc.data).filter(([, v]) => v != null && v !== "").length > 0 && (
              <div className="mx-4 mb-4 space-y-2 rounded-lg bg-muted/50 p-4">
                {Object.entries(doc.data).filter(([, v]) => v != null && v !== "").map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{FIELD_LABELS[key] ?? key}</span>
                    <span className="font-medium">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm}
        title="Eliminar documento"
        message={`¿Eliminar este ${doc.type === "receipt" ? "recibo" : "factura"}? Se borrará de la nube y del sistema.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
        loading={deleting}
      />
    </>
  )
}
