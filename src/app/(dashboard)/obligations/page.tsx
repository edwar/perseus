"use client"

import { useState } from "react"
import { TodayBoard } from "@/components/features/obligations-v2/today-board"
import { TemplateManager } from "@/components/features/obligations-v2/template-manager"

export default function ObligationsPage() {
  const [showSettings, setShowSettings] = useState(false)

  if (showSettings) {
    return (
      <div className="mt-10 md:mt-0">
        <TemplateManager onClose={() => setShowSettings(false)} />
      </div>
    )
  }

  return (
    <div className="mt-10 md:mt-0">
      <TodayBoard onOpenSettings={() => setShowSettings(true)} />
    </div>
  )
}
