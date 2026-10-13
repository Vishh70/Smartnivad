export type BankOfferTypeEnum =
  | "INSTANT_DISCOUNT"
  | "COUPON"
  | "CASHBACK"
  | "EMI_OFFER";

export type DiscountValueTypeEnum = "PERCENTAGE" | "FIXED";

export type CardTypeEnum = "CREDIT" | "DEBIT" | "ALL";

export type OfferVerificationStatusEnum = "VERIFIED" | "UNVERIFIED" | "EXPIRED";

export interface BankOfferData {
  id: string;
  bankName: string;
  cardName: string;
  cardType?: CardTypeEnum;
  offerType: BankOfferTypeEnum;
  discountType: DiscountValueTypeEnum;
  discountValue: number;
  maxDiscountCap?: number | null;
  minSpend?: number;
  eligibleStores?: string[];
  eligibleCategories?: string[];
  paymentMethods?: string[];
  emiTenureMonths?: number | null;
  emiInterestRate?: number | null; // Annual interest percentage, e.g. 14 or 0 for No Cost EMI
  emiProcessingFee?: number | null; // Fixed processing fee e.g. 199 (GST applicable in checkout)
  stackable?: boolean;
  termsUrl?: string | null;
  termsSummary?: string | null;
  source?: string | null;
  verificationStatus: OfferVerificationStatusEnum;
  lastVerifiedAt?: Date | string;
  startDate?: Date | string;
  endDate?: Date | string | null;
  active?: boolean;
}

export interface OfferEvaluation {
  offer: BankOfferData;
  isEligible: boolean;
  rejectionReason?: string;
  discountAmount: number; // Instant discount deducted immediately at checkout
  cashbackAmount: number; // Cashback credited to card account later (distinct from instant)
  immediatePayablePrice: number; // Price charged immediately at payment gateway
  effectivePrice: number; // Estimated final cost taking into account cashback, EMI interest & fees
  monthlyEmi?: number;
  emiTotalInterest?: number;
  emiProcessingFee?: number;
  totalSavings: number;
  breakdown: string;
}

export interface BestOfferResult {
  bestOffer: OfferEvaluation | null;
  allEvaluations: OfferEvaluation[];
  eligibleCount: number;
  ineligibleCount: number;
  disclaimer: string;
}

export interface ProductOfferContext {
  price: number;
  storeName?: string;
  categorySlug?: string;
  currentDate?: Date;
}
