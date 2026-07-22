export async function fetchAll<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error(`[fetch ${url}]`, err)
    return []
  }
}

export async function fetchObject<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url)
    if (!res.ok) return fallback
    return await res.json()
  } catch (err) {
    console.error(`[fetch ${url}]`, err)
    return fallback
  }
}

export async function createItem(url: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) console.error(`[create ${url}] HTTP ${res.status}:`, await res.text().catch(() => ""))
    return res.ok
  } catch (err) {
    console.error(`[create ${url}]`, err)
    return false
  }
}

export async function updateItem(url: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) console.error(`[update ${url}] HTTP ${res.status}:`, await res.text().catch(() => ""))
    return res.ok
  } catch (err) {
    console.error(`[update ${url}]`, err)
    return false
  }
}

export async function deleteItem(url: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}?id=${encodeURIComponent(id)}`, { method: "DELETE" })
    if (!res.ok) console.error(`[delete ${url}] HTTP ${res.status}`)
    return res.ok
  } catch (err) {
    console.error(`[delete ${url}]`, err)
    return false
  }
}