import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import {
  isIdentityOwnerOfVehicle,
  validateInsurance,
  validateVehicle,
} from "./utils/validation";
import { getCurrentUser } from "./utils/auth";
import { InsuranceWithReceipts } from "types";

export const getInsuranceWithReceiptsByVehicleId = query({
  args: {
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, { vehicleId }): Promise<InsuranceWithReceipts> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    const insurance = validateInsurance(
      await ctx.runQuery(internal.insurance.getInsuranceByVehicleIdInternal, {
        vehicleId,
      })
    );

    const receipts = await ctx.runQuery(
      internal.receipts.getReceiptByInsuranceIdInternal,
      { insuranceId: insurance._id }
    );

    return { insurance, receipts };
  },
});

export const getInsuranceByVehicleIdInternal = internalQuery({
  args: {
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<"insurance"> | null> => {
    return await ctx.db
      .query("insurance")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", vehicleId))
      .first();
  },
});

export const upsertInsurance = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    expiresAt: v.number(),
    receiptIds: v.array(v.id("receipts")),
    receiptIdsToRemove: v.array(v.id("receipts")),
    name: v.string(),
  },
  handler: async (
    ctx,
    { vehicleId, expiresAt, receiptIds, receiptIdsToRemove, name }
  ): Promise<boolean> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    const insurance = await ctx.runQuery(
      internal.insurance.getInsuranceByVehicleIdInternal,
      { vehicleId }
    );

    let insuranceId: Id<"insurance"> | null = insurance?._id ?? null;

    if (insurance) {
      await ctx.db.patch(insurance._id, {
        expiresAt,
        name,
        updatedAt: Date.now(),
      });
    } else {
      insuranceId = await ctx.db.insert("insurance", {
        vehicleId,
        expiresAt,
        name,
        updatedAt: Date.now(),
      });
    }

    if (receiptIds && receiptIds.length > 0 && insuranceId) {
      await Promise.all(
        receiptIds.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: {
              insuranceId,
            },
          })
        )
      );
    }

    if (receiptIdsToRemove && receiptIdsToRemove.length > 0) {
      await Promise.all(
        receiptIdsToRemove.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: {
              insuranceId: undefined,
            },
          })
        )
      );
    }

    return true;
  },
});
