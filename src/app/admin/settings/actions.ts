"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function changePassword(
  newPassword: string,
  confirmPassword: string,
) {
  const admin = await requireAdmin();
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // For Super Admin fallback, upsert into Admin table
  if (admin.email === "admin@smartnivad.com") {
    await prisma.admin.upsert({
      where: { email: "admin@smartnivad.com" },
      update: { password: hashedPassword },
      create: {
        email: "admin@smartnivad.com",
        name: "Super Admin",
        password: hashedPassword,
      },
    });
  } else {
    await prisma.admin.update({
      where: { email: admin.email },
      data: { password: hashedPassword },
    });
  }

  return { success: true };
}

export async function updateSetting(key: string, value: string) {
  await requireAdmin();
  await prisma.platformSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return { success: true };
}

export async function clearCache() {
  await requireAdmin();
  revalidatePath("/", "layout");
  return { success: true };
}

export async function triggerManualScrape() {
  await requireAdmin();
  // Simulate manual scrape trigger
  await new Promise((r) => setTimeout(r, 2000));
  return { success: true };
}

export async function addAdmin(email: string, name: string) {
  await requireAdmin();
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Admin already exists");
  }

  await prisma.admin.create({
    data: {
      email,
      name,
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function removeAdmin(id: string) {
  await requireAdmin();

  const adminToRemove = await prisma.admin.findUnique({ where: { id } });
  if (!adminToRemove) {
    throw new Error("Admin not found");
  }

  if (adminToRemove.email === "admin@smartnivad.com") {
    throw new Error("Cannot remove the Super Admin");
  }

  await prisma.admin.delete({ where: { id } });

  revalidatePath("/admin/settings");
  return { success: true };
}
