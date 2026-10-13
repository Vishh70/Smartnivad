import {
  BankOfferData,
  OfferEvaluation,
  BestOfferResult,
  ProductOfferContext,
} from "./types";

export const OFFER_DISCLAIMER =
  "Offer eligibility, bank terms, and final price must be confirmed at checkout. SmartNivad does not collect or process card numbers, CVVs, or banking credentials.";

/**
 * Standard EMI calculation using reducing balance formula
 */
export function calculateEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
): { monthlyEmi: number; totalInterest: number; totalPayment: number } {
  if (tenureMonths <= 0 || principal <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayment: principal };
  }

  if (annualInterestRate <= 0) {
    // No-cost or 0% interest EMI
    const monthlyEmi = Math.round((principal / tenureMonths) * 100) / 100;
    return {
      monthlyEmi,
      totalInterest: 0,
      totalPayment: principal,
    };
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const monthlyEmi =
    Math.round(principal * ((monthlyRate * factor) / (factor - 1)) * 100) / 100;
  const totalPayment = Math.round(monthlyEmi * tenureMonths * 100) / 100;
  const totalInterest = Math.max(
    0,
    Math.round((totalPayment - principal) * 100) / 100,
  );

  return { monthlyEmi, totalInterest, totalPayment };
}

/**
 * Evaluate a single bank or card offer against a product purchase context.
 * Pure, side-effect free function for robust unit testing and safety.
 */
export function evaluateOffer(
  offer: BankOfferData,
  context: ProductOfferContext,
): OfferEvaluation {
  const { price, storeName, categorySlug } = context;
  const now = context.currentDate ? new Date(context.currentDate) : new Date();

  // 1. Basic price sanity
  if (!price || price <= 0) {
    return {
      offer,
      isEligible: false,
      rejectionReason: "Product price must be greater than zero",
      discountAmount: 0,
      cashbackAmount: 0,
      immediatePayablePrice: 0,
      effectivePrice: 0,
      totalSavings: 0,
      breakdown: "Invalid product price",
    };
  }

  // 2. Active status check
  if (offer.active === false) {
    return {
      offer,
      isEligible: false,
      rejectionReason: "Promotion is currently paused or inactive",
      discountAmount: 0,
      cashbackAmount: 0,
      immediatePayablePrice: price,
      effectivePrice: price,
      totalSavings: 0,
      breakdown: "Inactive promotion",
    };
  }

  // 3. Verification status check
  if (offer.verificationStatus !== "VERIFIED") {
    return {
      offer,
      isEligible: false,
      rejectionReason:
        offer.verificationStatus === "EXPIRED"
          ? "Offer terms have expired"
          : "Offer is pending official verification",
      discountAmount: 0,
      cashbackAmount: 0,
      immediatePayablePrice: price,
      effectivePrice: price,
      totalSavings: 0,
      breakdown: `Unverified offer status: ${offer.verificationStatus}`,
    };
  }

  // 4. Date validity check
  if (offer.startDate) {
    const start = new Date(offer.startDate);
    if (now < start) {
      return {
        offer,
        isEligible: false,
        rejectionReason: `Offer is not yet active (starts on ${start.toISOString().split("T")[0]})`,
        discountAmount: 0,
        cashbackAmount: 0,
        immediatePayablePrice: price,
        effectivePrice: price,
        totalSavings: 0,
        breakdown: "Offer not yet active",
      };
    }
  }

  if (offer.endDate) {
    const end = new Date(offer.endDate);
    if (now > end) {
      return {
        offer,
        isEligible: false,
        rejectionReason: `Offer expired on ${end.toISOString().split("T")[0]}`,
        discountAmount: 0,
        cashbackAmount: 0,
        immediatePayablePrice: price,
        effectivePrice: price,
        totalSavings: 0,
        breakdown: "Offer expired",
      };
    }
  }

  // 5. Store compatibility check
  if (
    storeName &&
    offer.eligibleStores &&
    offer.eligibleStores.length > 0 &&
    !offer.eligibleStores.some((s) => s.toUpperCase() === "ALL")
  ) {
    const cleanStore = storeName.trim().toLowerCase();
    const isStoreEligible = offer.eligibleStores.some((s) =>
      cleanStore.includes(s.toLowerCase().trim()),
    );
    if (!isStoreEligible) {
      return {
        offer,
        isEligible: false,
        rejectionReason: `Offer only valid on ${offer.eligibleStores.join(", ")} (current store: ${storeName})`,
        discountAmount: 0,
        cashbackAmount: 0,
        immediatePayablePrice: price,
        effectivePrice: price,
        totalSavings: 0,
        breakdown: "Incompatible store",
      };
    }
  }

  // 6. Category compatibility check
  if (
    categorySlug &&
    offer.eligibleCategories &&
    offer.eligibleCategories.length > 0 &&
    !offer.eligibleCategories.some((c) => c.toUpperCase() === "ALL")
  ) {
    const isCategoryEligible = offer.eligibleCategories.some(
      (c) => c.toLowerCase().trim() === categorySlug.toLowerCase().trim(),
    );
    if (!isCategoryEligible) {
      return {
        offer,
        isEligible: false,
        rejectionReason: `Offer not applicable for category '${categorySlug}'`,
        discountAmount: 0,
        cashbackAmount: 0,
        immediatePayablePrice: price,
        effectivePrice: price,
        totalSavings: 0,
        breakdown: "Incompatible category",
      };
    }
  }

  // 7. Minimum spend requirement
  const minSpend = offer.minSpend ?? 0;
  if (minSpend > 0 && price < minSpend) {
    return {
      offer,
      isEligible: false,
      rejectionReason: `Requires minimum transaction of ₹${minSpend.toLocaleString("en-IN")} (cart price is ₹${price.toLocaleString("en-IN")})`,
      discountAmount: 0,
      cashbackAmount: 0,
      immediatePayablePrice: price,
      effectivePrice: price,
      totalSavings: 0,
      breakdown: `Minimum spend condition ₹${minSpend} not met`,
    };
  }

  // 8. Calculate base savings amount
  let calculatedSavings = 0;
  if (offer.discountType === "PERCENTAGE") {
    const rawPct = (price * offer.discountValue) / 100;
    calculatedSavings = Math.round(rawPct * 100) / 100;
  } else {
    // FIXED
    calculatedSavings = offer.discountValue;
  }

  // Enforce maximum discount cap
  if (
    offer.maxDiscountCap !== undefined &&
    offer.maxDiscountCap !== null &&
    offer.maxDiscountCap > 0
  ) {
    if (calculatedSavings > offer.maxDiscountCap) {
      calculatedSavings = offer.maxDiscountCap;
    }
  }

  // Savings cannot exceed price
  calculatedSavings = Math.min(calculatedSavings, price);

  // 9. Differentiate by Offer Type
  let discountAmount = 0;
  let cashbackAmount = 0;
  let immediatePayablePrice = price;
  let effectivePrice = price;
  let monthlyEmi: number | undefined;
  let emiTotalInterest: number | undefined;
  let emiProcessingFee: number | undefined;
  let breakdown = "";

  if (offer.offerType === "CASHBACK") {
    // Cashback does not reduce immediate checkout price, credited later
    discountAmount = 0;
    cashbackAmount = calculatedSavings;
    immediatePayablePrice = price;
    effectivePrice = Math.max(0, price - cashbackAmount);
    breakdown = `Pay ₹${immediatePayablePrice.toLocaleString("en-IN")} at checkout; receive ₹${cashbackAmount.toLocaleString("en-IN")} cashback later (Effective: ₹${effectivePrice.toLocaleString("en-IN")})`;
  } else if (offer.offerType === "EMI_OFFER") {
    // Instant discount applied to principal
    discountAmount = calculatedSavings;
    cashbackAmount = 0;
    const principal = Math.max(0, price - discountAmount);
    const tenure = offer.emiTenureMonths || 3;
    const annualRate = offer.emiInterestRate ?? 0;
    const processingFee = offer.emiProcessingFee ?? 0;

    const emiCalc = calculateEmi(principal, annualRate, tenure);
    monthlyEmi = emiCalc.monthlyEmi;
    emiTotalInterest = emiCalc.totalInterest;
    emiProcessingFee = processingFee;

    immediatePayablePrice = principal;
    effectivePrice = principal + emiTotalInterest + emiProcessingFee;

    const isNoCost = annualRate === 0;
    breakdown = isNoCost
      ? `No Cost EMI: ₹${monthlyEmi.toLocaleString("en-IN")}/mo for ${tenure} months${processingFee > 0 ? ` + ₹${processingFee} processing fee` : ""} (Effective: ₹${effectivePrice.toLocaleString("en-IN")})`
      : `EMI: ₹${monthlyEmi.toLocaleString("en-IN")}/mo for ${tenure} months at ${annualRate}% p.a. (Total interest: ₹${emiTotalInterest.toLocaleString("en-IN")}${processingFee > 0 ? ` + ₹${processingFee} fee` : ""})`;
  } else {
    // INSTANT_DISCOUNT or COUPON
    discountAmount = calculatedSavings;
    cashbackAmount = 0;
    immediatePayablePrice = Math.max(0, price - discountAmount);
    effectivePrice = immediatePayablePrice;
    breakdown = `Instant discount of ₹${discountAmount.toLocaleString("en-IN")} applied at checkout (Payable: ₹${effectivePrice.toLocaleString("en-IN")})`;
  }

  const totalSavings = Math.max(0, price - effectivePrice);

  return {
    offer,
    isEligible: true,
    discountAmount,
    cashbackAmount,
    immediatePayablePrice,
    effectivePrice,
    monthlyEmi,
    emiTotalInterest,
    emiProcessingFee,
    totalSavings,
    breakdown,
  };
}

