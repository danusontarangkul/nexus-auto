import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";

type RevenueCatEvent = {
  app_user_id: string;
  event?: {
    expiration_at_ms?: number;
  };
  expiration_at_ms?: number;
};

export const handleInitialPurchase = async (
  ctx: ActionCtx,
  event: RevenueCatEvent
) => {
  const revenueCatId = event.app_user_id;
  const expiresAt =
    event.event?.expiration_at_ms ?? event.expiration_at_ms ?? 0;

  if (!revenueCatId) {
    return;
  }

  const user = await ctx.runQuery(
    internal.users.getUserByRevenueCatIdInternal,
    {
      revenueCatId,
    }
  );

  if (!user) {
    await ctx.runMutation(internal.users.insertUser, {
      email: "",
      revenueCatId,
      expiresAt,
      hasPaid: true,
    });
  } else {
    await ctx.runMutation(internal.users.updateUser, {
      userId: user._id,
      updates: {
        hasPaid: true,
        expiresAt,
      },
    });
  }
};

export const handleRenewedSubscription = async (
  ctx: ActionCtx,
  event: RevenueCatEvent
) => {
  const revenueCatId = event.app_user_id;
  const expiresAt =
    event.event?.expiration_at_ms ?? event.expiration_at_ms ?? 0;

  if (!revenueCatId) {
    return;
  }

  const user = await ctx.runQuery(
    internal.users.getUserByRevenueCatIdInternal,
    {
      revenueCatId,
    }
  );

  if (user) {
    await ctx.runMutation(internal.users.updateUser, {
      userId: user._id,
      updates: {
        hasPaid: true,
        expiresAt,
      },
    });
  }
};

export const handleExpiration = async (
  ctx: ActionCtx,
  event: RevenueCatEvent
) => {
  const revenueCatId = event.app_user_id;

  if (!revenueCatId) {
    return;
  }

  const user = await ctx.runQuery(
    internal.users.getUserByRevenueCatIdInternal,
    {
      revenueCatId,
    }
  );

  if (user) {
    await ctx.runMutation(internal.users.updateUser, {
      userId: user._id,
      updates: {
        hasPaid: false,
        expiresAt: 0,
      },
    });
  }
};
