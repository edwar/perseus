-- AlterTable
ALTER TABLE "debts" ADD COLUMN     "installmentsPaid" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "invoiceData" JSONB,
ADD COLUMN     "invoiceFile" TEXT,
ADD COLUMN     "minimumPayment" DECIMAL(15,2),
ADD COLUMN     "totalInstallments" INTEGER;

-- CreateTable
CREATE TABLE "debt_payments" (
    "id" TEXT NOT NULL,
    "debtId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "isMinimum" BOOLEAN NOT NULL DEFAULT false,
    "installmentNum" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiptImage" TEXT,
    "receiptData" JSONB,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "debt_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "debt_payments_debtId_idx" ON "debt_payments"("debtId");

-- AddForeignKey
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "debts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
