import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = process.env;

async function loadSiteModule() {
  vi.resetModules();
  return import("@/lib/site");
}

describe("site URL resolution", () => {
  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.resetModules();
  });

  it("uses production origin when no public site URL is configured", async () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_SITE_URL: "" };
    const { getSiteUrl } = await loadSiteModule();

    expect(getSiteUrl()).toBe("https://smartnivad.vercel.app");
  });

  it("normalizes configured URLs to their origin", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SITE_URL: "https://example.com/deals?utm=test",
    };
    const { getSiteUrl } = await loadSiteModule();

    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("falls back to production origin for invalid URLs", async () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_SITE_URL: "not a url" };
    const { getSiteUrl } = await loadSiteModule();

    expect(getSiteUrl()).toBe("https://smartnivad.vercel.app");
  });
});
