/*
  Warnings:

  - You are about to drop the column `receiveAmount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiveCurrency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiverAccountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `sendAmount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `sendCurrency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `senderAccountId` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sentTransactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiverAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderAccountId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "receiveAmount",
DROP COLUMN "receiveCurrency",
DROP COLUMN "receiverAccountId",
DROP COLUMN "sendAmount",
DROP COLUMN "sendCurrency",
DROP COLUMN "senderAccountId",
ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sentTransactionId" TEXT,
ALTER COLUMN "entity" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_sentTransactionId_key" ON "Transaction"("sentTransactionId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sentTransactionId_fkey" FOREIGN KEY ("sentTransactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
