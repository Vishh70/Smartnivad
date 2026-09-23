import { Metadata } from "next";
import { getPublishedContent } from "@/lib/content/fetcher";
import { PublicArticleViewer } from "@/components/content/PublicArticleViewer";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";

export const revalidate = 3600; // Cache for 1 hour (ISR)

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { content } = await getPublishedContent(slug, "REVIEW");

  return {
    title: content.seoTitle || content.title,
    description: content.seoDesc || content.brief,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://smartnivad.com"}/reviews/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const { content, aiJson, products } = await getPublishedContent(
    slug,
    "REVIEW",
  );

  const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://smartnivad.com"}/reviews/${slug}`;

  return (
    <main className="min-h-screen bg-white">
      <ArticleJsonLd
        url={url}
        title={content.seoTitle || content.title}
        description={content.seoDesc || content.brief || ""}
        datePublished={content.createdAt.toISOString()}
        dateModified={content.updatedAt.toISOString()}
        type="REVIEW"
      />

      {/* Hero Header */}
      <header className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {content.title}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Updated{" "}
            {new Date(content.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* Content Viewer */}
      <PublicArticleViewer content={aiJson} products={products} />
    </main>
  );
}
