"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url().optional().or(z.literal("")).nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
});

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImage = formData.get("coverImage") as string;
  const status = formData.get("status") as "DRAFT" | "PUBLISHED";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;

  const validated = blogSchema.safeParse({
    title,
    excerpt,
    content,
    coverImage,
    status,
    seoTitle,
    seoDesc,
  });
  if (!validated.success) throw new Error(validated.error.message);

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const tagsStr = formData.get("tags") as string;
  const tags = tagsStr
    ? tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      status,
      tags,
      seoTitle,
      seoDesc,
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/blog",
  );
  revalidatePath("/blog");
  redirect(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/blog",
  );
}
