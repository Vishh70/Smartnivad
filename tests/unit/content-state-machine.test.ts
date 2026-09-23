import { describe, it, expect } from "vitest";
import { canTransitionContentStatus } from "../../src/lib/content/state-machine";
import { ContentStatus } from "@prisma/client";

describe("canTransitionContentStatus", () => {
  it("allows DRAFT -> IN_REVIEW", () => {
    expect(
      canTransitionContentStatus(ContentStatus.DRAFT, ContentStatus.IN_REVIEW),
    ).toBe(true);
  });

  it("rejects DRAFT -> APPROVED", () => {
    expect(
      canTransitionContentStatus(ContentStatus.DRAFT, ContentStatus.APPROVED),
    ).toBe(false);
  });

  it("rejects DRAFT -> PUBLISHED", () => {
    expect(
      canTransitionContentStatus(ContentStatus.DRAFT, ContentStatus.PUBLISHED),
    ).toBe(false);
  });

  it("allows IN_REVIEW -> DRAFT", () => {
    expect(
      canTransitionContentStatus(ContentStatus.IN_REVIEW, ContentStatus.DRAFT),
    ).toBe(true);
  });

  it("allows IN_REVIEW -> APPROVED", () => {
    expect(
      canTransitionContentStatus(
        ContentStatus.IN_REVIEW,
        ContentStatus.APPROVED,
      ),
    ).toBe(true);
  });

  it("rejects IN_REVIEW -> PUBLISHED", () => {
    expect(
      canTransitionContentStatus(
        ContentStatus.IN_REVIEW,
        ContentStatus.PUBLISHED,
      ),
    ).toBe(false);
  });

  it("allows APPROVED -> PUBLISHED", () => {
    expect(
      canTransitionContentStatus(
        ContentStatus.APPROVED,
        ContentStatus.PUBLISHED,
      ),
    ).toBe(true);
  });

  it("rejects APPROVED -> DRAFT", () => {
    expect(
      canTransitionContentStatus(ContentStatus.APPROVED, ContentStatus.DRAFT),
    ).toBe(false);
  });

  it("rejects PUBLISHED -> anything", () => {
    expect(
      canTransitionContentStatus(ContentStatus.PUBLISHED, ContentStatus.DRAFT),
    ).toBe(false);
    expect(
      canTransitionContentStatus(
        ContentStatus.PUBLISHED,
        ContentStatus.IN_REVIEW,
      ),
    ).toBe(false);
    expect(
      canTransitionContentStatus(
        ContentStatus.PUBLISHED,
        ContentStatus.APPROVED,
      ),
    ).toBe(false);
  });
});