/**
 * Evaluates all offers and finds the guaranteed best applicable offer.
 * Ranks by lowest effective purchase price (highest net savings),
 * prioritizing instant payable discounts over later cashback when savings are equal.
 */
export function calculateBestCardOffer(
  offers: BankOfferData[],
  context: ProductOfferContext,
): BestOfferResult {
  const allEvaluations = offers.map((offer) => evaluateOffer(offer, context));

  const eligibleOffers = allEvaluations.filter(
    (evalResult) => evalResult.isEligible,
  );

  if (eligibleOffers.length === 0) {
    return {
      bestOffer: null,
      allEvaluations,
      eligibleCount: 0,
      ineligibleCount: allEvaluations.length,
      disclaimer: OFFER_DISCLAIMER,
    };
  }

  // Sort by lowest effective price.
  // Tie-breaker 1: lowest immediate payable price (instant discount beats later cashback)
  // Tie-breaker 2: highest total savings
  eligibleOffers.sort((a, b) => {
    if (a.effectivePrice !== b.effectivePrice) {
      return a.effectivePrice - b.effectivePrice;
    }
    if (a.immediatePayablePrice !== b.immediatePayablePrice) {
      return a.immediatePayablePrice - b.immediatePayablePrice;
    }
    return b.totalSavings - a.totalSavings;
  });

  return {
    bestOffer: eligibleOffers[0],
    allEvaluations,
    eligibleCount: eligibleOffers.length,
    ineligibleCount: allEvaluations.length - eligibleOffers.length,
    disclaimer: OFFER_DISCLAIMER,
  };
}
