"use client"

const STORE_KEYS = ["perseus-transactions", "perseus-budgets", "perseus-debts", "perseus-recurring", "perseus-savings"]

export async function syncToCloud() {
  const payload: Record<string, unknown> = {}
  for (const key of STORE_KEYS) {
    try {
      const raw = localStorage.getItem(key)
      if (raw) payload[key] = JSON.parse(raw)
    } catch { /* skip */ }
  }
  try {
    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch { /* silent */ }
}

export async function syncFromCloud() {
  try {
    const res = await fetch("/api/sync")
    if (!res.ok) return
    const data = await res.json()
    for (const key of STORE_KEYS) {
      if (data[key]) {
        localStorage.setItem(key, JSON.stringify(data[key]))
      }
    }
    window.location.reload()
  } catch { /* silent */ }
}

let syncTimer: ReturnType<typeof setTimeout> | null = null
export function debouncedSync() {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(syncToCloud, 2000)
}
