import type {
  Brand as PrismaBrand,
  Category as PrismaCategory,
  Coupon as PrismaCoupon,
  Deal as PrismaDeal,
  Store as PrismaStore,
} from "@prisma/client";

export type DealWithRelations = PrismaDeal & {
  category: PrismaCategory;
  store: PrismaStore;
  brand: PrismaBrand | null;
};

export type CouponWithRelations = PrismaCoupon & {
  store: PrismaStore;
  category: PrismaCategory | null;
  deal: PrismaDeal | null;
};

export type { PrismaBrand, PrismaCategory, PrismaCoupon, PrismaDeal, PrismaStore };

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  affiliateLink: string;
  categoryId: string;
  category?: Category;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  featured: boolean;
  clicks: number;
  seoTitle?: string;
  seoDesc?: string;
  pros: string[];
  cons: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  products?: Product[];
  createdAt: Date;
}

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
