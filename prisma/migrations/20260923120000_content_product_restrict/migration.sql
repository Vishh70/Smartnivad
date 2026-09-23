-- DropForeignKey
ALTER TABLE "ContentProduct" DROP CONSTRAINT "ContentProduct_dealId_fkey";

-- AddForeignKey
ALTER TABLE "ContentProduct" ADD CONSTRAINT "ContentProduct_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropIndex
DROP INDEX "Content_slug_idx";
