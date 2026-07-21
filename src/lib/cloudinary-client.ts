export async function uploadToCloudinary(file: File, type: "receipt" | "invoice"): Promise<{ secure_url: string; public_id: string } | null> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("type", type)

  try {
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Error de conexión" }))
      console.warn("Cloudinary upload failed:", err.error)
      return null
    }
    return await res.json()
  } catch {
    console.warn("Cloudinary upload error")
    return null
  }
}
