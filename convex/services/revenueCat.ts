import { ConvexError } from "convex/values";
import { getRevenueCatApiKey } from "../utils/validateKey";

const REVENUECAT_API_URL = "https://api.revenuecat.com/v1/subscribers";

export async function fetchCustomerInfo(
  revenueCatAppUserId: string
): Promise<any> {
  const apiKey = getRevenueCatApiKey();
  try {
    const response = await fetch(
      `${REVENUECAT_API_URL}/${revenueCatAppUserId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`RevenueCat API error ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[Subscription] Failed to fetch from RevenueCat:", error);
    throw new ConvexError({
      code: "internal_error",
      message: "Failed to fetch from RevenueCat",
    });
  }
}
