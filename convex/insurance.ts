import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { internal } from './_generated/api';
import {
  isIdentityOwnerOfVehicle,
  isUserOwnerOfVehicle,
  validateInsurance,
  validateVehicle,
} from './utils/validation';
import { getCurrentUser } from './utils/auth';
import { InsuranceWithReceipts } from './types';

export const getInsuranceWithReceiptsByVehicleId = query({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<InsuranceWithReceipts> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const insurance = await ctx.db
      .query('insurance')
      .withIndex('by_vehicle', (q) => q.eq('vehicleId', vehicleId))
      .unique();

    if (!insurance) {
      return { insurance: null, receipts: [] };
    }

    const receipts = await ctx.db
      .query('receipts')
      .withIndex('by_insurance', (q) => q.eq('insuranceId', insurance._id))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    return { insurance, receipts };
  },
});

export const getInsuranceByVehicleIdInternal = internalQuery({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<'insurance'> | null> => {
    return await ctx.db
      .query('insurance')
      .withIndex('by_vehicle', (q) => q.eq('vehicleId', vehicleId))
      .first();
  },
});

export const upsertInsurance = mutation({
  args: {
    vehicleId: v.id('vehicles'),
    expiresAt: v.number(),
    newReceiptStorageIds: v.array(v.id('_storage')),
    receiptIdsToRemove: v.array(v.id('receipts')),
    providerName: v.string(),
  },
  handler: async (
    ctx,
    {
      vehicleId,
      expiresAt,
      newReceiptStorageIds,
      receiptIdsToRemove,
      providerName,
    },
  ): Promise<boolean> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const insurance = await ctx.db
      .query('insurance')
      .withIndex('by_vehicle', (q) => q.eq('vehicleId', vehicleId))
      .unique();

    let insuranceId: Id<'insurance'> | null = insurance?._id ?? null;

    if (insurance) {
      await ctx.db.patch(insurance._id, {
        expiresAt,
        providerName,
        updatedAt: now,
      });
    } else {
      insuranceId = await ctx.db.insert('insurance', {
        vehicleId,
        expiresAt,
        providerName,
        updatedAt: now,
      });
    }

    if (
      newReceiptStorageIds &&
      newReceiptStorageIds.length > 0 &&
      insuranceId
    ) {
      await Promise.all(
        newReceiptStorageIds.map((storageId) =>
          ctx.db.insert('receipts', {
            storageId,
            insuranceId,
            userId: user._id,
            type: 'insurance',
            isActive: true,
            updatedAt: now,
          }),
        ),
      );
    }

    if (receiptIdsToRemove.length > 0) {
      await Promise.all(
        receiptIdsToRemove.map((receiptId) =>
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
