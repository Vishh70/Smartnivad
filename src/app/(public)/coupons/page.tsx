import { CouponsClient } from "@/components/sections/CouponsClient";
import { getCoupons, getStores, getCategories } from "@/lib/data";

export const metadata = {
  title: "Coupons & Promo Codes | TechDeals AI",
  description: "Verified promo codes for top stores. Click to copy — no fake discounts, ever.",
};

export default async function CouponsPage() {
  const [coupons, stores, categories] = await Promise.all([
    getCoupons(),
    getStores(),
    getCategories(),
  ]);

  return (
    <CouponsClient coupons={coupons} stores={stores} categories={categories} />
  );
}
