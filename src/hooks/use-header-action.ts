import { useEffect } from "react"
import type { ReactNode } from "react"
import { useHeaderStore } from "@/store/header-store"

export function useHeaderAction(action: ReactNode | null) {
  const setHeaderAction = useHeaderStore((s) => s.setAction)
  useEffect(() => {
    setHeaderAction(action)
    return () => setHeaderAction(null)
  }, [action, setHeaderAction])
}
