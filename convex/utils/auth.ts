import { ConvexError } from "convex/values";
import { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { validateUser } from "./validation";
import { Doc } from "../_generated/dataModel";

export async function getRevenueCatId(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    throw new ConvexError({
      code: "unauthenticated",
      message: "Please restart the app or restore purchases.",
    });
  }

  return identity.subject;
}

export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<Doc<"users">> {
  const revenueCatId = await getRevenueCatId(ctx);

  return validateUser(
    await ctx.runQuery(internal.users.getUserByRevenueCatIdInternal, {
      revenueCatId,
    })
  );
}
