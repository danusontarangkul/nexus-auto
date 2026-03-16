import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import {
  isUserOwnerOfVehicle,
  validateServiceRecord,
  validateVehicle,
} from './utils/validation';
import { internal } from './_generated/api';
import { getCurrentUser } from './utils/auth';
import { ServiceRecordWithReceipts } from './types';
import { ServiceCategory } from './types/literals';
import {
  buildServiceRecordPatchPayload,
  formatPerformedItems,
} from './utils/helpers/serviceRecord';

export const getServiceRecordsByVehicleId = query({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<'serviceRecords'>[]> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    return await ctx.db
      .query('serviceRecords')
      .withIndex('by_vehicle', (q) => q.eq('vehicleId', vehicleId))
      .order('desc')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();
  },
});

export const insertServiceRecord = mutation({
  args: {
    vehicleId: v.id('vehicles'),
    mileage: v.number(),
    serviceRecord: v.object({
      performed: v.array(
        v.object({
          category: ServiceCategory,
          serviceName: v.string(),
          notes: v.optional(v.string()),
          warrantyId: v.optional(v.id('warranties')),
          maintenanceItemId: v.optional(v.id('maintenanceItems')),
        }),
      ),
      serviceCenter: v.string(),
      serviceDate: v.number(),
      storageIds: v.array(v.id('_storage')),
    }),
  },
  handler: async (
    ctx,
    { vehicleId, mileage, serviceRecord },
  ): Promise<Id<'serviceRecords'>> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const serviceRecordId = await ctx.db.insert('serviceRecords', {
      performed: formatPerformedItems(serviceRecord.performed),
      serviceCenter: serviceRecord.serviceCenter || null,
      serviceDate: serviceRecord.serviceDate,
      mileage,
      vehicleId,
      updatedAt: now,
      isActive: true,
    });

    if (serviceRecord.storageIds.length > 0) {
      await Promise.all(
        serviceRecord.storageIds.map((storageId) =>
          ctx.db.insert('receipts', {
            storageId,
            serviceRecordId,
            userId: user._id,
            type: 'serviceRecord',
            isActive: true,
            updatedAt: now,
          }),
        ),
      );
    }

    return serviceRecordId;
  },
});

export const updateServiceRecord = mutation({
  args: {
    serviceRecordId: v.id('serviceRecords'),
    updates: v.object({
      performed: v.optional(
        v.array(
          v.object({
            category: ServiceCategory,
            serviceName: v.string(),
            notes: v.optional(v.string()),
            warrantyId: v.optional(v.id('warranties')),
            maintenanceItemId: v.optional(v.id('maintenanceItems')),
          }),
        ),
      ),
      serviceCenter: v.optional(v.string()),
      serviceDate: v.optional(v.number()),
      mileage: v.optional(v.number()),
      storageIds: v.optional(v.array(v.id('_storage'))),
      receiptIdsToRemove: v.optional(v.array(v.id('receipts'))),
    }),
  },
  handler: async (ctx, { serviceRecordId, updates }): Promise<boolean> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const serviceRecord = validateServiceRecord(
      await ctx.db.get(serviceRecordId),
    );
    const vehicle = validateVehicle(await ctx.db.get(serviceRecord.vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const patchPayload = buildServiceRecordPatchPayload(updates, now);

    await ctx.db.patch(serviceRecordId, patchPayload);

    if (updates.storageIds) {
      await Promise.all(
        updates.storageIds.map((storageId) =>
          ctx.db.insert('receipts', {
            storageId,
            serviceRecordId,
            userId: user._id,
            type: 'serviceRecord',
            isActive: true,
            updatedAt: now,
          }),
        ),
      );
    }

    if (updates.receiptIdsToRemove) {
      await Promise.all(
        updates.receiptIdsToRemove.map((receiptId) =>
          ctx.db.patch(receiptId, { isActive: false, updatedAt: now }),
        ),
      );
    }

    return true;
  },
});

export const getServiceRecordById = query({
  args: {
    serviceRecordId: v.id('serviceRecords'),
  },
  handler: async (
    ctx,
    { serviceRecordId },
  ): Promise<ServiceRecordWithReceipts> => {
    const user = await getCurrentUser(ctx);
    const serviceRecord = validateServiceRecord(
      await ctx.db.get(serviceRecordId),
    );
    const vehicle = validateVehicle(await ctx.db.get(serviceRecord.vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    const receipts = await ctx.runQuery(
      internal.receipts.getReceiptByServiceRecordIdInternal,
      { serviceRecordId },
    );

    return { serviceRecord, receipts };
  },
});

export const deleteServiceRecord = mutation({
  args: {
    serviceRecordId: v.id('serviceRecords'),
  },
  handler: async (ctx, { serviceRecordId }): Promise<boolean> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const serviceRecord = validateServiceRecord(
      await ctx.db.get(serviceRecordId),
    );
    const vehicle = validateVehicle(await ctx.db.get(serviceRecord.vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    await ctx.db.patch(serviceRecordId, { isActive: false, updatedAt: now });

    const receipts = await ctx.db
      .query('receipts')
      .withIndex('by_serviceRecord', (q) =>
        q.eq('serviceRecordId', serviceRecordId),
      )
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    await Promise.all(
      receipts.map((receipt) =>
        ctx.db.patch(receipt._id, { isActive: false, updatedAt: now }),
      ),
    );

    return true;
  },
});
