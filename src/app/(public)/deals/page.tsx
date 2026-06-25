import { getDeals, getCategories, getStores, getBrands } from "@/lib/data";
import { DealsClient } from "@/components/sections/DealsClient";

export const metadata = {
  title: "All Deals | TechDeals AI",
  description: "Browse thousands of deals across categories and stores.",
};

export default async function DealsPage() {
  const [deals, categories, stores, brands] = await Promise.all([
    getDeals(),
    getCategories(),
    getStores(),
    getBrands(),
  ]);

  return (
    <DealsClient 
      deals={deals} 
      categories={categories} 
      stores={stores} 
      brands={brands} 
    />
  );
}
