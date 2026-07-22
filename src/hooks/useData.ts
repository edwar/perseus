import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

// ─── Generic fetch helpers ────────────────────────────────────────

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ─── Transaction hooks ────────────────────────────────────────────

export interface Transaction {
  id: string
  description: string
  amount: number
  type: "EXPENSE" | "INCOME"
  category: string
  date: string
  recurring?: boolean
  frequency?: string
  nextDate?: string
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiFetch<Transaction[]>("/api/transactions"),
    staleTime: 30_000,
  })
}

export function useTransactionMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["transactions"] }), [qc])

  const add = useMutation({
    mutationFn: (tx: Omit<Transaction, "id">) =>
      apiFetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), ...tx }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (tx: Transaction) =>
      apiFetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/transactions?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { add, update, remove }
}

// ─── Budget hooks ─────────────────────────────────────────────────

export interface Budget {
  id: string
  category: string
  amount: number
  color: string
  items?: Array<{ name: string; amount: number }>
}

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => apiFetch<Budget[]>("/api/budgets"),
    staleTime: 30_000,
  })
}

export function useBudgetMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["budgets"] }), [qc])

  const add = useMutation({
    mutationFn: (b: Omit<Budget, "id">) =>
      apiFetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), ...b }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (b: Budget) =>
      apiFetch("/api/budgets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/budgets?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { add, update, remove }
}

// ─── Debt hooks ───────────────────────────────────────────────────

export interface Debt {
  id: string
  name: string
  creditor: string
  category: string
  total: number
  remaining: number
  rate: number
  monthly: number
  minimum: number | null
  installments: number | null
  paid: number
}

export function useDebts() {
  return useQuery({
    queryKey: ["debts"],
    queryFn: () => apiFetch<Debt[]>("/api/debts"),
    staleTime: 30_000,
  })
}

export function useDebtMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["debts"] }), [qc])

  const add = useMutation({
    mutationFn: (d: Omit<Debt, "id">) =>
      apiFetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), ...d }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (d: Debt) =>
      apiFetch("/api/debts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/debts?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { add, update, remove }
}

// ─── Recurring hooks ──────────────────────────────────────────────

export interface RecurringItem {
  id: string
  name: string
  amount: number
  type: "INCOME" | "EXPENSE"
  frequency: string
  dayOfMonth: number
  category: string
  debtId?: string
}

export function useRecurring() {
  return useQuery({
    queryKey: ["recurring"],
    queryFn: () => apiFetch<RecurringItem[]>("/api/recurring"),
    staleTime: 30_000,
  })
}

export function useRecurringMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["recurring"] }), [qc])

  const add = useMutation({
    mutationFn: (d: Omit<RecurringItem, "id">) =>
      apiFetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), ...d }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (d: RecurringItem) =>
      apiFetch("/api/recurring", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/recurring?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { add, update, remove }
}

// ─── Savings hooks ────────────────────────────────────────────────

export interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

export interface Investment {
  id: string
  entity: string
  amount: number
  rate: number
  termDays: number
  startDate: string
  endDate: string
}

export interface SavingsData {
  goals: Goal[]
  investments: Investment[]
}

export function useSavings() {
  return useQuery({
    queryKey: ["savings"],
    queryFn: () => apiFetch<SavingsData>("/api/savings"),
    staleTime: 30_000,
  })
}

export function useSavingsMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["savings"] }), [qc])

  const addGoal = useMutation({
    mutationFn: (g: Omit<Goal, "id">) =>
      apiFetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "goal", id: crypto.randomUUID(), ...g }),
      }),
    onSuccess: invalidate,
  })

  const updateGoal = useMutation({
    mutationFn: (g: Goal) =>
      apiFetch("/api/savings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "goal", ...g }),
      }),
    onSuccess: invalidate,
  })

  const deleteGoal = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/savings?id=${id}&type=goal`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  const addInvestment = useMutation({
    mutationFn: (i: Omit<Investment, "id">) =>
      apiFetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "investment", id: crypto.randomUUID(), ...i }),
      }),
    onSuccess: invalidate,
  })

  const updateInvestment = useMutation({
    mutationFn: (i: Investment) =>
      apiFetch("/api/savings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "investment", ...i }),
      }),
    onSuccess: invalidate,
  })

  const deleteInvestment = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/savings?id=${id}&type=investment`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  return { addGoal, updateGoal, deleteGoal, addInvestment, updateInvestment, deleteInvestment }
}

// ─── Obligations hooks ────────────────────────────────────────────

export interface Obligation {
  id: string
  name: string
}

export interface MonthlyCheck {
  month: string
  paid: string[]
}

export interface ObligationsData {
  obligations: Obligation[]
  checks: MonthlyCheck[]
}

export function useObligations() {
  return useQuery({
    queryKey: ["obligations"],
    queryFn: () => apiFetch<ObligationsData>("/api/obligations"),
    staleTime: 30_000,
  })
}

export function useObligationsMutations() {
  const qc = useQueryClient()
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: ["obligations"] }), [qc])

  const add = useMutation({
    mutationFn: (o: Omit<Obligation, "id">) =>
      apiFetch("/api/obligations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "obligation", id: crypto.randomUUID(), ...o }),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (o: Obligation) =>
      apiFetch("/api/obligations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(o),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/obligations?id=${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })

  const togglePaid = useMutation({
    mutationFn: (params: { obligationId: string; month: string }) =>
      apiFetch("/api/obligations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "toggle", ...params }),
      }),
    onSuccess: invalidate,
  })

  return { add, update, remove, togglePaid }
}