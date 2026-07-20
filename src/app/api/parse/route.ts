import { NextRequest, NextResponse } from "next/server"

const KEY = process.env.GROQ_API_KEY

const RECEIPT_PROMPT = `Del texto OCR de un comprobante de pago colombiano, extrae estos campos y RESPONDE SOLO CON JSON (sin markdown, sin explicaciones):

{"merchant": "comercio o banco destino, o null", "amount": "monto en número (ej: 15000), o null", "date": "fecha YYYY-MM-DD, o null", "currency": "COP, EUR, GBP, o null"}

$15.000,00 = 15000.`

const INVOICE_PROMPT = `Del texto OCR de una factura de crédito colombiana, extrae estos campos y RESPONDE SOLO CON JSON (sin markdown, sin explicaciones):

{"totalInstallments": "cuotas totales, número o null", "installmentsPaid": "cuotas pagadas, número o null", "minimumPayment": "pago mínimo en número, o null", "amount": "total a pagar en número, o null", "dueDate": "vencimiento YYYY-MM-DD, o null", "creditor": "banco o entidad, o null", "interestRate": "tasa de interés en número (ej: 16.42), o null", "currentBalance": "saldo actual en número, o null"}

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
      amount: safeNumber(parsed.amount),
      minimumPayment: safeNumber(parsed.minimumPayment),
      totalInstallments: parsed.totalInstallments != null ? Number(parsed.totalInstallments) : null,
      installmentsPaid: parsed.installmentsPaid != null ? Number(parsed.installmentsPaid) : null,
      interestRate: safeNumber(parsed.interestRate),
      currentBalance: safeNumber(parsed.currentBalance),
    })
  } catch {
    return NextResponse.json({ error: "Error al procesar con IA", fallback: true }, { status: 500 })
  }
}
