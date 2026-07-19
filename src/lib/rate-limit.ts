// In-memory rate limiting map.
// Note: In a true multi-server environment (like Vercel), this only limits per-instance.
// For strict global rate limiting, use Redis (e.g. Upstash). This provides basic protection.

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();

  // Lazy cleanup (prevents memory leaks)
  if (now - lastCleanup > windowMs * 2) {
    lastCleanup = now;
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}
