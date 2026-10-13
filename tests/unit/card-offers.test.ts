import { describe, it, expect } from "vitest";
import {
  evaluateOffer,
  calculateBestCardOffer,
  calculateEmi,
  OFFER_DISCLAIMER,
} from "@/lib/offers/calculator";
import { BankOfferData, ProductOfferContext } from "@/lib/offers/types";

describe("Credit Card & Bank Offer Engine", () => {
  const baseOffer: BankOfferData = {
    id: "hdfc-millennia-1",
    bankName: "HDFC Bank",
    cardName: "Millennia Credit Card",
    cardType: "CREDIT",
    offerType: "INSTANT_DISCOUNT",
    discountType: "PERCENTAGE",
    discountValue: 10,
    maxDiscountCap: 1500,
    minSpend: 5000,
    eligibleStores: ["Amazon", "Flipkart"],
    eligibleCategories: ["electronics", "laptops", "smartphones"],
    verificationStatus: "VERIFIED",
    active: true,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-12-31"),
  };

  const context: ProductOfferContext = {
    price: 25000,
    storeName: "Amazon",
    categorySlug: "laptops",
    currentDate: new Date("2026-06-15"),
  };

  describe("Discount Caps and Minimum Spend", () => {
    it("applies percentage discount and strictly enforces the maximum discount cap", () => {
      // 10% of 25,000 is 2,500, but cap is 1,500
      const evaluation = evaluateOffer(baseOffer, context);
      expect(evaluation.isEligible).toBe(true);
      expect(evaluation.discountAmount).toBe(1500);
      expect(evaluation.immediatePayablePrice).toBe(23500);
      expect(evaluation.effectivePrice).toBe(23500);
      expect(evaluation.totalSavings).toBe(1500);
    });

    it("applies un-capped percentage discount when below max cap", () => {
      // 10% of 8,000 is 800, which is below 1,500 cap
      const evalUnderCap = evaluateOffer(baseOffer, {
        ...context,
        price: 8000,
      });
      expect(evalUnderCap.isEligible).toBe(true);
      expect(evalUnderCap.discountAmount).toBe(800);
      expect(evalUnderCap.immediatePayablePrice).toBe(7200);
      expect(evalUnderCap.effectivePrice).toBe(7200);
    });

    it("rejects offer when product price is below minimum eligible spend", () => {
      const evalLowPrice = evaluateOffer(baseOffer, {
        ...context,
        price: 4999,
      });
      expect(evalLowPrice.isEligible).toBe(false);
      expect(evalLowPrice.rejectionReason).toContain(
        "Requires minimum transaction of ₹5,000",
      );
      expect(evalLowPrice.immediatePayablePrice).toBe(4999);
      expect(evalLowPrice.effectivePrice).toBe(4999);
      expect(evalLowPrice.totalSavings).toBe(0);
    });

    it("handles fixed amount discounts properly", () => {
      const fixedOffer: BankOfferData = {
        ...baseOffer,
        discountType: "FIXED",
        discountValue: 1250,
        maxDiscountCap: null,
      };
      const evaluation = evaluateOffer(fixedOffer, context);
      expect(evaluation.isEligible).toBe(true);
      expect(evaluation.discountAmount).toBe(1250);
      expect(evaluation.immediatePayablePrice).toBe(23750);
    });
  });

  describe("Cashback vs Instant Discount", () => {
    it("clearly distinguishes immediate payable price from later post-statement cashback", () => {
      const cashbackOffer: BankOfferData = {
        ...baseOffer,
        id: "amazon-pay-icici",
        bankName: "ICICI Bank",
        cardName: "Amazon Pay ICICI Card",
        offerType: "CASHBACK",
        discountType: "PERCENTAGE",
        discountValue: 5,
        maxDiscountCap: null, // unlimited 5% cashback
      };

      // Price: 25,000. 5% cashback = 1,250.
      const evaluation = evaluateOffer(cashbackOffer, context);
      expect(evaluation.isEligible).toBe(true);
      // Immediate payable at payment gateway MUST be the full price
      expect(evaluation.immediatePayablePrice).toBe(25000);
      expect(evaluation.discountAmount).toBe(0);
      // Cashback is credited later, reducing effective cost
      expect(evaluation.cashbackAmount).toBe(1250);
      expect(evaluation.effectivePrice).toBe(23750);
      expect(evaluation.breakdown).toContain("cashback later");
    });
  });

  describe("EMI and Interest Calculation", () => {
    it("calculates No Cost EMI with zero interest", () => {
      const noCostEmiOffer: BankOfferData = {
        ...baseOffer,
        offerType: "EMI_OFFER",
        discountType: "FIXED",
        discountValue: 1000,
        emiTenureMonths: 6,
        emiInterestRate: 0,
        emiProcessingFee: 199,
      };

      const evaluation = evaluateOffer(noCostEmiOffer, context);
      expect(evaluation.isEligible).toBe(true);
      // Principal = 25000 - 1000 = 24000
      expect(evaluation.immediatePayablePrice).toBe(24000);
      // 24000 / 6 = 4000/month
      expect(evaluation.monthlyEmi).toBe(4000);
      expect(evaluation.emiTotalInterest).toBe(0);
      expect(evaluation.emiProcessingFee).toBe(199);
      // Effective = 24000 + 0 + 199 = 24199
      expect(evaluation.effectivePrice).toBe(24199);
    });

    it("calculates standard reducing-balance EMI with interest and processing fee", () => {
      const { monthlyEmi, totalInterest, totalPayment } = calculateEmi(
        12000,
        14,
        6,
      );
      expect(monthlyEmi).toBeGreaterThan(2000);
      expect(totalInterest).toBeGreaterThan(0);
      expect(totalPayment).toBeCloseTo(monthlyEmi * 6, 0);
    });
  });

  describe("Store, Category, and Date Expiry Exclusions", () => {
    it("rejects offer when store does not match", () => {
      const evalStore = evaluateOffer(baseOffer, {
        ...context,
        storeName: "Tata CLiQ",
      });
      expect(evalStore.isEligible).toBe(false);
      expect(evalStore.rejectionReason).toContain(
        "Offer only valid on Amazon, Flipkart",
      );
    });

    it("rejects offer when category does not match", () => {
      const evalCategory = evaluateOffer(baseOffer, {
        ...context,
        categorySlug: "fashion",
      });
      expect(evalCategory.isEligible).toBe(false);
      expect(evalCategory.rejectionReason).toContain(
        "Offer not applicable for category 'fashion'",
      );
    });

    it("rejects expired offers", () => {
      const expiredOffer: BankOfferData = {
        ...baseOffer,
        endDate: new Date("2026-05-01"),
      };
      const evaluation = evaluateOffer(expiredOffer, context);
      expect(evaluation.isEligible).toBe(false);
      expect(evaluation.rejectionReason).toContain("Offer expired");
    });

    it("rejects unverified or pending offers", () => {
      const unverifiedOffer: BankOfferData = {
        ...baseOffer,
        verificationStatus: "UNVERIFIED",
      };
      const evaluation = evaluateOffer(unverifiedOffer, context);
      expect(evaluation.isEligible).toBe(false);
      expect(evaluation.rejectionReason).toContain(
        "pending official verification",
      );
    });
  });

  describe("Best Offer Recommendation Logic", () => {
    it("recommends the lowest effective price rather than merely largest advertised percentage", () => {
      // Offer A: Advertised as 20% OFF, but capped at ₹1,000 -> Effective: ₹24,000
      const offerA: BankOfferData = {
        id: "offer-a",
        bankName: "Bank A",
        cardName: "Card A",
        offerType: "INSTANT_DISCOUNT",
        discountType: "PERCENTAGE",
        discountValue: 20, // 20% advertised
        maxDiscountCap: 1000,
        minSpend: 5000,
        verificationStatus: "VERIFIED",
        active: true,
      };

      // Offer B: Advertised as only 7.5% OFF, but capped at ₹2,500 -> Effective: ₹23,125 (Saves ₹1,875!)
      const offerB: BankOfferData = {
        id: "offer-b",
        bankName: "Bank B",
        cardName: "Card B",
        offerType: "INSTANT_DISCOUNT",
        discountType: "PERCENTAGE",
        discountValue: 7.5, // lower percentage advertised
        maxDiscountCap: 2500,
        minSpend: 5000,
        verificationStatus: "VERIFIED",
        active: true,
      };

      const result = calculateBestCardOffer([offerA, offerB], context);
      expect(result.bestOffer).not.toBeNull();
      // Should choose Offer B because effective price is lower (₹23,125 < ₹24,000)
      expect(result.bestOffer?.offer.id).toBe("offer-b");
      expect(result.bestOffer?.effectivePrice).toBe(23125);
      expect(result.bestOffer?.totalSavings).toBe(1875);
    });

    it("prefers instant discount over cashback when effective savings are identical", () => {
      const instantOffer: BankOfferData = {
        id: "instant-1000",
        bankName: "Bank Instant",
        cardName: "Card 1",
        offerType: "INSTANT_DISCOUNT",
        discountType: "FIXED",
        discountValue: 1000,
        verificationStatus: "VERIFIED",
        active: true,
      };

      const cashbackOffer: BankOfferData = {
        id: "cashback-1000",
        bankName: "Bank Cashback",
        cardName: "Card 2",
        offerType: "CASHBACK",
        discountType: "FIXED",
        discountValue: 1000,
        verificationStatus: "VERIFIED",
        active: true,
      };

      const result = calculateBestCardOffer(
        [cashbackOffer, instantOffer],
        context,
      );
      expect(result.bestOffer?.offer.id).toBe("instant-1000");
      expect(result.bestOffer?.immediatePayablePrice).toBe(24000);
    });

    it("includes mandatory legal disclaimer and requires zero card PII", () => {
      const result = calculateBestCardOffer([baseOffer], context);
      expect(result.disclaimer).toBe(OFFER_DISCLAIMER);
      expect(result.disclaimer).toContain(
        "SmartNivad does not collect or process card numbers",
      );
    });
  });
});
