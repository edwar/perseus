"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Camera, ScanLine, Check, Loader2, FileText, X, CloudOff } from "lucide-react"
import { analyzeReceiptImage, analyzeDebtInvoice, type ReceiptData, type DebtInvoiceData } from "@/lib/ia"
import { uploadToCloudinary } from "@/lib/cloudinary-client"
import { useDocumentStore } from "@/store/document-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useOcrStore, computeRemaining } from "@/store/ocr-store"

type ScanMode = "receipt" | "invoice"

type ScanResult<T extends ScanMode> = T extends "receipt" ? ReceiptData : DebtInvoiceData

export function Scanner<T extends ScanMode>({ mode, onResult, onClear, className }: {
  mode: T
  onResult: (data: ScanResult<T>) => void
  onClear?: () => void
  className?: string
}) {
  const used = useOcrStore((s) => s.used)
  const month = useOcrStore((s) => s.month)
  const quotaExceeded = useOcrStore((s) => s.quotaExceeded)
  const remaining = computeRemaining(used, month)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setScanned(false)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }, [])

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  async function handleScan() {
    if (!file) return
    setScanning(true)
    setError(null)

    try {
      const data = (mode === "receipt"
        ? await analyzeReceiptImage(file)
        : await analyzeDebtInvoice(file)) as ScanResult<T>
      onResult(data)
      setScanned(true)

      const uploadResult = await uploadToCloudinary(file, mode)
      if (uploadResult) {
        useDocumentStore.getState().addDoc({
          id: uploadResult.public_id,
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          type: mode,
          uploadedAt: new Date().toISOString(),
          data: data as unknown as Record<string, unknown>,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al escanear")
    } finally {
      setScanning(false)
    }
  }

  function handleClear() {
    setFile(null)
    setPreview(null)
    setScanned(false)
    setError(null)
    onClear?.()
  }

  const isPDF = file?.type === "application/pdf"

  return (
    <div className={cn("space-y-3", className)}>
      {!preview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors hover:border-muted-foreground/50"
        >
          {mode === "invoice" ? (
            <FileText className="h-8 w-8 text-muted-foreground" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">
              {mode === "invoice" ? "Sube la factura PDF" : "Sube el screenshot del pago"}
            </p>
            <p className="text-xs text-muted-foreground">
              {mode === "invoice" ? "PDF de la factura para extraer cuotas" : "PNG, JPG del pago en Nequi o Daviplata"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="xs"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
            >
              <Upload className="h-3 w-3" />
              Subir
            </Button>
            {mode === "receipt" && (
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={(e) => { e.stopPropagation() }}
              >
                <Camera className="h-3 w-3" />
                Cámara
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={mode === "invoice" ? "application/pdf,image/*" : "image/*"}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg border bg-muted/30 p-2">
            {isPDF ? (
              <div className="flex items-center gap-3 p-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">PDF — {(file?.size ?? 0 / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            ) : (
              <img src={preview} alt="Preview" className="max-h-40 rounded object-contain mx-auto" />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleClear}
              className="absolute right-1 top-1 rounded-full bg-background shadow-sm"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {!scanned && (
            <Button
              type="button"
              onClick={handleScan}
              disabled={scanning}
              className="w-full"
            >
              {scanning ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Analizando con LiteRT.js...</>
              ) : (
                <><ScanLine className="h-4 w-4" /> Escanear</>
              )}
            </Button>
          )}

          {scanned && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <Check className="h-4 w-4" />
              <span className="font-medium">Escaneado correctamente</span>
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={handleClear}
                className="ml-auto"
              >
                Cambiar archivo
              </Button>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {quotaExceeded && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              <CloudOff className="h-4 w-4 shrink-0" />
              <span>Cuota de OCR en la nube agotada. Usando OCR local (Tesseract.js) — menor precisión.</span>
            </div>
          )}

          {!quotaExceeded && remaining < 50 && (
            <p className="text-xs text-amber-600 text-center">
              OCR en la nube: {remaining} de 1000 usos este mes
            </p>
          )}
        </div>
      )}
    </div>
  )
}
