import { ConvexError } from "convex/values";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const UPLOADS_PER_MINUTE = 4;

export async function enforceReceiptUploadRateLimit(
  ctx: ActionCtx,
  userId: Id<"users">
): Promise<void> {
  const oneMinuteAgo = Date.now() - 60_000;

  const count = await ctx.runQuery(internal.receipts.countUserUploadsSince, {
    userId,
    since: oneMinuteAgo,
  });

  if (count >= UPLOADS_PER_MINUTE) {
    throw new ConvexError({
      code: "rate_limit_exceeded",
      message: "Too many uploads. Please wait a moment.",
    });
  }
}
