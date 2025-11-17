import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { CheckOrRestoreSubscriptionResult } from "types";
import { fetchCustomerInfo } from "./functions/revenueCat";

export const startYearlySubscription = action({
  args: {
    promoCode: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { promoCode }
  ): Promise<{
    success: boolean;
    message?: string;
    appUserId: string;
    offeredPromoCode?: string;
  }> => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthenticated");

    let validatedPromo: string | undefined = undefined;

    if (promoCode) {
      const result = (await ctx.runAction(api.revenueCat.validatePromoCode, {
        promoCode,
      })) as ValidatePromoCodeResult;

      if (result.valid) {
        validatedPromo = promoCode.trim().toUpperCase();
      }
    }

    return {
      success: true,
      message: validatedPromo
        ? "Promo code applied – ready to purchase!"
        : "Ready to purchase",
      appUserId: user.subject,
      offeredPromoCode: validatedPromo,
    };
  },
});

const VALID_CODES: Record<string, { discount: string }> = {
  FREEYEAR: { discount: "First year free" },
};

export type ValidatePromoCodeResult =
  | { valid: true; discount: string }
  | { valid: false; message: string };

export const validatePromoCode = action({
  args: { promoCode: v.string() },
  handler: async (_ctx, { promoCode }): Promise<ValidatePromoCodeResult> => {
    const code = promoCode.trim().toUpperCase();
    if (VALID_CODES[code]) {
      return { valid: true, discount: VALID_CODES[code].discount };
    }
    return { valid: false, message: "Invalid or expired code" };
  },
});

export const checkOrRestoreSubscription = action({
  args: { revenueCatAppUserId: v.string() },
  handler: async (
    ctx,
    { revenueCatAppUserId }
  ): Promise<CheckOrRestoreSubscriptionResult> => {
    const customerInfo = await fetchCustomerInfo(revenueCatAppUserId);

    const user = await ctx.runQuery(
      internal.users.getUserByRevenueCatIdInternal,
      {
        revenueCatId: revenueCatAppUserId,
      }
    );

    const proEntitlement = customerInfo.subscriber.entitlements.pro;
    const hasActiveSubscription = proEntitlement?.is_active === true;
    const expiresAt = proEntitlement?.expires_date
      ? new Date(proEntitlement.expires_date).getTime()
      : undefined;

    await ctx.runMutation(internal.users.updateUser, {
      userId: user._id,
      updates: {
        hasPaid: hasActiveSubscription,
        expiresAt: expiresAt ?? null,
      },
    });

    return {
      success: true,
      hasActiveSubscription,
      expiresAt,
      message: hasActiveSubscription
        ? "You have an active Pro subscription"
        : "No active Pro subscription found",
    };
  },
});
