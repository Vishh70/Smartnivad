import { ContentStatus } from "@prisma/client";

const VALID_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  DRAFT: ["IN_REVIEW"],
  IN_REVIEW: ["DRAFT", "APPROVED"],
  APPROVED: ["PUBLISHED"],
  PUBLISHED: [],
};

export function canTransitionContentStatus(
  currentStatus: ContentStatus,
  targetStatus: ContentStatus,
): boolean {
  return VALID_TRANSITIONS[currentStatus]?.includes(targetStatus) ?? false;
}
