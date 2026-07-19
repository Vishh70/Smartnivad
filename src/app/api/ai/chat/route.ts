import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";

// Simple in-memory rate limiting per session
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

let lastCleanup = Date.now();

function checkRateLimit(sessionId: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  
  // Lazy cleanup instead of setInterval (prevents serverless memory leaks)
  if (now - lastCleanup > 300000) {
    lastCleanup = now;
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt + 300000) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return { allowed: true };
  }

  if (entry.count >= 10) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

const SYSTEM_PROMPT = `You are SmartNivad, a helpful shopping assistant.

Recommend products only from deals available inside SmartNivad.

Prioritize:
- Lowest price
- Highest ratings
- Trusted brands
- Best value for money

Keep answers concise and helpful.

Always include when recommending:
- Product Name
- Current Price
- Discount
- Why it is recommended

If you don't know about a specific product, suggest the user browse the deals page.`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      message?: unknown;
      sessionId?: unknown;
    };
    const { message, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Rate limiting
    const sid = typeof sessionId === "string" ? sessionId : "anonymous";
    const rateCheck = checkRateLimit(sid);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message: `You're sending messages too quickly! Please wait ${rateCheck.retryAfter} seconds.`,
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 },
      );
    }

    const response = await generateWithFallback(message, false, SYSTEM_PROMPT);

    return NextResponse.json({ response });
  } catch (error: unknown) {
    console.error(
      "[AI Chat] Error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "ai_error",
        message:
          "I'm having trouble thinking right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
