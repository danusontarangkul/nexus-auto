import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { internal } from './_generated/api';
import { isUserOwnerOfVehicle, validateVehicle } from './utils/validation';
import { getCurrentUser } from './utils/auth';
import { RegistrationWithReceipts } from './types';

export const getRegistrationWithReceiptsByVehicleId = query({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<RegistrationWithReceipts> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const registration = await ctx.runQuery(
      internal.registrations.getRegistrationByVehicleIdInternal,
      { vehicleId },
    );

    if (!registration) {
      return { registration: null, receipts: [] };
    }

    const receipts = await ctx.db
      .query('receipts')
      .withIndex('by_registration', (q) =>
        q.eq('registrationId', registration._id),
      )
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    return { registration, receipts };
  },
});

export const getRegistrationByVehicleIdInternal = internalQuery({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<'registrations'> | null> => {
    return await ctx.db
      .query('registrations')
      .withIndex('by_vehicle', (q) => q.eq('vehicleId', vehicleId))
      .first();
  },
});

export const upsertRegistration = mutation({
  args: {
    vehicleId: v.id('vehicles'),
    expiresAt: v.number(),
    newReceiptStorageIds: v.array(v.id('_storage')),
    receiptIdsToRemove: v.array(v.id('receipts')),
  },
  handler: async (
    ctx,
    { vehicleId, expiresAt, newReceiptStorageIds, receiptIdsToRemove },
  ): Promise<boolean> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const registration = await ctx.db
      .query('registrations')
      .withIndex('by_vehicle', (q) => q.eq('vehicleId', vehicleId))
      .unique();

    let registrationId: Id<'registrations'> | null = registration?._id ?? null;

    if (registration) {
      await ctx.db.patch(registration._id, {
        expiresAt,
        updatedAt: now,
      });
    } else {
      registrationId = await ctx.db.insert('registrations', {
        vehicleId,
        expiresAt,
        updatedAt: now,
      });
    }

    if (
      newReceiptStorageIds &&
      newReceiptStorageIds.length > 0 &&
      registrationId
    ) {
      await Promise.all(
        newReceiptStorageIds.map((storageId) =>
          ctx.db.insert('receipts', {
            storageId,
            registrationId,
            userId: user._id,
            type: 'registration',
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
