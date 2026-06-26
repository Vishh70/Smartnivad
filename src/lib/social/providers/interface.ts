import { Deal, SocialPostQueue } from "@prisma/client";

export interface ProviderResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface SocialProvider {
  /**
   * Publishes a deal to the social platform.
   */
  publish(deal: Deal, job: SocialPostQueue): Promise<ProviderResult>;
}
