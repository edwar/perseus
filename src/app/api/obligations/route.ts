import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

const SQL = `
  CREATE TABLE IF NOT EXISTS app_obligations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS app_obligation_checks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    month TEXT NOT NULL,
    obligation_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, month, obligation_id)
  );
`

export async function GET() {
  try {
    const session = await requireAuth()
    await prisma.$executeRawUnsafe(SQL)
    const obligations = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `SELECT id, name FROM app_obligations WHERE user_id = $1 ORDER BY created_at DESC`,
      session.user.id
    )
    const checks = await prisma.$queryRawUnsafe<Array<{ month: string; obligation_id: string }>>(
      `SELECT month, obligation_id FROM app_obligation_checks WHERE user_id = $1`,
      session.user.id
    )
    const checksGrouped: Array<{ month: string; paid: string[] }> = []
    const map: Record<string, string[]> = {}
    for (const c of checks) {
      if (!map[c.month]) map[c.month] = []
      map[c.month].push(c.obligation_id)
    }
    for (const [month, paid] of Object.entries(map)) {
      checksGrouped.push({ month, paid })
    }
    return NextResponse.json({ obligations, checks: checksGrouped })
  } catch {
    return NextResponse.json({ obligations: [], checks: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { type, id, name, month, obligation_id } = await req.json()
    await prisma.$executeRawUnsafe(SQL)

    if (type === "obligation") {
      await prisma.$executeRawUnsafe(
        `INSERT INTO app_obligations (id, user_id, name) VALUES ($1, $2, $3)`,
        id, session.user.id, name
      )
    } else if (type === "toggle") {
      const existing = await prisma.$queryRawUnsafe<Array<unknown>>(
        `SELECT 1 FROM app_obligation_checks WHERE user_id = $1 AND month = $2 AND obligation_id = $3`,
        session.user.id, month, obligation_id
      )
      if (existing.length > 0) {
        await prisma.$executeRawUnsafe(
          `DELETE FROM app_obligation_checks WHERE user_id = $1 AND month = $2 AND obligation_id = $3`,
          session.user.id, month, obligation_id
        )
      } else {
        await prisma.$executeRawUnsafe(
          `INSERT INTO app_obligation_checks (user_id, month, obligation_id) VALUES ($1, $2, $3)`,
          session.user.id, month, obligation_id
        )
      }
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST obligations]", err)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { id, name } = await req.json()
    await prisma.$executeRawUnsafe(SQL)
    await prisma.$executeRawUnsafe(
      `UPDATE app_obligations SET name = $1 WHERE id = $2 AND user_id = $3`,
      name, id, session.user.id
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    await prisma.$executeRawUnsafe(SQL)
    await prisma.$executeRawUnsafe(`DELETE FROM app_obligation_checks WHERE obligation_id = $1 AND user_id = $2`, id, session.user.id)
    await prisma.$executeRawUnsafe(`DELETE FROM app_obligations WHERE id = $1 AND user_id = $2`, id, session.user.id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}