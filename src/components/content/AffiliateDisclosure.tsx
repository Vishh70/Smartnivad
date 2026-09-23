import { Info } from "lucide-react";

export function AffiliateDisclosure() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 flex items-start gap-3 shadow-sm">
      <Info className="text-gray-500 shrink-0 mt-0.5" size={20} />
      <p className="text-sm text-gray-600 leading-relaxed">
        <strong>Affiliate Disclosure:</strong> Some links on this page are
        affiliate links. If you make a purchase through these links, we may earn
        a commission at no additional cost to you.
      </p>
    </div>
  );
}
