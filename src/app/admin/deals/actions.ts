"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDeal(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const description = formData.get("description") as string;
  const currentPrice = parseFloat(formData.get("currentPrice") as string);
  const originalPrice = parseFloat(formData.get("originalPrice") as string);
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100) || 0;
  const affiliateUrl = formData.get("affiliateUrl") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const storeId = formData.get("storeId") as string;
  const dealType = formData.get("dealType") as "LIVE" | "HOT";

  const aiSummary = formData.get("aiSummary") as string;
  const prosText = formData.get("pros") as string;
  const consText = formData.get("cons") as string;
  const tagsText = formData.get("tags") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;

  const pros = prosText ? prosText.split("\n").map(s => s.trim()).filter(Boolean).join("||") : null;
  const cons = consText ? consText.split("\n").map(s => s.trim()).filter(Boolean).join("||") : null;
  const tags = tagsText ? tagsText.split(",").map(s => s.trim()).filter(Boolean) : [];

  await prisma.deal.create({
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

  revalidatePath("/admin/deals");
  revalidatePath("/");
  redirect("/admin/deals");
}

export async function updateDeal(formData: FormData) {
  const dealId = formData.get("dealId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const currentPrice = parseFloat(formData.get("currentPrice") as string);
  const originalPrice = parseFloat(formData.get("originalPrice") as string);
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100) || 0;
  const affiliateUrl = formData.get("affiliateUrl") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const storeId = formData.get("storeId") as string;
  const dealType = formData.get("dealType") as "LIVE" | "HOT";

  const aiSummary = formData.get("aiSummary") as string;
  const prosText = formData.get("pros") as string;
  const consText = formData.get("cons") as string;
  const tagsText = formData.get("tags") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;

  const pros = prosText ? prosText.split("\n").map(s => s.trim()).filter(Boolean).join("||") : null;
  const cons = consText ? consText.split("\n").map(s => s.trim()).filter(Boolean).join("||") : null;
  const tags = tagsText ? tagsText.split(",").map(s => s.trim()).filter(Boolean) : [];

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

  revalidatePath("/admin/deals");
  revalidatePath("/");
  redirect("/admin/deals");
}

export async function deleteDeal(formData: FormData) {
  const dealId = formData.get("dealId") as string;
  await prisma.deal.delete({ where: { id: dealId } });
  revalidatePath("/admin/deals");
  revalidatePath("/");
}
