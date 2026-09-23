"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;
  const description = formData.get("description") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;

  const validated = categorySchema.safeParse({
    name,
    icon,
    description,
    seoTitle,
    seoDesc,
  });
  if (!validated.success) throw new Error(validated.error.message);

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  await prisma.category.create({
    data: {
      name,
      slug,
      icon,
      description,
      seoTitle,
      seoDesc,
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/categories",
  );
  revalidatePath("/");
  redirect(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/categories",
  );
}
