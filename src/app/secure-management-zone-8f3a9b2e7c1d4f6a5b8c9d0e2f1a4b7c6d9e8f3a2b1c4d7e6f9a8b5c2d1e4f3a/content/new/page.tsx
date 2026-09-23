import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NewContentForm } from "../_components/NewContentForm";

export const metadata = {
  title: "New AI Content Draft",
};

export default async function NewContentPage() {
  await requireAdmin();

  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, store: { select: { name: true } } },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Create Content Draft
        </h1>
        <p className="text-muted-foreground mt-1">
          Instruct the AI to generate a structured content brief using real
          facts from your database.
        </p>
      </div>

      <div className="bg-card text-card-foreground border rounded-lg p-6">
        <NewContentForm deals={deals} />
      </div>
    </div>
  );
}
