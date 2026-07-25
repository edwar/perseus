"use client"

import { useMemo, useState, useEffect } from "react"
import { useDocuments, useDocumentMutations } from "@/hooks/useDocuments"
import { useHeaderStore } from "@/store/header-store"
import { Empty } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { FileText, FolderOpen, ChevronLeft, ScanLine, CalendarDays, Receipt, FileCheck } from "lucide-react"
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

  const stats = useMemo(() => {
    const receipts = docs.filter(d => d.type === "receipt").length
    const invoices = docs.filter(d => d.type === "invoice").length
    return { total: docs.length, receipts, invoices, years: years.length }
  }, [docs, years])

  if (isLoading) {
    return (
      <div className="space-y-6 min-h-screen">
        <div className="flex items-center justify-between mt-10 md:hidden"><h1 className="text-2xl font-bold">Documentos</h1></div>

        {/* Summary Skeleton */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-shimmer rounded-xl bg-muted-foreground/15" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-14 animate-shimmer rounded bg-muted-foreground/15" />
                  <div className="h-5 w-10 animate-shimmer rounded bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Folder Skeleton */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 animate-shimmer rounded bg-muted-foreground/15" />
            <div className="h-4 w-12 animate-shimmer rounded bg-muted-foreground/15" />
            <div className="h-4 w-6 animate-shimmer rounded bg-muted-foreground/15" />
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,192px)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/50 h-48 animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (docs.length === 0) {
    return (
      <div className="space-y-6 min-h-screen">
        <h1 className="text-2xl font-bold mt-10 md:hidden">Documentos</h1>
        <Empty icon={ScanLine} title="No hay documentos" description="Los documentos escaneados aparecerán aquí" />
      </div>
    )
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Summary Cards */}
      {!year && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 animate-stagger-in">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-primary/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 animate-pulse-glow pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-blue-700 text-white shadow-md shadow-primary/25">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Total</p>
                <p className="text-lg font-extrabold text-blue-700 tracking-tight">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-card border border-success/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-success/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-success to-emerald-600 text-white shadow-md shadow-success/25">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Recibos</p>
                <p className="text-lg font-extrabold text-emerald-700 tracking-tight">{stats.receipts}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-card border border-warning/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-warning/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-warning/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-warning to-orange-600 text-white shadow-md shadow-warning/25">
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warning">Facturas</p>
                <p className="text-lg font-extrabold text-orange-700 tracking-tight">{stats.invoices}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-4 transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-xp/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: "3s" }} />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-xp to-purple-700 text-white shadow-md shadow-xp/25">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-xp">Años</p>
                <p className="text-lg font-extrabold text-purple-700 tracking-tight">{stats.years}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Year View */}
      {!year && (
        <div className="animate-stagger-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold">Años</h2>
            <span className="text-xs text-muted-foreground font-medium">({years.length})</span>
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,192px)]">
            {years.map((y, i) => {
              const count = docs.filter((d) => d.uploadedAt.startsWith(y)).length
              return (
                <div
                  key={y}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 animate-stagger-in h-48"
                  style={{ animationDelay: `${200 + i * 50}ms` }}
                  onClick={() => setYear(y)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-primary/5 to-transparent" />
                  <div className="relative flex flex-col items-center justify-center h-full gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                      <FolderOpen className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-extrabold tracking-tight">{y}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{count} documentos</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Month View */}
      {year && !month && (
        <div className="animate-stagger-in">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold">{year}</h2>
            <span className="text-xs text-muted-foreground font-medium">({monthsInYear.length} meses)</span>
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,192px)]">
            {monthsInYear.map((m, i) => {
              const count = docs.filter((d) => d.uploadedAt.startsWith(`${year}-${m}`)).length
              return (
                <div
                  key={m}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 animate-stagger-in h-48"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => setMonth(m)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-primary/5 to-transparent" />
                  <div className="relative flex flex-col items-center justify-center h-full gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                      <CalendarDays className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-extrabold tracking-tight">{MONTHS[Number(m) - 1]}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{count} documentos</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Document View */}
      {year && month && (
        <div className="space-y-8 animate-stagger-in">
          {(["receipt", "invoice"] as const).map((type) => {
            const items = docsInMonth[type]
            if (items.length === 0) return null
            return (
              <div key={type}>
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    {type === "receipt" ? (
                      <Receipt className="h-4 w-4 text-primary" />
                    ) : (
                      <FileCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <h2 className="text-sm font-bold">{type === "receipt" ? "Recibos" : "Facturas"}</h2>
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{items.length}</span>
                </div>
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,200px)]">
                  {items.map((doc, i) => (
                      <div key={doc.id ?? doc.publicId ?? i} className="animate-stagger-in" style={{ animationDelay: `${i * 40}ms` }}>
                        <DocumentCard doc={doc} />
                      </div>
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
