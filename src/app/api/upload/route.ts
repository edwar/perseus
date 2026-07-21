import { NextRequest, NextResponse } from "next/server"
import { cloudinary } from "@/lib/cloudinary"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const fileType = formData.get("type") as string | null

    if (!file || !fileType) {
      return NextResponse.json({ error: "Archivo y tipo requeridos" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const filename = `${timestamp}_${sanitizedName}`
    const folder = `perseus/${session.user.id}/${fileType}`

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: filename,
          folder,
          resource_type: "auto",
        },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Upload failed"))
          resolve({ secure_url: result.secure_url, public_id: result.public_id })
        }
      )
      uploadStream.end(buffer)
    })

    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al subir archivo"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
