const API = "/api/data"

export async function fetchHydrate<T>(key: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(API)
    if (!res.ok) return fallback
    const json = await res.json()
    return (json[key] as T) ?? fallback
  } catch (err) {
    console.error(`[hydrate ${key}]`, err)
    return fallback
  }
}

export async function persistData(key: string, data: unknown): Promise<void> {
  try {
    const res = await fetch(API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "unknown")
      console.error(`[persist ${key}] HTTP ${res.status}:`, text)
    }
  } catch (err) {
    console.error(`[persist ${key}]`, err)
  }
}