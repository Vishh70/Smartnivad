"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  platform: z.enum(["AMAZON", "FLIPKART", "OTHER"]),
  prize: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
});

export async function createQuiz(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const platform = formData.get("platform") as "AMAZON" | "FLIPKART" | "OTHER";
  const prize = formData.get("prize") as string;
  const status = formData.get("status") as "DRAFT" | "PUBLISHED";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDesc = formData.get("seoDesc") as string;

  const validated = quizSchema.safeParse({
    title,
    platform,
    prize,
    status,
    seoTitle,
    seoDesc,
  });
  if (!validated.success) throw new Error(validated.error.message);

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const rawQaPairs = formData.get("qaPairs") as string;
  let qaPairs = [];
  try {
    qaPairs = JSON.parse(rawQaPairs);
  } catch (e) {
    // If not valid JSON, fallback to simple array or empty array
    console.error("Failed to parse QA Pairs", e);
  }

  await prisma.quizPost.create({
    data: {
      title,
      slug,
      platform,
      prize,
      status,
      qaPairs,
      seoTitle,
      seoDesc,
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/quizzes",
  );
  revalidatePath("/quiz-answers");
  redirect(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/quizzes",
  );
}
