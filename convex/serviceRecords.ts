import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import {
  isUserOwnerOfVehicle,
  validateServiceRecord,
  validateVehicle,
} from './utils/validation';
import { internal } from './_generated/api';
import { getCurrentUser } from './utils/auth';
import { ServiceRecordWithReceipts } from './types';
import { ServiceCategory, ServiceCategoryType } from './types/literals';

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
          maintenanceItemsId: v.optional(v.id('maintenanceItems')),
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
      performed: serviceRecord.performed.map((performed) => ({
        ...performed,
        notes: performed.notes ?? undefined,
      })),
      serviceCenter: serviceRecord.serviceCenter ?? null,
      serviceDate: serviceRecord.serviceDate,
      mileage,
      vehicleId,
      updatedAt: now,
      isActive: true,
    });

    if (serviceRecord.storageIds) {
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

    // To Do: Update maintenance items
    // await ctx.runMutation(internal.maintenanceItems.updateFromServiceRecord, {
    //   vehicleId,
    //   serviceRecordId,
    //   serviceDate: serviceRecord.serviceDate,
    //   performedItems: serviceRecord.performed.map((performed) => ({
    //     templateItemId: performed.templateItemId,
    //   })),
    // });
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
            templateItemId: v.optional(v.id('maintenanceItems')),
          }),
        ),
      ),
      serviceCenter: v.optional(v.string()),
      serviceDate: v.optional(v.number()),
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

    const patchPayload: {
      performed?: {
        category: ServiceCategoryType;
        serviceName: string;
        notes?: string;
        warrantyId?: Id<'warranties'>;
        templateItemId?: Id<'maintenanceItems'>;
      }[];
      serviceCenter?: string | null;
      serviceDate?: number;
      updatedAt: number;
    } = {
      updatedAt: now,
    };
    if (updates.performed !== undefined) {
      patchPayload.performed = updates.performed.map((performed) => ({
        category: performed.category,
        serviceName: performed.serviceName,
        notes: performed.notes ?? undefined,
        ...(performed.warrantyId !== undefined && {
          warrantyId: performed.warrantyId,
        }),
        ...(performed.templateItemId !== undefined && {
          templateItemId: performed.templateItemId,
        }),
      }));
    }
    if (updates.serviceCenter !== undefined) {
      patchPayload.serviceCenter = updates.serviceCenter ?? null;
    }
    if (updates.serviceDate !== undefined) {
      patchPayload.serviceDate = updates.serviceDate;
    }
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
          ctx.db.patch(receiptId, {
            isActive: false,
            updatedAt: now,
          }),
        ),
      );
    }

    if (updates.performed || updates.serviceDate !== undefined) {
      const finalRecord = await ctx.db.get(serviceRecordId);
      if (!finalRecord) {
        return true;
      }
      const performed = updates.performed ?? finalRecord.performed;
      await ctx.runMutation(internal.maintenanceItems.updateFromServiceRecord, {
        vehicleId: finalRecord.vehicleId,
        serviceRecordId,
        serviceDate: updates.serviceDate ?? finalRecord.serviceDate,
        performedItems: performed.map((p) => ({
          templateItemId: p.templateItemId,
        })),
      });
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

export const updateServiceRecordInternal = internalMutation({
  args: {
    serviceRecordId: v.id('serviceRecords'),
    updates: v.object({
      isActive: v.optional(v.boolean()),
      performed: v.optional(
        v.array(
          v.object({
            category: ServiceCategory,
            serviceName: v.string(),
            notes: v.optional(v.string()),
            warrantyId: v.optional(v.id('warranties')),
            templateItemId: v.optional(v.id('maintenanceItems')),
          }),
        ),
      ),
      serviceCenter: v.optional(v.string()),
      serviceDate: v.optional(v.number()),
      receiptIds: v.optional(v.array(v.id('receipts'))),
      receiptIdsToRemove: v.optional(v.array(v.id('receipts'))),
    }),
  },
  handler: async (ctx, { serviceRecordId, updates }): Promise<void> => {
    return await ctx.db.patch(serviceRecordId, {
      ...updates,
      performed: updates.performed?.map((performed) => ({
        ...performed,
        notes: performed.notes ?? undefined,
      })),
      updatedAt: Date.now(),
    });
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

    await ctx.db.patch(serviceRecordId, {
      isActive: false,
      updatedAt: now,
    });
    const receipts = await ctx.db
      .query('receipts')
      .withIndex('by_serviceRecord', (q) =>
        q.eq('serviceRecordId', serviceRecordId),
      )
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
