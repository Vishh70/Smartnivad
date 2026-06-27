import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  try {
    // Fetch dynamic content
    const [deals, categories, stores, brands, posts] = await Promise.all([
      prisma.deal.findMany({
        select: { slug: true, updatedAt: true },
        where: { status: "PUBLISHED" },
      }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.store.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.brand.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({
        select: { slug: true, updatedAt: true },
        where: { status: "PUBLISHED" },
      }),
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

    // Static pages
    const staticPages = [
      { path: "", changeFrequency: "daily" as const, priority: 1 },
      { path: "/deals", changeFrequency: "daily" as const, priority: 0.9 },
      { path: "/coupons", changeFrequency: "daily" as const, priority: 0.8 },
      { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
      { path: "/compare", changeFrequency: "weekly" as const, priority: 0.7 },
      { path: "/about", changeFrequency: "monthly" as const, priority: 0.4 },
      { path: "/contact", changeFrequency: "monthly" as const, priority: 0.4 },
      { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.3 },
      { path: "/terms", changeFrequency: "monthly" as const, priority: 0.3 },
      {
        path: "/disclaimer",
        changeFrequency: "monthly" as const,
        priority: 0.3,
      },
    ];

    const staticUrls = staticPages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

    return [
      ...staticUrls,
      ...dealUrls,
      ...categoryUrls,
      ...storeUrls,
      ...brandUrls,
      ...postUrls,
    ];
  } catch (error) {
    console.error(
      "[sitemap.ts] DB unreachable, returning fallback sitemap",
      error,
    );

    const staticPages = [
      { path: "", changeFrequency: "daily" as const, priority: 1 },
      { path: "/deals", changeFrequency: "daily" as const, priority: 0.9 },
      { path: "/contact", changeFrequency: "monthly" as const, priority: 0.4 },
    ];

    return staticPages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));
  }
}
