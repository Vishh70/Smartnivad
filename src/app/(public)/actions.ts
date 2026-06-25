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
  } catch (error: any) {
    console.error("Toggle saved deal error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
