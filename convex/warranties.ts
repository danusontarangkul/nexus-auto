import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { internal } from './_generated/api';
import {
  isIdentityOwnerOfVehicle,
  validateReceipt,
  validateVehicle,
  validateWarranty,
} from './utils/validation';
import { getCurrentUser } from './utils/auth';
import { WarrantyWithReceipts } from './types';

export const getWarrantiesByVehicleId = query({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<'warranties'>[]> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    return await ctx.db
      .query('warranties')
      .withIndex('by_vehicle', (q) => q.eq('vehicleId', vehicleId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .order('desc')
      .collect();
  },
});

export const getWarrantyById = query({
  args: {
    warrantyId: v.id('warranties'),
  },
  handler: async (ctx, { warrantyId }): Promise<WarrantyWithReceipts> => {
    const user = await getCurrentUser(ctx);

    const warranty = validateWarranty(await ctx.db.get(warrantyId));
    isIdentityOwnerOfVehicle(user._id, warranty.vehicleId);

    const receipts = await ctx.runQuery(
      internal.receipts.getReceiptByWarrantyIdInternal,
      { warrantyId },
    );
    return { warranty, receipts };
  },
});

export const insertWarranty = mutation({
  args: {
    vehicleId: v.id('vehicles'),
    expiresAt: v.number(),
    manufacturer: v.string(),
    receiptIds: v.array(v.id('receipts')),
  },
  handler: async (
    ctx,
    { vehicleId, expiresAt, manufacturer, receiptIds },
  ): Promise<Id<'warranties'>> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    const warrantyId = await ctx.db.insert('warranties', {
      vehicleId,
      expiresAt,
      manufacturer,
      updatedAt: Date.now(),
      isActive: true,
    });

    const hasReceipts = receiptIds.length > 0;
    if (hasReceipts) {
      for (const receiptId of receiptIds) {
        validateReceipt(await ctx.db.get(receiptId));
      }
    }
    if (hasReceipts) {
      await Promise.all(
        receiptIds.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: { warrantyId },
          }),
        ),
      );
    }
    return warrantyId;
  },
});

export const updateWarranty = mutation({
  args: {
    warrantyId: v.id('warranties'),
    updates: v.object({
      expiresAt: v.optional(v.number()),
      manufacturer: v.optional(v.string()),
      receiptIds: v.optional(v.array(v.id('receipts'))),
      receiptIdsToRemove: v.optional(v.array(v.id('receipts'))),
    }),
  },
  handler: async (ctx, { warrantyId, updates }): Promise<boolean> => {
    const user = await getCurrentUser(ctx);

    const warranty = validateWarranty(await ctx.db.get(warrantyId));
    isIdentityOwnerOfVehicle(user._id, warranty.vehicleId);

    await ctx.db.patch(warranty._id, {
      ...updates,
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
            updates: { warrantyId },
          }),
        ),
      );
    }
    if (updates.receiptIdsToRemove) {
      await Promise.all(
        updates.receiptIdsToRemove.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: { warrantyId: undefined },
          }),
        ),
      );
    }
    return true;
  },
});
