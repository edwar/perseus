import { z } from "zod"

export const transactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1).max(255),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  date: z.date().default(() => new Date()),
  currency: z.string().default("COP"),
  exchangeRate: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
  categoryId: z.string().optional(),
  fromAccountId: z.string().optional(),
  toAccountId: z.string().optional(),
  receiptImage: z.string().optional(),
})

export const accountSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["CASH", "DEBIT", "CREDIT", "SAVINGS", "INVESTMENT"]),
  balance: z.number().default(0),
  currency: z.string().default("COP"),
  color: z.string().optional(),
  icon: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).default("EXPENSE"),
})

export const recurringPaymentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  amount: z.number().positive(),
  currency: z.string().default("COP"),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  dayOfMonth: z.number().min(1).max(31).optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  categoryId: z.string().optional(),
  fromAccountId: z.string().optional(),
})

export const debtSchema = z.object({
  name: z.string().min(1).max(100),
  creditor: z.string().min(1).max(100),
  totalAmount: z.number().positive(),
  remainingAmount: z.number().positive(),
  interestRate: z.number().min(0).max(100),
  monthlyPayment: z.number().positive().optional(),
  minimumPayment: z.number().positive().optional(),
  totalInstallments: z.number().int().positive().optional(),
  installmentsPaid: z.number().int().min(0).default(0),
  dueDate: z.date().optional(),
})

export const debtPaymentSchema = z.object({
  debtId: z.string(),
  amount: z.number().positive(),
  isMinimum: z.boolean().default(false),
  installmentNum: z.number().int().positive().optional(),
  date: z.date().default(() => new Date()),
  notes: z.string().max(500).optional(),
  receiptImage: z.string().optional(),
})

export const savingGoalSchema = z.object({
  name: z.string().min(1).max(100),
  targetAmount: z.number().positive(),
  currentAmount: z.number().default(0),
  currency: z.string().default("COP"),
  deadline: z.date().optional(),
  accountId: z.string().optional(),
})

export const investmentSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1),
  amountInvested: z.number().positive(),
  currentValue: z.number().positive(),
  currency: z.string().default("COP"),
  returnRate: z.number().optional(),
  purchaseDate: z.date().default(() => new Date()),
  notes: z.string().max(500).optional(),
  accountId: z.string().optional(),
})

export const budgetSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("COP"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
  categoryId: z.string(),
})
