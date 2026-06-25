"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStore(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const logoUrl = formData.get("logoUrl") as string;
  const website = formData.get("website") as string;
  const affiliateBaseUrl = formData.get("affiliateBaseUrl") as string;
  const description = formData.get("description") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;

  await prisma.store.create({
    data: {
      name,
      slug,
      logoUrl,
      website,
      affiliateBaseUrl,
      description,
      seoTitle,
      seoDesc,
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/stores",
  );
  revalidatePath("/");
  redirect(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/stores",
  );
}
