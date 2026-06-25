import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatCurrency, formatNumber, formatRelativeTime } from "@/lib/format";

describe("format utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-25T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats INR currency without fractional digits", () => {
    expect(formatCurrency(129999)).toBe("₹1,29,999");
  });

  it("formats Indian digit grouping for plain numbers", () => {
    expect(formatNumber(12345678)).toBe("1,23,45,678");
  });

  it("formats recent timestamps in minutes, hours, and days", () => {
    expect(formatRelativeTime(new Date("2026-06-25T11:45:00.000Z"))).toBe(
      "15 min ago",
    );
    expect(formatRelativeTime(new Date("2026-06-25T09:00:00.000Z"))).toBe(
      "3 hr ago",
    );
    expect(formatRelativeTime(new Date("2026-06-24T12:00:00.000Z"))).toBe(
      "1 day ago",
    );
    expect(formatRelativeTime(new Date("2026-06-23T12:00:00.000Z"))).toBe(
      "2 days ago",
    );
  });
});
