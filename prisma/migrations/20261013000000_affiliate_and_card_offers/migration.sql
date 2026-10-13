-- CreateEnum
CREATE TYPE "BankOfferType" AS ENUM ('INSTANT_DISCOUNT', 'COUPON', 'CASHBACK', 'EMI_OFFER');

-- CreateEnum
CREATE TYPE "DiscountValueType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('CREDIT', 'DEBIT', 'ALL');

-- CreateEnum
CREATE TYPE "OfferVerificationStatus" AS ENUM ('VERIFIED', 'UNVERIFIED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN "externalId" TEXT,
ADD COLUMN "provider" TEXT DEFAULT 'MANUAL',
ADD COLUMN "lastCheckedAt" TIMESTAMP(3),
ADD COLUMN "lastSuccessfulCheckAt" TIMESTAMP(3),
ADD COLUMN "consecutiveFailures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "isPriceStale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "inStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "reviewQueue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "reviewReason" TEXT;

-- CreateTable
CREATE TABLE "BankOffer" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL DEFAULT 'CREDIT',
    "offerType" "BankOfferType" NOT NULL DEFAULT 'INSTANT_DISCOUNT',
    "discountType" "DiscountValueType" NOT NULL DEFAULT 'PERCENTAGE',
    "discountValue" DOUBLE PRECISION NOT NULL,
    "maxDiscountCap" DOUBLE PRECISION,
    "minSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "eligibleStores" TEXT[],
    "eligibleCategories" TEXT[],
    "paymentMethods" TEXT[],
    "emiTenureMonths" INTEGER,
    "emiInterestRate" DOUBLE PRECISION,
    "emiProcessingFee" DOUBLE PRECISION,
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "termsUrl" TEXT,
    "termsSummary" TEXT,
    "source" TEXT,
    "verificationStatus" "OfferVerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscoveryRun" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "keyword" TEXT,
    "category" TEXT,
    "isDryRun" BOOLEAN NOT NULL DEFAULT false,
    "foundCount" INTEGER NOT NULL DEFAULT 0,
    "createdCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "rejectedCount" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscoveryRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deal_externalId_idx" ON "Deal"("externalId");

-- CreateIndex
CREATE INDEX "Deal_provider_idx" ON "Deal"("provider");

-- CreateIndex
CREATE INDEX "Deal_lastCheckedAt_idx" ON "Deal"("lastCheckedAt");

-- CreateIndex
CREATE INDEX "Deal_isPriceStale_idx" ON "Deal"("isPriceStale");

-- CreateIndex
CREATE INDEX "Deal_reviewQueue_idx" ON "Deal"("reviewQueue");

-- CreateIndex
CREATE INDEX "BankOffer_bankName_idx" ON "BankOffer"("bankName");

-- CreateIndex
CREATE INDEX "BankOffer_cardName_idx" ON "BankOffer"("cardName");

-- CreateIndex
CREATE INDEX "BankOffer_active_idx" ON "BankOffer"("active");

-- CreateIndex
CREATE INDEX "BankOffer_verificationStatus_idx" ON "BankOffer"("verificationStatus");

-- CreateIndex
CREATE INDEX "BankOffer_endDate_idx" ON "BankOffer"("endDate");

-- CreateIndex
CREATE INDEX "DiscoveryRun_provider_idx" ON "DiscoveryRun"("provider");

-- CreateIndex
CREATE INDEX "DiscoveryRun_createdAt_idx" ON "DiscoveryRun"("createdAt");
