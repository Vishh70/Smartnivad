import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";

// Simple in-memory rate limiting per session
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(sessionId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
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

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetAt + 300000) rateLimitMap.delete(key);
  }
}, 300000);

const SYSTEM_PROMPT = `You are TechDeals AI, a helpful shopping assistant.

Recommend products only from deals available inside TechDeals AI.

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
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Rate limiting
    const sid = sessionId || "anonymous";
    const rateCheck = checkRateLimit(sid);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message: `You're sending messages too quickly! Please wait ${rateCheck.retryAfter} seconds.`,
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`;
    const response = await generateWithFallback(prompt, false);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("[AI Chat] Error:", error.message);
    return NextResponse.json(
      { error: "ai_error", message: "I'm having trouble thinking right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
