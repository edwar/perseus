import { useState, useCallback } from "react"

interface ScanResult {
  merchant: string
  amount: string
  date: string
  rawText: string
}

export function useScanner() {
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setImage(null)
    setResult(null)
    setError(null)
  }, [])

  const scan = useCallback(async (imageData: string) => {
    setScanning(true)
    setError(null)
    try {
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      })
      if (!res.ok) throw new Error("Error al escanear")
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setScanning(false)
    }
  }, [])

  return { image, setImage, scanning, result, error, reset, scan }
}
