import { NextRequest, NextResponse } from "next/server"

const VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY

export async function POST(req: NextRequest) {
  if (!VISION_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_VISION_API_KEY no configurada", fallback: true },
      { status: 503 }
    )
  }

  try {
    const { image } = await req.json()

    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: image },
              features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
            },
          ],
        }),
      }
    )

    if (res.status === 429 || res.status === 403) {
      const body = await res.json()
      if (
        body?.error?.message?.includes("quota") ||
        body?.error?.message?.includes("billing") ||
        body?.error?.status === "RESOURCE_EXHAUSTED"
      ) {
        return NextResponse.json({ error: "Cuota gratuita agotada", fallback: true, quotaExceeded: true }, { status: 429 })
      }
    }

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err, fallback: true }, { status: 502 })
    }

    const data = await res.json()
    const text = data?.responses?.[0]?.textAnnotations?.[0]?.description ?? ""

    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ error: "Error al procesar la imagen", fallback: true }, { status: 500 })
  }
}
