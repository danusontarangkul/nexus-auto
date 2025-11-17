import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  isIdentityOwnerOfVehicle,
  validateReceipt,
  validateServiceRecord,
  validateVehicle,
} from "./utils/validation";
import { internal } from "./_generated/api";
import { getCurrentUser } from "./utils/auth";
import { ServiceRecordWithReceipts } from "types";

export const getServiceRecordsByVehicleId = query({
  args: {
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<"serviceRecords">[]> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    return await ctx.db
      .query("serviceRecords")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", vehicleId))
      .order("desc")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const insertServiceRecord = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    serviceRecord: v.object({
      isActive: v.boolean(),
      performed: v.array(
        v.object({
          category: v.string(),
          cost: v.optional(v.number()),
          name: v.string(),
          notes: v.optional(v.string()),
          warrantyId: v.optional(v.id("warranties")),
          templateItemId: v.optional(v.id("maintenanceItems")),
        })
      ),
      serviceCenter: v.optional(v.string()),
      serviceDate: v.number(),
      receiptIds: v.optional(v.array(v.id("receipts"))),
    }),
  },
  handler: async (
    ctx,
    { vehicleId, serviceRecord }
  ): Promise<Id<"serviceRecords">> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    const serviceRecordId = await ctx.db.insert("serviceRecords", {
      isActive: serviceRecord.isActive,
      performed: serviceRecord.performed.map((performed) => ({
        ...performed,
        notes: performed.notes ?? null,
        cost: performed.cost ?? null,
      })),
      serviceCenter: serviceRecord.serviceCenter ?? null,
      serviceDate: serviceRecord.serviceDate,
      vehicleId,
      updatedAt: Date.now(),
    });

    if (serviceRecord.receiptIds) {
      for (const receiptId of serviceRecord.receiptIds) {
        validateReceipt(await ctx.db.get(receiptId));
      }
    }

    if (serviceRecord.receiptIds) {
      await Promise.all(
        serviceRecord.receiptIds.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: { serviceRecordId },
          })
        )
      );
    }

    await ctx.runMutation(internal.maintenanceItems.updateFromServiceRecord, {
      vehicleId,
      serviceRecordId,
      serviceDate: serviceRecord.serviceDate,
      performedItems: serviceRecord.performed,
    });
    return serviceRecordId;
  },
});

export const updateServiceRecord = mutation({
  args: {
    serviceRecordId: v.id("serviceRecords"),
    updates: v.object({
      isActive: v.optional(v.boolean()),
      performed: v.optional(
        v.array(
          v.object({
            category: v.string(),
            cost: v.optional(v.number()),
            name: v.string(),
            notes: v.optional(v.string()),
            warrantyId: v.optional(v.id("warranties")),
            templateItemId: v.optional(v.id("maintenanceItems")),
          })
        )
      ),
      serviceCenter: v.optional(v.string()),
      serviceDate: v.optional(v.number()),
      receiptIds: v.optional(v.array(v.id("receipts"))),
      receiptIdsToRemove: v.optional(v.array(v.id("receipts"))),
    }),
  },
  handler: async (ctx, { serviceRecordId, updates }): Promise<boolean> => {
    const user = await getCurrentUser(ctx);

    const serviceRecord = validateServiceRecord(
      await ctx.db.get(serviceRecordId)
    );
    isIdentityOwnerOfVehicle(user._id, serviceRecord.vehicleId);

    await ctx.db.patch(serviceRecordId, {
      ...updates,
      performed: updates.performed?.map((performed) => ({
        ...performed,
        notes: performed.notes ?? null,
        cost: performed.cost ?? null,
      })),
      serviceCenter: updates.serviceCenter ?? null,
      serviceDate: updates.serviceDate ?? undefined,
      updatedAt: Date.now(),
    });

    if (updates.receiptIds) {
      for (const receiptId of updates.receiptIds) {
        validateReceipt(await ctx.db.get(receiptId));
      }
    }

    if (updates.receiptIdsToRemove) {
      for (const receiptId of updates.receiptIdsToRemove) {
        validateReceipt(await ctx.db.get(receiptId));
      }
    }

    if (updates.receiptIds) {
      await Promise.all(
        updates.receiptIds.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: { serviceRecordId },
          })
        )
      );
    }
    if (updates.receiptIdsToRemove) {
      await Promise.all(
        updates.receiptIdsToRemove.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: { serviceRecordId: undefined },
          })
        )
      );
    }
    if (updates.performed || updates.serviceDate !== undefined) {
      const finalRecord = await ctx.db.get(serviceRecordId);
      if (!finalRecord) {
        return true;
      }
      await ctx.runMutation(internal.maintenanceItems.updateFromServiceRecord, {
        vehicleId: finalRecord.vehicleId,
        serviceRecordId,
        serviceDate: updates.serviceDate ?? finalRecord.serviceDate,
        performedItems: updates.performed ?? finalRecord.performed,
      });
    }

    return true;
  },
});

export const getServiceRecordById = query({
  args: {
    serviceRecordId: v.id("serviceRecords"),
  },
  handler: async (
    ctx,
    { serviceRecordId }
  ): Promise<ServiceRecordWithReceipts> => {
    const user = await getCurrentUser(ctx);

    const serviceRecord = validateServiceRecord(
      await ctx.db.get(serviceRecordId)
    );
    isIdentityOwnerOfVehicle(user._id, serviceRecord.vehicleId);

    const receipts = await ctx.runQuery(
      internal.receipts.getReceiptByServiceRecordIdInternal,
      { serviceRecordId }
    );

    return { serviceRecord, receipts };
  },
});
