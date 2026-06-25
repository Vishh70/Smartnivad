import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Fetch dynamic content
  const [deals, categories, stores, brands, posts] = await Promise.all([
    prisma.deal.findMany({ select: { slug: true, updatedAt: true }, where: { status: "PUBLISHED" } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.store.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.brand.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ select: { slug: true, updatedAt: true }, where: { status: "PUBLISHED" } }),
  ]);

  const dealUrls = deals.map((deal) => ({
    url: `${baseUrl}/product/${deal.slug}`,
    lastModified: deal.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const storeUrls = stores.map((store) => ({
    url: `${baseUrl}/store/${store.slug}`,
    lastModified: store.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const brandUrls = brands.map((brand) => ({
    url: `${baseUrl}/brand/${brand.slug}`,
    lastModified: brand.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/coupons`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...dealUrls,
    ...categoryUrls,
    ...storeUrls,
    ...brandUrls,
    ...postUrls,
  ];
}
