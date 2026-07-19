import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateCheck = checkRateLimit(`newsletter_${ip}`, 5, 60000); // 5 per minute
    
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${rateCheck.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = subscribeSchema.parse(body);

    try {
      // Check if email already exists
      const existing = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Email already subscribed" },
          { status: 400 },
        );
      }

      // Save to database
      await prisma.newsletterSubscriber.create({
        data: { email },
      });

      return NextResponse.json(
        { success: true, message: "Subscribed successfully" },
        { status: 201 },
      );
    } catch (dbError) {
      console.error(
        "Database connection failed while saving newsletter subscriber.",
        dbError,
      );
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        { status: 500 },
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
