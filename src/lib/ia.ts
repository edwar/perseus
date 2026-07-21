import Tesseract from "tesseract.js"
import { useOcrStore, OCR_MONTHLY_LIMIT, currentMonth } from "@/store/ocr-store"

let parseNoKey = false
let parseQuotaExceeded = false

async function parseWithAI<T>(text: string, type: "receipt" | "invoice"): Promise<T | null> {
  if (parseNoKey || parseQuotaExceeded) return null

  try {
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, type }),
    })

    if (res.status === 503) {
      parseNoKey = true
      console.warn("GROQ_API_KEY no configurada. Para extraer datos automáticamente, consigue una key gratis en https://console.groq.com/keys")
      return null
    }
    if (res.status === 429) {
      parseQuotaExceeded = true
      return null
    }
    if (!res.ok) return null

    return await res.json()
  } catch {
    return null
  }
}

export interface ReceiptData {
  merchant: string | null
  amount: number | null
  date: string | null
  currency: string | null
}

export interface DebtInvoiceData {
  totalCuotas: number | null
  cuotasPagadas: number | null
  pagoMinimo: number | null
  montoTotal: number | null
  fechaVencimiento: string | null
  acreedor: string | null
  tasaInteres: number | null
  saldoActual: number | null
}

async function cloudVisionOCR(imageBase64: string): Promise<string | null> {
  const res = await fetch("/api/ocr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  })

  if (res.status === 429) {
    useOcrStore.getState().setQuotaExceeded(true)
    return null
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (err?.error?.includes("no configurada")) {
      useOcrStore.getState().setNoKey(true)
    }
    return null
  }

  const data = await res.json()
  if (!data.text) return null

  useOcrStore.getState().increment()
  return data.text
}

async function pdfToImage(file: File): Promise<File> {
  const pdfjs = await import("pdfjs-dist")
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buffer }).promise
  const page = await pdf.getPage(1)

  const viewport = page.getViewport({ scale: 2 })
  const canvas = document.createElement("canvas")
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  await page.render({ canvas: canvas, canvasContext: ctx, viewport }).promise

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Canvas toBlob failed")), "image/png")
  })
  return new File([blob], file.name.replace(/\.pdf$/i, ".png"), { type: "image/png" })
}

async function tesseractOCR(file: File): Promise<string> {
  const { data } = await Tesseract.recognize(file, "spa", {
    logger: (m) => {
      if (m.status === "recognizing text") {
        console.log(`OCR: ${Math.round(m.progress * 100)}%`)
      }
    },
  })
  return data.text
}

async function ocrImage(file: File): Promise<string> {
  const store = useOcrStore.getState()
  const remaining = store.month !== currentMonth() ? OCR_MONTHLY_LIMIT : OCR_MONTHLY_LIMIT - store.used

  const inputFile = file.type === "application/pdf" ? await pdfToImage(file) : file

  if (!store.quotaExceeded && remaining > 0 && !store.noKey) {
    const reader = new FileReader()
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(",")[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(inputFile)
    })

    const visionResult = await cloudVisionOCR(base64)
    if (visionResult) return visionResult
  }

  return tesseractOCR(inputFile)
}

export async function analyzeReceiptImage(file: File): Promise<ReceiptData> {
  const text = await ocrImage(file)
  const ai = await parseWithAI<ReceiptData>(text, "receipt")
  if (ai) return ai

  return { merchant: null, amount: null, date: null, currency: null }
}

export async function analyzeDebtInvoice(file: File): Promise<DebtInvoiceData> {
  const text = await ocrImage(file)
  const ai = await parseWithAI<DebtInvoiceData>(text, "invoice")
  if (ai) return ai

  return {
    totalCuotas: null,
    cuotasPagadas: null,
    pagoMinimo: null,
    montoTotal: null,
    fechaVencimiento: null,
    acreedor: null,
    tasaInteres: null,
    saldoActual: null,
  }
}
