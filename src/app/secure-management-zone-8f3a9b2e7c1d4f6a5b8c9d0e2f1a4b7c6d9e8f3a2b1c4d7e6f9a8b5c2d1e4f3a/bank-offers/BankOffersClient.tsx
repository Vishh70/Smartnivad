"use client";

import { useState, useTransition } from "react";
import { CreditCard, Plus, Trash2, Check, Power } from "lucide-react";
import {
  createBankOfferAction,
  verifyBankOfferAction,
  toggleBankOfferStatusAction,
  deleteBankOfferAction,
} from "./actions";
import { BankOfferData } from "@/lib/offers/types";

interface BankOffersClientProps {
  offers: BankOfferData[];
}

export function BankOffersClient({ offers }: BankOffersClientProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createBankOfferAction(formData);
        setShowModal(false);
        setStatusMessage("Bank Offer created successfully!");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Failed: ${msg}`);
      }
    });
  };

  const handleVerify = (id: string) => {
    startTransition(async () => {
      try {
        await verifyBankOfferAction(id);
        setStatusMessage("Offer marked as officially verified.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Failed: ${msg}`);
      }
    });
  };

  const handleToggle = (id: string, active: boolean) => {
    startTransition(async () => {
      try {
        await toggleBankOfferStatusAction(id, active);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Failed: ${msg}`);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this bank offer?")) return;
    startTransition(async () => {
      try {
        await deleteBankOfferAction(id);
        setStatusMessage("Offer deleted.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Failed: ${msg}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center justify-between">
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">
            Configured Financial Offers ({offers.length})
          </h2>
          <p className="text-xs text-gray-500">
            Rules evaluated dynamically by SmartNivad&apos;s savings engine on
            every product page.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Bank Offer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Bank & Card</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Cap / Min Spend</th>
                <th className="py-3 px-4">Eligible Stores</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {offers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-400 font-medium"
                  >
                    No bank offers added yet. Click &quot;Add Bank Offer&quot;
                    to configure card promotions.
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">
                        {offer.bankName}
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        {offer.cardName} ({offer.cardType})
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {offer.offerType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-green-700">
                      {offer.discountType === "PERCENTAGE"
                        ? `${offer.discountValue}%`
                        : `₹${offer.discountValue}`}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div>
                        Cap:{" "}
                        {offer.maxDiscountCap
                          ? `₹${offer.maxDiscountCap}`
                          : "No Cap"}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Min: ₹{offer.minSpend}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {offer.eligibleStores?.join(", ") || "All"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          offer.verificationStatus === "VERIFIED"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {offer.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {offer.verificationStatus !== "VERIFIED" && (
                        <button
                          onClick={() => handleVerify(offer.id)}
                          title="Verify Offer"
                          className="p-1.5 rounded-lg text-green-700 hover:bg-green-50"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggle(offer.id, !offer.active)}
                        title={offer.active ? "Pause Offer" : "Activate Offer"}
                        className={`p-1.5 rounded-lg ${offer.active ? "text-blue-600 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-100"}`}
                      >
                        <Power size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        title="Delete Offer"
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Bank Offer */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={20} /> Configure
                Bank Promotion
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Bank Name *
                  </label>
                  <input
                    name="bankName"
                    required
                    placeholder="e.g. HDFC Bank, ICICI Bank, SBI Card"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Card Name *
                  </label>
                  <input
                    name="cardName"
                    required
                    placeholder="e.g. Millennia, Regalia, Amazon Pay"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Card Type
                  </label>
                  <select
                    name="cardType"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  >
                    <option value="CREDIT">Credit Card</option>
                    <option value="DEBIT">Debit Card</option>
                    <option value="ALL">All Cards</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Offer Type
                  </label>
                  <select
                    name="offerType"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  >
                    <option value="INSTANT_DISCOUNT">Instant Discount</option>
                    <option value="CASHBACK">Cashback</option>
                    <option value="EMI_OFFER">No-Cost / Low EMI</option>
                    <option value="COUPON">Coupon</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="discountValue"
                    required
                    placeholder="10 or 1500"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Max Cap (₹)
                  </label>
                  <input
                    type="number"
                    name="maxDiscountCap"
                    placeholder="1500 (Optional)"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Min Spend (₹)
                  </label>
                  <input
                    type="number"
                    name="minSpend"
                    placeholder="5000"
                    defaultValue="0"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Eligible Stores
                  </label>
                  <input
                    name="eligibleStores"
                    defaultValue="Amazon, Flipkart"
                    placeholder="Amazon, Flipkart, etc."
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Eligible Categories
                  </label>
                  <input
                    name="eligibleCategories"
                    defaultValue="ALL"
                    placeholder="ALL or electronics, smartphones"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    EMI Tenure (Mo)
                  </label>
                  <input
                    type="number"
                    name="emiTenureMonths"
                    placeholder="3, 6, 9"
                    className="w-full px-3 py-2 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    EMI Interest %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="emiInterestRate"
                    placeholder="0 for No Cost"
                    className="w-full px-3 py-2 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Processing Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="emiProcessingFee"
                    placeholder="199"
                    className="w-full px-3 py-2 bg-white border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Official Terms URL
                </label>
                <input
                  type="url"
                  name="termsUrl"
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save & Verify Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
