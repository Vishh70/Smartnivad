"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleSavedDeal(dealId: string) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return { success: false, error: "You must be logged in to save deals." };
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_dealId: {
          userId: user.id,
          dealId: dealId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      revalidatePath("/");
      revalidatePath("/profile");
      return { success: true, saved: false };
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          dealId: dealId,
        },
      });
      revalidatePath("/");
      revalidatePath("/profile");
      return { success: true, saved: true };
    }
  } catch (error: unknown) {
    console.error("Toggle saved deal error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function subscribeToNewsletter(
  prevState: { success: boolean; message: string } | null,
  formData: FormData,
) {
  try {
    const email = formData.get("email");
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return {
        success: false,
        message: "Please provide a valid email address.",
      };
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.active) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { active: true },
        });
        return {
          success: true,
          message: "Welcome back! You've been resubscribed.",
        };
      }
      return {
        success: false,
        message: "You are already subscribed to the newsletter!",
      };
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        source: "footer_form",
      },
    });

    return {
      success: true,
      message: "Thanks for subscribing! We'll send you the best deals.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "An error occurred while subscribing. Please try again.",
    };
  }
}
