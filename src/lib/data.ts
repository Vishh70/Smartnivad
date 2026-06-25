import { prisma } from "./prisma";
import { PublishStatus, DealType } from "@prisma/client";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getStores() {
  return prisma.store.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getDeals() {
  return prisma.deal.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      store: true,
      brand: true,
    },
  });
}

export async function getDealBySlug(slug: string) {
  return prisma.deal.findUnique({
    where: { slug, status: PublishStatus.PUBLISHED },
    include: {
      category: true,
      store: true,
      brand: true,
    },
  });
}

export async function getFeaturedDeals() {
  return prisma.deal.findMany({
    where: { isFeatured: true, status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { category: true, store: true, brand: true },
  });
}

export async function getTrendingDeals() {
  return prisma.deal.findMany({
    where: { isTrending: true, status: PublishStatus.PUBLISHED },
    orderBy: { clicks: "desc" },
    include: { category: true, store: true, brand: true },
  });
}

export async function getHotDeals() {
  return prisma.deal.findMany({
    where: { dealType: DealType.HOT, status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { category: true, store: true, brand: true },
  });
}

export async function getLiveDeals() {
  return prisma.deal.findMany({
    where: { dealType: DealType.LIVE, status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { category: true, store: true, brand: true },
  });
}

export async function getDealsByCategory(categoryId: string) {
  return prisma.deal.findMany({
    where: { categoryId, status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { category: true, store: true, brand: true },
  });
}

export async function getDealsByStore(storeId: string) {
  return prisma.deal.findMany({
    where: { storeId, status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { category: true, store: true, brand: true },
  });
}

export async function getDealsByBrand(brandId: string) {
  return prisma.deal.findMany({
    where: { brandId, status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { category: true, store: true, brand: true },
  });
}

export async function getProducts() {
  return getDeals();
}

export async function getCoupons() {
  return prisma.coupon.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { store: true, category: true, deal: true },
  });
}

export async function getQuizPosts() {
  return prisma.quizPost.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { quizDate: "desc" },
  });
}

export async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFlashDeals() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return prisma.deal.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      expiresAt: { gt: now, lt: in24h },
    },
    orderBy: { expiresAt: "asc" },
    include: { category: true, store: true, brand: true },
    take: 8,
  });
}

export async function getCouponsPreview() {
  return prisma.coupon.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    include: { store: true, category: true },
    take: 4,
  });
}

export async function getStoresWithLogos() {
  return prisma.store.findMany({
    where: { logoUrl: { not: null } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, logoUrl: true },
  });
}

