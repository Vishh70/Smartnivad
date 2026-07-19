import { prisma } from "./prisma";
import { PublishStatus, DealType } from "@prisma/client";

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("[getCategories] DB unreachable:", err);
    return [];
  }
}

export async function getStores() {
  try {
    return await prisma.store.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("[getStores] DB unreachable:", err);
    return [];
  }
}

export async function getBrands() {
  try {
    return await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("[getBrands] DB unreachable:", err);
    return [];
  }
}

export async function getDeals(limit = 20, skip = 0) {
  try {
    return await prisma.deal.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        store: true,
        brand: true,
      },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getDeals] DB unreachable:", err);
    return [];
  }
}

export async function getDealBySlug(slug: string) {
  try {
    return await prisma.deal.findUnique({
      where: { slug, status: PublishStatus.PUBLISHED },
      include: {
        category: true,
        store: true,
        brand: true,
      },
    });
  } catch (err) {
    console.error("[getDealBySlug] DB unreachable:", err);
    return null;
  }
}

export async function getFeaturedDeals(limit = 10, skip = 0) {
  try {
    return await prisma.deal.findMany({
      where: { isFeatured: true, status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: { category: true, store: true, brand: true },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getFeaturedDeals] DB unreachable:", err);
    return [];
  }
}

export async function getTrendingDeals(limit = 10, skip = 0) {
  try {
    return await prisma.deal.findMany({
      where: { isTrending: true, status: PublishStatus.PUBLISHED },
      orderBy: { clicks: "desc" },
      include: { category: true, store: true, brand: true },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getTrendingDeals] DB unreachable:", err);
    return [];
  }
}

export async function getHotDeals(limit = 10, skip = 0) {
  try {
    return await prisma.deal.findMany({
      where: { dealType: DealType.HOT, status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: { category: true, store: true, brand: true },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getHotDeals] DB unreachable:", err);
    return [];
  }
}

export async function getLiveDeals(limit = 10, skip = 0) {
  try {
    return await prisma.deal.findMany({
      where: { dealType: DealType.LIVE, status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: { category: true, store: true, brand: true },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getLiveDeals] DB unreachable:", err);
    return [];
  }
}

export async function getDealsByCategory(categoryId: string, limit = 20, skip = 0) {
  try {
    return await prisma.deal.findMany({
      where: { categoryId, status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: { category: true, store: true, brand: true },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getDealsByCategory] DB unreachable:", err);
    return [];
  }
}

export async function getDealsByStore(storeId: string, limit = 20, skip = 0) {
  try {
    return await prisma.deal.findMany({
      where: { storeId, status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: { category: true, store: true, brand: true },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getDealsByStore] DB unreachable:", err);
    return [];
  }
}

export async function getDealsByBrand(brandId: string, limit = 20, skip = 0) {
  try {
    return await prisma.deal.findMany({
      where: { brandId, status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: { category: true, store: true, brand: true },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getDealsByBrand] DB unreachable:", err);
    return [];
  }
}

export async function getProducts(limit = 20, skip = 0) {
  return getDeals(limit, skip);
}

export async function getCoupons(limit = 20, skip = 0) {
  try {
    return await prisma.coupon.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: { store: true, category: true, deal: true },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getCoupons] DB unreachable:", err);
    return [];
  }
}

export async function getQuizPosts(limit = 20, skip = 0) {
  try {
    return await prisma.quizPost.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { quizDate: "desc" },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getQuizPosts] DB unreachable:", err);
    return [];
  }
}

export async function getBlogPosts(limit = 20, skip = 0) {
  try {
    return await prisma.blogPost.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
  } catch (err) {
    console.error("[getBlogPosts] DB unreachable:", err);
    return [];
  }
}

export async function getFlashDeals() {
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return await prisma.deal.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        expiresAt: { gt: now, lt: in24h },
      },
      orderBy: { expiresAt: "asc" },
      include: { category: true, store: true, brand: true },
      take: 8,
    });
  } catch (err) {
    console.error("[getFlashDeals] DB unreachable:", err);
    return [];
  }
}

export async function getCouponsPreview() {
  try {
    return await prisma.coupon.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      include: { store: true, category: true },
      take: 4,
    });
  } catch (err) {
    console.error("[getCouponsPreview] DB unreachable:", err);
    return [];
  }
}

export async function getStoresWithLogos() {
  try {
    return await prisma.store.findMany({
      where: { logoUrl: { not: null } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, logoUrl: true },
    });
  } catch (err) {
    console.error("[getStoresWithLogos] DB unreachable:", err);
    return [];
  }
}
