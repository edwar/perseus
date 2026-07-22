function mapRow(row: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    if (typeof value === "bigint") result[camelKey] = Number(value)
    else if (value && typeof value === "object" && "toString" in value) result[camelKey] = String(value)
    else result[camelKey] = value
  }
  return result
}

export async function fetchAll<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    const rows = Array.isArray(data) ? data : data.items ?? []
    return rows.map(mapRow) as T[]
  } catch (err) {
    console.error(`[fetch ${url}]`, err)
    return []
  }
}

export async function fetchObject<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url)
    if (!res.ok) return {} as T
    return await res.json()
  } catch (err) {
    console.error(`[fetch ${url}]`, err)
    return {} as T
  }
}

export async function createItem(url: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) console.error(`[create ${url}] HTTP ${res.status}`)
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
    if (!res.ok) console.error(`[update ${url}] HTTP ${res.status}`)
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

export function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
    if (value !== undefined) result[snakeKey] = value
  }
  return result
}