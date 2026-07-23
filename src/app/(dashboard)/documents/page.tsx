"use client"

import { useMemo, useState, useEffect } from "react"
import { useDocuments, useDocumentMutations } from "@/hooks/useDocuments"
import { useHeaderStore } from "@/store/header-store"
import { Empty } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, FolderOpen, ChevronLeft, ScanLine, CalendarDays } from "lucide-react"
import { DocumentCard } from "@/components/features/documents/document-card"
import { MONTHS } from "@/lib/constants"

export default function DocumentsPage() {
  const { data: docs = [], isLoading } = useDocuments()
  const { remove } = useDocumentMutations()
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
    if (!year || !month) return { receipt: [], invoice: [] } as Record<string, typeof docs>
    const prefix = `${year}-${month}`
    const receipt: typeof docs = []
    const invoice: typeof docs = []
    for (const d of docs) {
      if (d.uploadedAt.startsWith(prefix)) {
        if (d.type === "receipt") receipt.push(d)
        else invoice.push(d)
      }
    }
    return { receipt, invoice }
  }, [docs, year, month])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mt-10 md:hidden"><h1 className="text-2xl font-bold">Documentos</h1></div>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,200px)]">
          {Array.from({ length: 33 }).map((_, i) => (
            <div key={i} className="animate-shimmer h-[200px] w-[200px] rounded-sm bg-muted-foreground/20" />
          ))}
        </div>
      </div>
    )
  }

  if (docs.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mt-10 md:hidden">Documentos</h1>
        <Empty icon={ScanLine} title="No hay documentos" description="Los documentos escaneados aparecerán aquí" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!year && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,200px)]">
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

      {year && !month && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,200px)]">
          {monthsInYear.map((m) => {
            const count = docs.filter((d) => d.uploadedAt.startsWith(`${year}-${m}`)).length
            return (
              <Card key={m} className="cursor-pointer transition-colors hover:bg-accent w-48 h-48" onClick={() => setMonth(m)}>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <CalendarDays className="mb-3 h-10 w-10 text-primary" />
                  <p className="text-lg font-bold">{MONTHS[Number(m) - 1]}</p>
                  <p className="text-xs text-muted-foreground">{count} documentos</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {year && month && (
        <div className="space-y-8">
          {(["receipt", "invoice"] as const).map((type) => {
            const items = docsInMonth[type]
            if (items.length === 0) return null
            return (
              <div key={type}>
                <div className="mb-3 flex items-center gap-2">
                  {type === "receipt" ? (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                  <h2 className="text-lg font-semibold">
                    {type === "receipt" ? "Recibos" : "Facturas"}
                  </h2>
                  <span className="text-xs text-muted-foreground">({items.length})</span>
                </div>
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,200px)]">
                  {items.map((doc, i) => (
                    <DocumentCard key={doc.id ?? doc.publicId ?? i} doc={doc} onDelete={() => { }} />
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
