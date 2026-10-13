import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BankOffersClient } from "./BankOffersClient";
import { CreditCard } from "lucide-react";

export const metadata = {
  title: "Bank & Credit Card Offers Management | SmartNivad Admin",
};

export default async function BankOffersPage() {
  await requireAdmin();

  const offers = await prisma.bankOffer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
          <CreditCard size={14} /> Smart Card Savings Engine
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Credit Card & Bank Offers Configuration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage partner bank discounts, cashbacks, caps, and EMI rules. The
          pure calculator automatically selects the best deal for customers
          without collecting PII.
        </p>
      </div>

      <BankOffersClient offers={offers} />
    </div>
  );
}
