import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ScannedDoc {
  id: string
  publicId: string
  url: string
  type: "receipt" | "invoice"
  uploadedAt: string
  data: Record<string, unknown>
}

interface DocumentStore {
  docs: ScannedDoc[]
  addDoc: (doc: ScannedDoc) => void
  deleteDoc: (id: string) => void
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      docs: [],
      addDoc: (doc) => set((s) => ({ docs: [doc, ...s.docs] })),
      deleteDoc: (id) => set((s) => ({ docs: s.docs.filter((d) => d.id !== id) })),
    }),
    { name: "perseus-documents" }
  )
)
