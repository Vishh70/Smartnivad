import React from "react";

type SchemaProduct = {
  name: string;
  imageUrl: string;
  description?: string;
  brand?: string;
  id: string;
  lowestPrice?: number;
  highestPrice?: number;
  stores?: unknown[];
};

export function ProductSchema({ product }: { product: SchemaProduct }) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand || "Unknown",
    },
    offers: {
      "@type": "AggregateOffer",
      url: `https://smartnivad.com/deals/${product.id}`,
      priceCurrency: "INR",
      lowPrice: product.lowestPrice,
      highPrice: product.highestPrice,
      offerCount: product.stores ? product.stores.length : 1,
    },
    // We can add reviews and aggregateRating if available later
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://smartnivad.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
