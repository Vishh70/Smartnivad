"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  currentPrice: z.number().min(0, "Price must be >= 0"),
  originalPrice: z.number().min(0, "Original price must be >= 0"),
  affiliateUrl: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (val) =>
        val.startsWith("https://") &&
        !val.includes("javascript:") &&
        !val.includes("data:"),
      "Invalid or unsafe affiliate URL",
    ),
  imageUrl: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  storeId: z.string().min(1),
  dealType: z.enum(["LIVE", "HOT"]),
  aiSummary: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
});

export async function createDeal(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const currentPrice = parseFloat(formData.get("currentPrice") as string);
  const originalPrice = parseFloat(formData.get("originalPrice") as string);
  const affiliateUrl = formData.get("affiliateUrl") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const storeId = formData.get("storeId") as string;
  const dealType = formData.get("dealType") as "LIVE" | "HOT";

  const validated = dealSchema.safeParse({
    title,
    description,
    currentPrice,
    originalPrice,
    affiliateUrl,
    imageUrl,
    categoryId,
    storeId,
    dealType,
  });
  if (!validated.success) throw new Error(validated.error.message);

  const slug = title;

  const aiSummary = formData.get("aiSummary") as string;
  const prosText = formData.get("pros") as string;
  const consText = formData.get("cons") as string;
  const tagsText = formData.get("tags") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;

  const pros = prosText
    ? prosText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .join("||")
    : null;
  const cons = consText
    ? consText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .join("||")
    : null;
  const tags = tagsText
    ? tagsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const discount =
    Math.round(((originalPrice - currentPrice) / originalPrice) * 100) || 0;

  const deal = await prisma.deal.create({
    data: {
      title,
      slug,
      description,
      currentPrice,
      originalPrice,
      discount,
      affiliateUrl,
      imageUrl,
      categoryId,
      storeId,
      dealType,
      aiSummary,
      pros: pros as string | null,
      cons: cons as string | null,
      seoTitle,
      seoDesc,
      tags,
      status: "PUBLISHED",
      isFeatured: formData.get("isFeatured") === "on",
    },
  });

  if (process.env.SOCIAL_POSTING_ENABLED === "true") {
    const { enqueuePost } = await import("@/lib/social/queue");
    await enqueuePost(deal.id, "TELEGRAM");
  }

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
  revalidatePath("/");
  redirect(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
}

export async function updateDeal(formData: FormData) {
  await requireAdmin();
  const dealId = formData.get("dealId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const currentPrice = parseFloat(formData.get("currentPrice") as string);
  const originalPrice = parseFloat(formData.get("originalPrice") as string);
  const affiliateUrl = formData.get("affiliateUrl") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const storeId = formData.get("storeId") as string;
  const dealType = formData.get("dealType") as "LIVE" | "HOT";

  const validated = dealSchema.safeParse({
    title,
    description,
    currentPrice,
    originalPrice,
    affiliateUrl,
    imageUrl,
    categoryId,
    storeId,
    dealType,
  });
  if (!validated.success) throw new Error(validated.error.message);

  const aiSummary = formData.get("aiSummary") as string;
  const prosText = formData.get("pros") as string;
  const consText = formData.get("cons") as string;
  const tagsText = formData.get("tags") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;

  const pros = prosText
    ? prosText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .join("||")
    : null;
  const cons = consText
    ? consText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .join("||")
    : null;
  const tags = tagsText
    ? tagsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const discount =
    Math.round(((originalPrice - currentPrice) / originalPrice) * 100) || 0;

  await prisma.deal.update({
    where: { id: dealId },
    data: {
      title,
      description,
      currentPrice,
      originalPrice,
      discount,
      affiliateUrl,
      ...(imageUrl ? { imageUrl } : {}),
      categoryId,
      storeId,
      dealType,
      aiSummary,
      pros: pros as string | null,
      cons: cons as string | null,
      seoTitle,
      seoDesc,
      tags,
      isFeatured: formData.get("isFeatured") === "on",
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
  revalidatePath("/");
  redirect(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
}

export async function deleteDeal(formData: FormData) {
  await requireAdmin();
  const dealId = formData.get("dealId") as string;
  await prisma.deal.delete({ where: { id: dealId } });
  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
  revalidatePath("/");
}

export async function toggleDealStatus(formData: FormData) {
  await requireAdmin();
  const dealId = formData.get("dealId") as string;
  const currentStatus = formData.get("currentStatus") as string;
  const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  await prisma.deal.update({
    where: { id: dealId },
    data: { status: newStatus },
  });
  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
  revalidatePath("/");
}

export async function bulkDeleteDeals(dealIds: string[]) {
  await requireAdmin();
  await prisma.deal.deleteMany({
    where: { id: { in: dealIds } },
  });
  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
  revalidatePath("/");
}

export async function bulkUpdateDealStatus(
  dealIds: string[],
  status: "PUBLISHED" | "DRAFT",
) {
  await requireAdmin();
  await prisma.deal.updateMany({
    where: { id: { in: dealIds } },
    data: { status },
  });
  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
  revalidatePath("/");
}
