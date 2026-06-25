import { getDeals, getCategories } from "@/lib/data";
import { CompareClient } from "@/components/sections/CompareClient";

export const metadata = {
  title: "Compare Deals | TechDeals AI",
  description: "Select up to 3 products and compare them side-by-side.",
};

export default async function ComparePage() {
  const [deals, categories] = await Promise.all([
    getDeals(),
    getCategories(),
  ]);

  return (
    <CompareClient deals={deals} categories={categories} />
  );
}
