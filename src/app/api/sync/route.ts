import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    await prisma.$queryRawUnsafe(`CREATE TABLE IF NOT EXISTS app_sync (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW())`)
    const rows = await prisma.$queryRawUnsafe<Array<{ data: unknown }>>(`SELECT data FROM app_sync WHERE id = $1 LIMIT 1`, `user_${session.user.id}`)
    const data = rows.length > 0 ? rows[0].data : {}
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({})
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const data = await req.json()
    await prisma.$queryRawUnsafe(`CREATE TABLE IF NOT EXISTS app_sync (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW())`)
    await prisma.$queryRawUnsafe(
      `INSERT INTO app_sync (id, data, updated_at) VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET data = $2::jsonb, updated_at = NOW()`,
      `user_${session.user.id}`,
      JSON.stringify(data)
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
