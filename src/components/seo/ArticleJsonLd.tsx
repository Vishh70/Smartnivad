import React from "react";
import type { ContentType } from "@prisma/client";

interface ArticleJsonLdProps {
  url: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
  type: ContentType;
  products?: Array<{
    name: string;
    url: string;
  }>;
}

export function ArticleJsonLd({
  url,
  title,
  description,
  datePublished,
  dateModified,
  authorName = "SmartNivad Editorial",
  type,
  products,
}: ArticleJsonLdProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    description: description,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "SmartNivad",
      logo: {
        "@type": "ImageObject",
        url: "https://smartnivad.com/logo.png",
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
  };

  const schemas = [schema];

  if (type === "LISTICLE" && products && products.length > 0) {
    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: product.url,
        name: product.name,
      })),
    };
    schemas.push(itemListSchema);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
