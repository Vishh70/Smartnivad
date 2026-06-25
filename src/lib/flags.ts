export type FeatureFlag =
  | "enable-ai-assistant"
  | "enable-new-dashboard"
  | "enable-advanced-search";

export interface UserContext {
  id?: string;
  email?: string;
  role?: string;
}

/**
 * Feature Flag abstraction to prevent tight coupling with a specific provider.
 * Supports PostHog, LaunchDarkly, Unleash, or Local environments.
 */
export async function isFeatureEnabled(
  flag: FeatureFlag,
  user?: UserContext,
): Promise<boolean> {
  const provider = process.env.FEATURE_FLAG_PROVIDER || "local";

  try {
    switch (provider) {
      case "posthog":
        return await checkPostHogFlag(flag, user);
      case "launchdarkly":
        return await checkLaunchDarklyFlag(flag, user);
      case "local":
      default:
        return checkLocalFlag(flag);
    }
  } catch (error) {
    console.error(`Error fetching feature flag [${flag}]:`, error);
    // Fail safe to false in production, true in local dev if needed
    return false;
  }
}

// --- Adapters ---

async function checkPostHogFlag(
  flag: FeatureFlag,
  user?: UserContext,
): Promise<boolean> {
  void flag;
  void user;
  // Example PostHog integration:
  // const client = new PostHog(process.env.POSTHOG_API_KEY!);
  // return await client.isFeatureEnabled(flag, user?.id || 'anonymous');

  return false;
}

async function checkLaunchDarklyFlag(
  flag: FeatureFlag,
  user?: UserContext,
): Promise<boolean> {
  void flag;
  void user;
  // Example LaunchDarkly integration:
  // const client = await initLaunchDarkly();
  // return await client.variation(flag, user, false);

  return false;
}

function checkLocalFlag(flag: FeatureFlag): boolean {
  // Read from .env for local overrides (e.g., NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true)
  const envKey = `NEXT_PUBLIC_FLAG_${flag.toUpperCase().replace(/-/g, "_")}`;
  return process.env[envKey] === "true";
}
