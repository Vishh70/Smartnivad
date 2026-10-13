"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  BankOfferType,
  DiscountValueType,
  CardType,
  OfferVerificationStatus,
} from "@prisma/client";

export async function createBankOfferAction(formData: FormData) {
  await requireAdmin();

  const bankName = (formData.get("bankName") as string)?.trim();
  const cardName = (formData.get("cardName") as string)?.trim();
  const cardType = (formData.get("cardType") as CardType) || CardType.CREDIT;
  const offerType =
    (formData.get("offerType") as BankOfferType) ||
    BankOfferType.INSTANT_DISCOUNT;
  const discountType =
    (formData.get("discountType") as DiscountValueType) ||
    DiscountValueType.PERCENTAGE;
  const discountValue = parseFloat(formData.get("discountValue") as string);
  const maxDiscountCap = formData.get("maxDiscountCap")
    ? parseFloat(formData.get("maxDiscountCap") as string)
    : null;
  const minSpend = parseFloat((formData.get("minSpend") as string) || "0");
  const eligibleStoresRaw =
    (formData.get("eligibleStores") as string) || "Amazon, Flipkart";
  const eligibleCategoriesRaw =
    (formData.get("eligibleCategories") as string) || "ALL";
  const emiTenureMonths = formData.get("emiTenureMonths")
    ? parseInt(formData.get("emiTenureMonths") as string, 10)
    : null;
  const emiInterestRate = formData.get("emiInterestRate")
    ? parseFloat(formData.get("emiInterestRate") as string)
    : null;
  const emiProcessingFee = formData.get("emiProcessingFee")
    ? parseFloat(formData.get("emiProcessingFee") as string)
    : null;
  const stackable = formData.get("stackable") === "on";
  const termsUrl = formData.get("termsUrl") as string;
  const termsSummary = formData.get("termsSummary") as string;
  const source = (formData.get("source") as string) || "Bank Promotion Feed";
  const startDate = formData.get("startDate")
    ? new Date(formData.get("startDate") as string)
    : new Date();
  const endDate = formData.get("endDate")
    ? new Date(formData.get("endDate") as string)
    : null;

  if (!bankName || !cardName || isNaN(discountValue) || discountValue <= 0) {
    throw new Error(
      "Bank name, card name, and positive discount value are required",
    );
  }

  const eligibleStores = eligibleStoresRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const eligibleCategories = eligibleCategoriesRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const offer = await prisma.bankOffer.create({
    data: {
      bankName,
      cardName,
      cardType,
      offerType,
      discountType,
      discountValue,
      maxDiscountCap,
      minSpend,
      eligibleStores,
      eligibleCategories,
      emiTenureMonths,
      emiInterestRate,
      emiProcessingFee,
      stackable,
      termsUrl: termsUrl || null,
      termsSummary: termsSummary || null,
      source,
      verificationStatus: OfferVerificationStatus.VERIFIED,
      lastVerifiedAt: new Date(),
      startDate,
      endDate,
      active: true,
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/bank-offers",
  );
  return { success: true, offer };
}

export async function verifyBankOfferAction(offerId: string) {
  await requireAdmin();
  await prisma.bankOffer.update({
    where: { id: offerId },
    data: {
      verificationStatus: OfferVerificationStatus.VERIFIED,
      lastVerifiedAt: new Date(),
      active: true,
    },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/bank-offers",
  );
  return { success: true };
}

export async function toggleBankOfferStatusAction(
  offerId: string,
  active: boolean,
) {
  await requireAdmin();
  await prisma.bankOffer.update({
    where: { id: offerId },
    data: { active },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/bank-offers",
  );
  return { success: true };
}

export async function deleteBankOfferAction(offerId: string) {
  await requireAdmin();
  await prisma.bankOffer.delete({
    where: { id: offerId },
  });

  revalidatePath(
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/bank-offers",
  );
  return { success: true };
}
