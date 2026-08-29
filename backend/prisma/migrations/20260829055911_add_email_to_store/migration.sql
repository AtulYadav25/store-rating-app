/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_ownerId_fkey";

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ALTER COLUMN "ownerId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Rating_storeId_createdAt_idx" ON "Rating"("storeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Store_email_key" ON "Store"("email");

-- CreateIndex
CREATE INDEX "Store_name_idx" ON "Store"("name");

-- CreateIndex
CREATE INDEX "Store_email_idx" ON "Store"("email");

-- CreateIndex
CREATE INDEX "Store_address_idx" ON "Store"("address");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
