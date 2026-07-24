import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { classifyTransaction } from "@/lib/classify"

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { description } = body

    if (!description) {
      return NextResponse.json([])
    }

    const suggestions = await classifyTransaction(
      session.user.id,
      description
    )

    return NextResponse.json(suggestions)
  } catch {
    return NextResponse.json([])
  }
}
