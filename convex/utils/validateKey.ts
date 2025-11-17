import { ConvexError } from "convex/values";

export function getOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new ConvexError({
      code: "internal_error",
      message: "OPENAI_API_KEY is not configured in Convex environment",
    });
  }
  return key;
}

export function getRevenueCatSecret(): string {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) {
    throw new ConvexError({
      code: "internal_error",
      message:
        "REVENUECAT_WEBHOOK_SECRET is not configured in Convex environment",
    });
  }
  return secret;
}

export function getRevenueCatApiKey(): string {
  const apiKey = process.env.REVENUECAT_API_KEY;
  if (!apiKey) {
    throw new ConvexError({
      code: "internal_error",
      message: "REVENUECAT_API_KEY is not configured in Convex environment",
    });
  }
  return apiKey;
}
