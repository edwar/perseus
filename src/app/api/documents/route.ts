import { NextRequest, NextResponse } from "next/server"
import { cloudinary } from "@/lib/cloudinary"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const prefix = searchParams.get("prefix") ?? `perseus/${session.user.id}`

    const result = await cloudinary.search
      .expression(`folder:${prefix}/*`)
      .sortBy("created_at", "desc")
      .maxResults(500)
      .execute()

    const resources = result.resources.map((r: { public_id: string; secure_url: string; folder: string; created_at: string }) => ({
      publicId: r.public_id,
      url: r.secure_url,
      folder: r.folder,
      createdAt: r.created_at,
    }))

    return NextResponse.json({ resources })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al listar documentos"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
