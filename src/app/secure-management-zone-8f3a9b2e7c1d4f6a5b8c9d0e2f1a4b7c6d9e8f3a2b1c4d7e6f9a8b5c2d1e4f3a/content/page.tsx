import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { ContentStatus } from "@prisma/client";

export const metadata = {
  title: "Content Engine",
};

export default async function ContentDashboard() {
  await requireAdmin();

  const contentItems = await prisma.content.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Affiliate Content Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate and review AI-assisted affiliate content.
          </p>
        </div>
        <Link
          href="/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          New Content Draft
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Type
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Created
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {contentItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">{item.title}</td>
                  <td className="p-4 align-middle">{item.type}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    {item.createdAt.toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Link
                      href={`/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/${item.id}/review`}
                      className="text-primary hover:underline"
                    >
                      {item.status === "PUBLISHED"
                        ? "View"
                        : "Review & Approve"}
                    </Link>
                  </td>
                </tr>
              ))}
              {contentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No content drafts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: ContentStatus) {
  switch (status) {
    case "DRAFT":
      return "bg-secondary text-secondary-foreground";
    case "IN_REVIEW":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "APPROVED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "PUBLISHED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  }
}
