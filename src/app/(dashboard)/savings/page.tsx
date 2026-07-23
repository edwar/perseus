"use client"

import { useState } from "react"
import { Plus, Target, Landmark } from "lucide-react"
import { Tabs } from "@/components/ui/tabs"
import { SavingsContent } from "@/components/features/savings/savings-content"

export default function SavingsPage() {
  return (
    <div className="space-y-6 mt-10 md:mt-0">
      <Tabs tabs={[{ id: "goals", label: "Metas de Ahorro", icon: <Target className="h-4 w-4" /> }, { id: "invest", label: "Inversiones", icon: <Landmark className="h-4 w-4" /> }]}>
        <SavingsContent />
      </Tabs>
    </div>
  )
}
