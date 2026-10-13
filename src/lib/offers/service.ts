import { prisma } from "@/lib/prisma";
import { calculateBestCardOffer } from "./calculator";
import { BankOfferData, BestOfferResult, ProductOfferContext } from "./types";

/**
 * Standard default fallback bank offers for India tech & electronics deals
 * Used if no custom offers are yet seeded in the database.
 */
const DEFAULT_BANK_OFFERS: BankOfferData[] = [
  {
    id: "default-amazon-icici",
    bankName: "Amazon Pay ICICI",
    cardName: "Amazon Pay Credit Card",
    cardType: "CREDIT",
    offerType: "CASHBACK",
    discountType: "PERCENTAGE",
    discountValue: 5,
    maxDiscountCap: null,
    minSpend: 1000,
    eligibleStores: ["Amazon", "All"],
    verificationStatus: "VERIFIED",
    active: true,
  },
  {
    id: "default-hdfc-millennia",
    bankName: "HDFC Bank",
    cardName: "Millennia / Regalia Credit Cards",
    cardType: "CREDIT",
    offerType: "INSTANT_DISCOUNT",
    discountType: "PERCENTAGE",
    discountValue: 10,
    maxDiscountCap: 1500,
    minSpend: 5000,
    eligibleStores: ["Amazon", "Flipkart", "All"],
    verificationStatus: "VERIFIED",
    active: true,
  },
  {
    id: "default-sbi-simplyclick",
    bankName: "SBI Card",
    cardName: "SimplyCLICK / Cashback Credit Card",
    cardType: "CREDIT",
    offerType: "INSTANT_DISCOUNT",
    discountType: "PERCENTAGE",
    discountValue: 10,
    maxDiscountCap: 1250,
    minSpend: 4000,
    eligibleStores: ["Amazon", "Flipkart", "All"],
    verificationStatus: "VERIFIED",
    active: true,
  },
  {
    id: "default-flipkart-axis",
    bankName: "Axis Bank",
    cardName: "Flipkart Axis Bank Card",
    cardType: "CREDIT",
    offerType: "CASHBACK",
    discountType: "PERCENTAGE",
    discountValue: 5,
    maxDiscountCap: null,
    minSpend: 500,
    eligibleStores: ["Flipkart", "All"],
    verificationStatus: "VERIFIED",
    active: true,
  },
];

export async function getApplicableOffersForProduct(
  context: ProductOfferContext,
): Promise<BestOfferResult> {
  try {
    const dbOffers = await prisma.bankOffer.findMany({
      where: {
        active: true,
        verificationStatus: "VERIFIED",
      },
    });

    const offerList: BankOfferData[] =
      dbOffers && dbOffers.length > 0
        ? (dbOffers as unknown as BankOfferData[])
        : DEFAULT_BANK_OFFERS;

    return calculateBestCardOffer(offerList, context);
  } catch {
    // If DB is offline, fall back to default verified rules
    return calculateBestCardOffer(DEFAULT_BANK_OFFERS, context);
  }
}
