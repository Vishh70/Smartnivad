/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ContentReviewForm } from "../../_components/ContentReviewForm";

export const metadata = {
  title: "Review Content Draft",
};

export default async function ContentReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const id = (await params).id;

  const content = await prisma.content.findUnique({
    where: { id },
    include: {
      products: {
        include: { deal: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!content) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Review Content: {content.title}
        </h1>
        <p className="text-muted-foreground mt-1">
          Verify the AI generated content against the factual deal data before
          approving.
        </p>
      </div>

      <ContentReviewForm content={content as any} />
    </div>
  );
}
