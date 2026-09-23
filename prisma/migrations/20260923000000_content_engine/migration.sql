-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('REVIEW', 'GUIDE', 'LISTICLE');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ContentType" NOT NULL DEFAULT 'REVIEW',
    "brief" TEXT,
    "aiJson" JSONB,
    "finalContent" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentProduct" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");

-- CreateIndex
CREATE INDEX "Content_slug_idx" ON "Content"("slug");

-- CreateIndex
CREATE INDEX "Content_status_idx" ON "Content"("status");

-- CreateIndex
CREATE INDEX "Content_type_idx" ON "Content"("type");

-- CreateIndex
CREATE INDEX "ContentProduct_contentId_idx" ON "ContentProduct"("contentId");

-- CreateIndex
CREATE INDEX "ContentProduct_dealId_idx" ON "ContentProduct"("dealId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentProduct_contentId_dealId_key" ON "ContentProduct"("contentId", "dealId");

-- AddForeignKey
ALTER TABLE "ContentProduct" ADD CONSTRAINT "ContentProduct_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentProduct" ADD CONSTRAINT "ContentProduct_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

