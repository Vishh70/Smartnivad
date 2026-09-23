import React from "react";
import Image from "next/image";
import { Check, X, Tag } from "lucide-react";
import type { Deal } from "@prisma/client";
import type { AIContentArticle } from "@/lib/content/schema";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

interface PublicArticleViewerProps {
  content: AIContentArticle;
  products: Array<{
    deal: Deal;
    aiAnalysis: Record<string, unknown> | null; // We'll map the AI product analysis to the deal
  }>;
}

export function PublicArticleViewer({
  content,
  products,
}: PublicArticleViewerProps) {
  return (
    <article className="w-full max-w-4xl mx-auto px-4 py-8">
      <AffiliateDisclosure />

      {/* Introduction */}
      <section className="mb-12 prose prose-lg prose-blue max-w-none">
        <p className="text-xl leading-relaxed text-gray-700">
          {content.introduction}
        </p>
      </section>

      {/* Content Sections */}
      {content.sections.map((section, idx) => (
        <section key={idx} className="mb-10 prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {section.heading}
          </h2>
          <p className="text-gray-700">{section.content}</p>
        </section>
      ))}

      {/* Product List */}
      <div className="space-y-12 my-12">
        {products.map((p, index) => {
          const { deal, aiAnalysis } = p;
          if (!aiAnalysis) return null;

          return (
            <div
              key={deal.id}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col md:flex-row"
            >
              {/* Product Image */}
              <div className="w-full md:w-1/3 bg-gray-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                <Image
                  src={deal.imageUrl}
                  alt={deal.title}
                  width={400}
                  height={400}
                  className="max-w-full h-auto object-contain max-h-64 mix-blend-multiply"
                />
              </div>

              {/* Product Details */}
              <div className="w-full md:w-2/3 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full mb-2">
                      #{index + 1}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {deal.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-2xl font-black text-gray-900">
                      ₹{deal.currentPrice.toLocaleString()}
                    </div>
                    {deal.originalPrice > deal.currentPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        ₹{deal.originalPrice.toLocaleString()}
                      </div>
                    )}
                    {deal.discount > 0 && (
                      <div className="text-sm font-bold text-green-600 mt-1 flex items-center justify-end gap-1">
                        <Tag size={14} /> {deal.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 italic">
                    &quot;{String(aiAnalysis.verdict)}&quot;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <span className="text-green-500 bg-green-50 rounded-full p-1">
                        <Check size={16} />
                      </span>{" "}
                      Pros
                    </h4>
                    <ul className="space-y-1">
                      {(aiAnalysis.pros as string[]).map(
                        (pro: string, i: number) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-green-500 mt-0.5">•</span>{" "}
                            {pro}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <span className="text-red-500 bg-red-50 rounded-full p-1">
                        <X size={16} />
                      </span>{" "}
                      Cons
                    </h4>
                    <ul className="space-y-1">
                      {(aiAnalysis.cons as string[]).map(
                        (con: string, i: number) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-red-500 mt-0.5">•</span> {con}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                  <a
                    href={`/go/${deal.slug}`}
                    target="_blank"
                    rel="nofollow noopener"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
                  >
                    View Deal
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conclusion */}
      <section className="mt-12 pt-8 border-t border-gray-200 prose prose-lg prose-blue max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
        <p className="text-gray-700 leading-relaxed">{content.conclusion}</p>
      </section>
    </article>
  );
}
