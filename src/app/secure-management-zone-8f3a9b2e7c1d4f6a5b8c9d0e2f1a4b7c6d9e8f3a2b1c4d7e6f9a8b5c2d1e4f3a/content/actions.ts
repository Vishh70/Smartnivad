"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { generateContentDraft } from "@/lib/content/generator";
import { ContentType, ContentStatus } from "@prisma/client";
import { canTransitionContentStatus } from "@/lib/content/state-machine";
import { validateFactsAgainstDB } from "@/lib/content/fact-validator";
import { AIContentArticleSchema } from "@/lib/content/schema";

export async function createContentDraftAction(data: {
  title: string;
  type: ContentType;
  brief: string;
  dealIds: string[];
}) {
  await requireAdmin();

  let slug = data.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const RESERVED_SLUGS = [
    "new",
    "edit",
    "delete",
    "review",
    "api",
    "admin",
    "login",
  ];
  if (RESERVED_SLUGS.includes(slug)) {
    throw new Error(
      `The title generates a reserved slug '${slug}'. Please change the title.`,
    );
  }

  // Handle collision
  const existing = await prisma.content.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  // Run AI generation (this can take a few seconds)
  const aiResult = await generateContentDraft(
    data.title,
    data.brief,
    data.dealIds,
  );

  const content = await prisma.content.create({
    data: {
      title: data.title,
      slug,
      type: data.type,
      brief: data.brief,
      status: "DRAFT",
      aiJson: aiResult,
      seoTitle: aiResult.seoTitle,
      seoDesc: aiResult.seoDesc,
      products: {
        create: data.dealIds.map((id, index) => ({
          deal: { connect: { id } },
          order: index,
        })),
      },
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content",
  );
  return { success: true, id: content.id };
}

export async function updateContentStatusAction(
  id: string,
  targetStatus: ContentStatus,
) {
  await requireAdmin();

  const content = await prisma.content.findUnique({
    where: { id },
    include: { products: true },
  });

  if (!content) {
    throw new Error("Content not found");
  }

  // Enforce valid transitions
  if (!canTransitionContentStatus(content.status, targetStatus)) {
    throw new Error(
      `Invalid state transition from ${content.status} to ${targetStatus}`,
    );
  }

  // Enforce fact validation on APPROVED and PUBLISHED
  if (targetStatus === "APPROVED" || targetStatus === "PUBLISHED") {
    if (!content.aiJson) {
      throw new Error("Content has no generated JSON to validate.");
    }

    // Validate schema
    const parsedData = AIContentArticleSchema.parse(content.aiJson);

    // Validate facts against DB source of truth
    const expectedDealIds = content.products.map((p) => p.dealId);
    const factCheck = await validateFactsAgainstDB(parsedData, expectedDealIds);

    if (!factCheck.passed) {
      throw new Error(
        `Fact validation failed. AI claims do not match DB. Issues: ` +
          factCheck.results.flatMap((r) => r.issues).join("; "),
      );
    }
  }

  await prisma.content.update({
    where: { id },
    data: { status: targetStatus },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content",
  );
  revalidatePath(
    `/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/${id}/review`,
  );
  return { success: true };
}

export async function deleteContentAction(id: string) {
  await requireAdmin();

  await prisma.content.delete({
    where: { id },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content",
  );
  return { success: true };
}
