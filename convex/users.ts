import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { validateUser } from "./utils/validation";
import { getCurrentUser } from "./utils/auth";

export const getUserById = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users">> => {
    const user = await getCurrentUser(ctx);

    return user;
  },
});

export const getUserByRevenueCatIdInternal = internalQuery({
  args: {
    revenueCatId: v.string(),
  },
  handler: async (ctx, { revenueCatId }): Promise<Doc<"users"> | null> => {
    return await ctx.db
      .query("users")
      .withIndex("by_revenue_cat_id", (q) => q.eq("revenueCatId", revenueCatId))
      .first();
  },
});

export const insertUser = internalMutation({
  args: {
    email: v.string(),
    expiresAt: v.number(),
    hasPaid: v.boolean(),
    revenueCatId: v.string(),
  },
  handler: async (
    ctx,
    { email, expiresAt, hasPaid, revenueCatId }
  ): Promise<Id<"users">> => {
    return await ctx.db.insert("users", {
      email,
      expiresAt,
      hasPaid,
      revenueCatId,
      updatedAt: Date.now(),
    });
  },
});

export const updateUser = internalMutation({
  args: {
    userId: v.id("users"),
    updates: v.object({
      expiresAt: v.optional(v.number()),
      hasPaid: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { userId, updates }): Promise<void> => {
    validateUser(await ctx.db.get(userId));

    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
