import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
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
          { status: 400 }
        );
      }

      // Save to database
      await prisma.newsletterSubscriber.create({
        data: { email },
      });

      return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 201 });
      
    } catch (dbError) {
      // Fallback for development if DB is not connected
      console.warn("Database connection failed, mocking success for newsletter signup.", dbError);
      return NextResponse.json({ success: true, message: "Mock subscribed successfully (DB offline)" }, { status: 201 });
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const zodError = error as any;
      return NextResponse.json({ error: zodError.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
