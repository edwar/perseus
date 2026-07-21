import { NextRequest, NextResponse } from "next/server"

const KEY = process.env.GROQ_API_KEY

const RECEIPT_PROMPT = `Del texto OCR de un comprobante de pago colombiano, extrae estos campos y RESPONDE SOLO CON JSON (sin markdown, sin explicaciones):

{"merchant": "comercio o banco destino, o null", "amount": "monto en número (ej: 15000), o null", "date": "fecha YYYY-MM-DD, o null", "currency": "COP, EUR, GBP, o null"}

$15.000,00 = 15000.`

const INVOICE_PROMPT = `Del texto OCR de una factura de crédito colombiana, extrae estos campos y RESPONDE SOLO CON JSON (sin markdown, sin explicaciones):

{"totalCuotas": "cuotas totales, número o null", "cuotasPagadas": "cuotas pagadas, número o null", "pagoMinimo": "pago mínimo en número, o null", "montoTotal": "total a pagar en número, o null", "fechaVencimiento": "vencimiento YYYY-MM-DD, o null", "acreedor": "banco o entidad, o null", "tasaInteres": "tasa de interés en número (ej: 16.42), o null", "saldoActual": "saldo actual en número, o null"}

REGLAS: $9.956.256,16 = 9956256.16. $641.768,00 = 641768. $9.749.747,77 = 9749747.77. NUNCA multipliques por 100.`

function safeNumber(v: unknown): number | null {
  if (v == null) return null
  const n = Number(v)
  if (isNaN(n)) return null
  if (n > 50_000_000_000) return n / 100
  return n
}

export async function POST(req: NextRequest) {
  try {
    const { text, type } = await req.json()
    const prompt = type === "invoice" ? INVOICE_PROMPT : RECEIPT_PROMPT

    if (!KEY) {
      return NextResponse.json({
        error: "GROQ_API_KEY no configurada. Key gratis en https://console.groq.com/keys (sin tarjeta)",
        fallback: true,
      }, { status: 503 })
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: `${prompt}\n\nTEXTO OCR:\n${text}` }],
        temperature: 0,
        max_tokens: 300,
      }),
    })

    if (res.status === 429) {
      return NextResponse.json({ error: "Cuota de Groq agotada. Espera un minuto o consigue otra key en console.groq.com", fallback: true, quotaExceeded: true }, { status: 429 })
    }

    if (!res.ok) {
      const err = await res.text().catch(() => "unknown")
      return NextResponse.json({ error: `Groq error: ${err}`, fallback: true }, { status: 502 })
    }

    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content ?? ""

    let clean = raw.trim()
    const codeBlock = clean.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlock) clean = codeBlock[1].trim()
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: `No se pudo extraer JSON. El modelo respondió: ${raw.slice(0, 150)}`, fallback: true }, { status: 422 })
    }

    const parsed = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      ...parsed,
      montoTotal: safeNumber(parsed.montoTotal),
      pagoMinimo: safeNumber(parsed.pagoMinimo),
      totalCuotas: parsed.totalCuotas != null ? Number(parsed.totalCuotas) : null,
      cuotasPagadas: parsed.cuotasPagadas != null ? Number(parsed.cuotasPagadas) : null,
      tasaInteres: safeNumber(parsed.tasaInteres),
      saldoActual: safeNumber(parsed.saldoActual),
    })
  } catch {
    return NextResponse.json({ error: "Error al procesar con IA", fallback: true }, { status: 500 })
  }
}
