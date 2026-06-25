"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStore(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
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

  revalidatePath("/admin/stores");
  revalidatePath("/");
  redirect("/admin/stores");
}
