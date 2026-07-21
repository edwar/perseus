"use client"

import Image from "next/image"
import { useMemo, useState, useEffect } from "react"
import { useDocumentStore, type ScannedDoc } from "@/store/document-store"
import { useHeaderStore } from "@/store/header-store"
import { Empty } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FileText, Receipt, FolderOpen, ChevronLeft, X, Trash2, ScanLine, CalendarDays } from "lucide-react"

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

const fieldLabels: Record<string, string> = {
  totalCuotas: "Total cuotas",
  cuotasPagadas: "Cuotas pagadas",
  pagoMinimo: "Pago mínimo",
  montoTotal: "Monto total",
  fechaVencimiento: "Fecha de vencimiento",
  acreedor: "Acreedor",
  tasaInteres: "Tasa de interés",
  saldoActual: "Saldo actual",
  totalInstallments: "Total cuotas",
  installmentsPaid: "Cuotas pagadas",
  minimumPayment: "Pago mínimo",
  amount: "Monto total",
  dueDate: "Fecha de vencimiento",
  creditor: "Acreedor",
  interestRate: "Tasa de interés",
  currentBalance: "Saldo actual",
  merchant: "Comercio",
  date: "Fecha",
  currency: "Moneda",
  invoice: "Factura",
  receipt: "Recibo",
}

export default function DocumentsPage() {
  const docs = useDocumentStore((s) => s.docs)
  const setHeaderAction = useHeaderStore((s) => s.setAction)
  const [year, setYear] = useState<string | null>(null)
  const [month, setMonth] = useState<string | null>(null)

  useEffect(() => {
    if (year || month) {
      setHeaderAction(
        <Button variant="ghost" size="sm" onClick={() => { if (month) { setMonth(null) } else { setYear(null) } }} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Volver
        </Button>
      )
    } else {
      setHeaderAction(null)
    }
    return () => setHeaderAction(null)
  }, [year, month, setHeaderAction])

  const years = useMemo(() => {
    const set = new Set<string>()
    for (const d of docs) set.add(d.uploadedAt.slice(0, 4))
    return [...set].sort((a, b) => Number(b) - Number(a))
  }, [docs])

  const monthsInYear = useMemo(() => {
    if (!year) return []
    const set = new Set<string>()
    for (const d of docs) {
      if (d.uploadedAt.startsWith(year)) set.add(d.uploadedAt.slice(5, 7))
    }
    return [...set].sort((a, b) => Number(b) - Number(a))
  }, [docs, year])

  const docsInMonth = useMemo(() => {
    if (!year || !month) return { receipt: [], invoice: [] } as Record<string, ScannedDoc[]>
    const prefix = `${year}-${month}`
    const receipt: ScannedDoc[] = []
    const invoice: ScannedDoc[] = []
    for (const d of docs) {
      if (d.uploadedAt.startsWith(prefix)) {
        if (d.type === "receipt") receipt.push(d)
        else invoice.push(d)
      }
    }
    return { receipt, invoice }
  }, [docs, year, month])

  if (docs.length === 0) {
    return (
      <div className="space-y-6 mt-10 md:hidden">
        <h1 className="text-2xl font-bold">Documentos</h1>
        <Empty icon={ScanLine} title="No hay documentos" description="Los documentos escaneados aparecerán aquí" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Year selector */}
      {!year && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "16px" }}>
          {years.map((y) => {
            const count = docs.filter((d) => d.uploadedAt.startsWith(y)).length
            return (
              <Card key={y} className="cursor-pointer transition-colors hover:bg-accent w-48 h-48" onClick={() => setYear(y)}>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FolderOpen className="mb-3 h-10 w-10 text-primary" />
                  <p className="text-xl font-bold">{y}</p>
                  <p className="text-xs text-muted-foreground">{count} documentos</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Month selector */}
      {year && !month && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "16px" }}>
          {monthsInYear.map((m) => {
            const count = docs.filter((d) => d.uploadedAt.startsWith(`${year}-${m}`)).length
            return (
              <Card key={m} className="cursor-pointer transition-colors hover:bg-accent w-48 h-48" onClick={() => setMonth(m)}>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <CalendarDays className="mb-3 h-10 w-10 text-primary" />
                  <p className="text-lg font-bold">{months[Number(m) - 1]}</p>
                  <p className="text-xs text-muted-foreground">{count} documentos</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Documents by type */}
      {year && month && (
        <div className="space-y-8">
          {(["receipt", "invoice"] as const).map((type) => {
            const items = docsInMonth[type]
            if (items.length === 0) return null
            return (
              <div key={type}>
                <div className="mb-3 flex items-center gap-2">
                  {type === "receipt" ? (
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                  <h2 className="text-lg font-semibold">
                    {type === "receipt" ? "Recibos" : "Facturas"}
                  </h2>
                  <span className="text-xs text-muted-foreground">({items.length})</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "16px" }}>
                  {items.map((doc, i) => (
                    <DocumentCard key={doc.id ?? doc.publicId ?? i} doc={doc} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DocumentCard({ doc }: { doc: ScannedDoc }) {
  const [open, setOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const deleteDoc = useDocumentStore((s) => s.deleteDoc)
  const isPDF = doc.url.endsWith(".pdf")

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch(`/api/documents?publicId=${encodeURIComponent(doc.publicId)}`, { method: "DELETE" })
      deleteDoc(doc.id)
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
      <Card className="relative flex flex-col overflow-hidden h-[200px] w-[200px] rounded-sm cursor-pointer" onClick={() => setOpen(true)}>
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
                <p className="text-sm text-muted-foreground">
                  {new Date(doc.uploadedAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
                </p>
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
                    <span className="text-muted-foreground">{fieldLabels[key] ?? key}</span>
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
