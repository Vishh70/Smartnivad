"use server";

import { requireAdmin } from "@/lib/auth";
import { runProductDiscovery } from "@/lib/affiliate/discovery";
import { runPriceMonitoring } from "@/lib/affiliate/price-monitor";
import { getProvider } from "@/lib/affiliate/registry";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function triggerDiscoveryAction(formData: FormData) {
  await requireAdmin();

  const keywordText =
    (formData.get("keywords") as string) || "laptops, smartphones";
  const providerId =
    (formData.get("provider") as "AMAZON" | "FLIPKART") || "AMAZON";
  const batchSize = parseInt((formData.get("batchSize") as string) || "10", 10);
  const dryRun = formData.get("dryRun") === "true";
  const autoPublish = formData.get("autoPublish") === "true";

  const keywords = keywordText
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const result = await runProductDiscovery({
    keywords,
    providerId,
    batchSize,
    dryRun,
    autoPublish,
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/automation",
  );
  return result;
}

export async function triggerPriceRefreshAction() {
  await requireAdmin();
  const result = await runPriceMonitoring(20);

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/automation",
  );
  return result;
}

export async function triggerManualImportAction(formData: FormData) {
  await requireAdmin();

  const urlOrAsin = formData.get("urlOrAsin") as string;
  const storeName = (formData.get("store") as string) || "Amazon";
  const customTitle = formData.get("title") as string;
  const customPrice = parseFloat(formData.get("price") as string);
  const customOrigPrice = parseFloat(formData.get("originalPrice") as string);
  const customImage = formData.get("imageUrl") as string;

  if (!urlOrAsin) {
    throw new Error("URL or ASIN is required");
  }

  const provider = getProvider(storeName);
  let discoveredProduct = provider
    ? await provider.getProductDetails(urlOrAsin)
    : null;

  if (!discoveredProduct && customTitle && customPrice > 0) {
    // Admin manual verified data import
    const externalId =
      provider?.extractExternalId(urlOrAsin) || urlOrAsin.slice(0, 15);
    const affiliateUrl = provider
      ? provider.buildAffiliateUrl(urlOrAsin)
      : urlOrAsin;
    const orig = customOrigPrice >= customPrice ? customOrigPrice : customPrice;
    const discount =
      orig > customPrice ? Math.round(((orig - customPrice) / orig) * 100) : 0;

    discoveredProduct = {
      externalId,
      provider: storeName.toUpperCase().includes("AMAZON")
        ? "AMAZON"
        : "FLIPKART",
      title: customTitle,
      currentPrice: customPrice,
      originalPrice: orig,
      discount,
      affiliateUrl,
      canonicalUrl: affiliateUrl,
      imageUrl:
        customImage ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      rating: 4.5,
      inStock: true,
      isVerified: true,
    };
  }

  if (!discoveredProduct) {
    throw new Error(
      "Could not automatically fetch product details. Please provide Title and Price for manual verified import.",
    );
  }

  const result = await runProductDiscovery({
    importedProducts: [discoveredProduct],
    providerId:
      discoveredProduct.provider === "FLIPKART" ? "FLIPKART" : "AMAZON",
    dryRun: false,
    autoPublish: true,
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/automation",
  );
  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );

  return result;
}

export async function approveReviewDealAction(dealId: string) {
  await requireAdmin();
  await prisma.deal.update({
    where: { id: dealId },
    data: {
      reviewQueue: false,
      reviewReason: null,
      status: "PUBLISHED",
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/automation",
  );
  return { success: true };
}

export async function rejectReviewDealAction(dealId: string) {
  await requireAdmin();
  await prisma.deal.delete({
    where: { id: dealId },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/automation",
  );
  return { success: true };
}

export async function triggerOneLinkImportAction(formData: FormData) {
  await requireAdmin();

  const url = ((formData.get("url") as string) || "").trim();
  const dryRun = formData.get("dryRun") === "true";
  const autoPublish = formData.get("autoPublish") !== "false";

  if (!url) {
    throw new Error("Please enter an Amazon affiliate or product URL.");
  }

  const { processSingleAmazonLinkImport } =
    await import("@/lib/affiliate/import-service");
  const result = await processSingleAmazonLinkImport(url, {
    dryRun,
    autoPublish,
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/automation",
  );
  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );
  revalidatePath("/deals");
  revalidatePath("/");

  return result;
}

export async function triggerAmazonLinkImportAction(formData: FormData) {
  await requireAdmin();

  const urlText = (formData.get("urls") as string) || "";
  const dryRun = formData.get("dryRun") === "true";
  const autoPublish = formData.get("autoPublish") === "true";

  const urls = urlText
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  if (urls.length === 0) {
    throw new Error("Please provide at least one Amazon URL to import.");
  }

  const { processAmazonLinkImports } =
    await import("@/lib/affiliate/import-service");
  const result = await processAmazonLinkImports(urls, {
    dryRun,
    autoPublish,
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/automation",
  );
  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
  );

  return result;
}

export async function retryImportQueueItemAction(queueItemId: string) {
  await requireAdmin();

  const item = await prisma.importQueueItem.findUnique({
    where: { id: queueItemId },
  });

  if (!item) {
    throw new Error("Import queue item not found.");
  }

  const { processAmazonLinkImports } =
    await import("@/lib/affiliate/import-service");
  const result = await processAmazonLinkImports([item.sourceUrl], {
    dryRun: false,
    autoPublish: false,
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/automation",
  );

  return result;
}
