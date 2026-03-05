import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { internal } from './_generated/api';
import {
  isIdentityOwnerOfVehicle,
  isUserOwnerOfVehicle,
  validateVehicle,
} from './utils/validation';
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

    const receipts = await ctx.runQuery(
      internal.receipts.getReceiptByRegistrationIdInternal,
      { registrationId: registration._id },
    );

    return { registration, receipts };
  },
});

// for dashboard
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
    receiptIds: v.array(v.id('receipts')),
    receiptIdsToRemove: v.array(v.id('receipts')),
  },
  handler: async (
    ctx,
    { vehicleId, expiresAt, receiptIds, receiptIdsToRemove },
  ): Promise<boolean> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const registration = await ctx.runQuery(
      internal.registrations.getRegistrationByVehicleIdInternal,
      { vehicleId },
    );

    let registrationId: Id<'registrations'> | null = registration?._id ?? null;

    if (registration) {
      await ctx.db.patch(registration._id, {
        expiresAt,
        updatedAt: Date.now(),
      });
    } else {
      registrationId = await ctx.db.insert('registrations', {
        vehicleId,
        expiresAt,
        updatedAt: Date.now(),
      });
    }

    if (receiptIds && receiptIds.length > 0) {
      await Promise.all(
        receiptIds.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: {
              registrationId: registration?._id,
            },
          }),
        ),
      );
    }

    if (receiptIdsToRemove && receiptIdsToRemove.length > 0) {
      await Promise.all(
        receiptIdsToRemove.map((receiptId) =>
          ctx.runMutation(internal.receipts.updateReceiptInternal, {
            receiptId,
            updates: {
              registrationId: undefined,
            },
          }),
        ),
      );
    }

    return true;
  },
});
