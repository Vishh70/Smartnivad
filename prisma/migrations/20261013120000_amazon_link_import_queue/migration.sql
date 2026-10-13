-- AlterTable
ALTER TABLE "Deal" ADD COLUMN "sourceUrl" TEXT;

-- CreateTable
CREATE TABLE "ImportQueueItem" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "resolvedUrl" TEXT,
    "asin" TEXT,
    "marketplace" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'AMAZON',
    "trackingTag" TEXT,
    "isTrackingVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL,
    "pendingReason" TEXT,
    "title" TEXT,
    "imageUrl" TEXT,
    "currentPrice" DOUBLE PRECISION,
    "originalPrice" DOUBLE PRECISION,
    "discount" INTEGER,
    "dealId" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportQueueItem_asin_idx" ON "ImportQueueItem"("asin");

-- CreateIndex
CREATE INDEX "ImportQueueItem_status_idx" ON "ImportQueueItem"("status");

-- CreateIndex
CREATE INDEX "ImportQueueItem_sourceUrl_idx" ON "ImportQueueItem"("sourceUrl");

-- CreateIndex
CREATE INDEX "ImportQueueItem_createdAt_idx" ON "ImportQueueItem"("createdAt");

-- AddForeignKey
ALTER TABLE "ImportQueueItem" ADD CONSTRAINT "ImportQueueItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
