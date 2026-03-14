import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import {
  isUserOwnerOfVehicle,
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
    isUserOwnerOfVehicle(user._id, vehicle);

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
    const vehicle = validateVehicle(await ctx.db.get(warranty.vehicleId));

    isUserOwnerOfVehicle(user._id, vehicle);

    const receipts = await ctx.db
      .query('receipts')
      .withIndex('by_warranty', (q) => q.eq('warrantyId', warrantyId))
      .order('desc')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    return { warranty, receipts };
  },
});

export const insertWarranty = mutation({
  args: {
    vehicleId: v.id('vehicles'),
    expiresAt: v.number(),
    manufacturer: v.string(),
    component: v.string(),
    storageIds: v.array(v.id('_storage')),
  },
  handler: async (
    ctx,
    { vehicleId, expiresAt, manufacturer, component, storageIds },
  ): Promise<Id<'warranties'>> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const warrantyId = await ctx.db.insert('warranties', {
      vehicleId,
      component,
      expiresAt,
      manufacturer,
      updatedAt: now,
      isActive: true,
    });

    const hasStorageIds = storageIds.length > 0;
    if (hasStorageIds) {
      await Promise.all(
        storageIds.map((storageId) =>
          ctx.db.insert('receipts', {
            storageId,
            warrantyId,
            userId: user._id,
            type: 'warranty',
            isActive: true,
            updatedAt: now,
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
      component: v.optional(v.string()),
      manufacturer: v.optional(v.string()),
      storageIds: v.optional(v.array(v.id('_storage'))),
      receiptIdsToRemove: v.optional(v.array(v.id('receipts'))),
    }),
  },
  handler: async (ctx, { warrantyId, updates }): Promise<boolean> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const warranty = validateWarranty(await ctx.db.get(warrantyId));
    const vehicle = validateVehicle(await ctx.db.get(warranty.vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const { storageIds, receiptIdsToRemove, ...warrantyUpdates } = updates;
    await ctx.db.patch(warranty._id, {
      ...warrantyUpdates,
      updatedAt: now,
    });

    if (updates.storageIds && updates.storageIds.length > 0) {
      await Promise.all(
        updates.storageIds.map((storageId) =>
          ctx.db.insert('receipts', {
            storageId,
            warrantyId,
            userId: user._id,
            type: 'warranty',
            isActive: true,
            updatedAt: now,
          }),
        ),
      );
    }

    if (updates.receiptIdsToRemove && updates.receiptIdsToRemove.length > 0) {
      await Promise.all(
        updates.receiptIdsToRemove.map((receiptId) =>
          ctx.db.patch(receiptId, {
            isActive: false,
            updatedAt: now,
          }),
        ),
      );
    }
    return true;
  },
});

export const deleteWarranty = mutation({
  args: {
    warrantyId: v.id('warranties'),
  },
  handler: async (ctx, { warrantyId }): Promise<boolean> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const warranty = validateWarranty(await ctx.db.get(warrantyId));
    const vehicle = validateVehicle(await ctx.db.get(warranty.vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    await ctx.db.patch(warrantyId, {
      isActive: false,
      updatedAt: now,
    });

    const receipts = await ctx.db
      .query('receipts')
      .withIndex('by_warranty', (q) => q.eq('warrantyId', warrantyId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    await Promise.all(
      receipts.map((receipt) =>
        ctx.db.patch(receipt._id, {
          isActive: false,
          updatedAt: now,
        }),
      ),
    );
    return true;
  },
});
