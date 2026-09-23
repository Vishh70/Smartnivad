/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateContentStatusAction, deleteContentAction } from "../actions";
import { ContentStatus } from "@prisma/client";

export function ContentReviewForm({ content }: { content: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const aiData = content.aiJson || {};

  async function handleStatusChange(status: ContentStatus) {
    if (!confirm(`Are you sure you want to change status to ${status}?`))
      return;
    setLoading(true);
    try {
      await updateContentStatusAction(content.id, status);
      router.refresh();
    } catch (error: any) {
      alert(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this content?")) return;
    setLoading(true);
    try {
      await deleteContentAction(content.id);
      router.push(
        "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content",
      );
    } catch (error: any) {
      alert(error.message || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 p-4 bg-card border rounded-md">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Current Status
          </p>
          <p className="text-lg font-bold">{content.status}</p>
        </div>
        <div className="flex-1"></div>
        {content.status === "DRAFT" && (
          <button
            onClick={() => handleStatusChange("IN_REVIEW")}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
          >
            Submit for Review
          </button>
        )}
        {content.status === "IN_REVIEW" && (
          <button
            onClick={() => handleStatusChange("APPROVED")}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            Approve Content
          </button>
        )}
        {content.status === "APPROVED" && (
          <button
            onClick={() => handleStatusChange("PUBLISHED")}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50"
          >
            Publish Live
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: AI Generated Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            AI Generated Content (Preview)
          </h2>

          <div className="bg-card border rounded-md p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                SEO Title
              </p>
              <p>{aiData.seoTitle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                SEO Description
              </p>
              <p>{aiData.seoDesc}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Introduction
              </p>
              <p className="whitespace-pre-wrap">{aiData.introduction}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Sections</h3>
              {aiData.sections?.map((sec: any, idx: number) => (
                <div key={idx}>
                  <h4 className="font-medium">{sec.heading}</h4>
                  <p className="whitespace-pre-wrap text-sm mt-1">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                Conclusion
              </h3>
              <p className="whitespace-pre-wrap text-sm">{aiData.conclusion}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Fact Check Data */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Fact Check (Database Truth)</h2>

          <div className="space-y-4">
            {content.products.map((cp: any) => {
              const deal = cp.deal;
              const aiAnalysis =
                aiData.productAnalyses?.find(
                  (a: any) => a.dealId === deal.id,
                ) || {};

              return (
                <div
                  key={cp.id}
                  className="bg-card border rounded-md p-4 space-y-3"
                >
                  <h3 className="font-bold text-lg">{deal.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Actual Price
                      </p>
                      <p>${deal.currentPrice}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Actual Discount
                      </p>
                      <p>{deal.discount}%</p>
                    </div>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      AI Verdict
                    </p>
                    <p className="text-sm">{aiAnalysis.verdict || "N/A"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        AI Pros
                      </p>
                      <ul className="list-disc list-inside text-sm">
                        {aiAnalysis.pros?.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        AI Cons
                      </p>
                      <ul className="list-disc list-inside text-sm">
                        {aiAnalysis.cons?.map((c: string, i: number) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
