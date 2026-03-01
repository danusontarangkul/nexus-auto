import { v } from 'convex/values';
import { action, internalMutation, internalQuery } from './_generated/server';
import { Doc } from './_generated/dataModel';
import { isIdentityOwnerOfVehicle, validateVehicle } from './utils/validation';
import { getCurrentUser } from './utils/auth';
import { internal } from './_generated/api';
import { uploadFile } from './utils/storage';
import { ReceiptStatus, ReceiptType } from './types/literals';
import { enforceReceiptUploadRateLimit } from './utils/antiAbuseLimits';
import { InsertReceiptResponse } from './types';

export const updateReceiptInternal = internalMutation({
  args: {
    receiptId: v.id('receipts'),
    updates: v.object({
      registrationId: v.optional(v.id('registrations')),
      insuranceId: v.optional(v.id('insurance')),
      warrantyId: v.optional(v.id('warranties')),
      serviceRecordId: v.optional(v.id('serviceRecords')),
      parsedData: v.optional(v.any()),
      status: v.optional(ReceiptStatus),
    }),
  },
  handler: async (ctx, { receiptId, updates }): Promise<void> => {
    return await ctx.db.patch(receiptId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const getReceiptByRegistrationIdInternal = internalQuery({
  args: {
    registrationId: v.id('registrations'),
  },
  handler: async (ctx, { registrationId }): Promise<Doc<'receipts'>[]> => {
    return await ctx.db
      .query('receipts')
      .withIndex('by_registration', (q) =>
        q.eq('registrationId', registrationId),
      )
      .order('desc')
      .collect();
  },
});

export const getReceiptByInsuranceIdInternal = internalQuery({
  args: {
    insuranceId: v.id('insurance'),
  },
  handler: async (ctx, { insuranceId }): Promise<Doc<'receipts'>[]> => {
    return await ctx.db
      .query('receipts')
      .withIndex('by_insurance', (q) => q.eq('insuranceId', insuranceId))
      .order('desc')
      .collect();
  },
});

export const getReceiptByWarrantyIdInternal = internalQuery({
  args: {
    warrantyId: v.id('warranties'),
  },
  handler: async (ctx, { warrantyId }): Promise<Doc<'receipts'>[]> => {
    return await ctx.db
      .query('receipts')
      .withIndex('by_warranty', (q) => q.eq('warrantyId', warrantyId))
      .order('desc')
      .collect();
  },
});

export const getReceiptByServiceRecordIdInternal = internalQuery({
  args: {
    serviceRecordId: v.id('serviceRecords'),
  },
  handler: async (ctx, { serviceRecordId }): Promise<Doc<'receipts'>[]> => {
    return await ctx.db
      .query('receipts')
      .withIndex('by_serviceRecord', (q) =>
        q.eq('serviceRecordId', serviceRecordId),
      )
      .order('desc')
      .collect();
  },
});

export const insertReceipt = action({
  args: {
    vehicleId: v.id('vehicles'),
    file: v.any(),
    fileName: v.string(),
    type: ReceiptType,
  },
  handler: async (ctx, args): Promise<InsertReceiptResponse> => {
    const { vehicleId, file, fileName, type } = args;
    const user = await getCurrentUser(ctx);
    await enforceReceiptUploadRateLimit(ctx, user._id);
    const vehicle = validateVehicle(
      await ctx.runQuery(internal.vehicles.getVehicleByIdInternal, {
        vehicleId,
      }),
    );
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    const { fileId, url } = await uploadFile(ctx, file);

    const receiptId = await ctx.runMutation(
      internal.receipts.insertReceiptInternal,
      {
        fileId,
        url,
        fileName,
        status: 'ready',
        type,
        userId: user._id,
      },
    );

    await ctx.scheduler.runAfter(0, internal.openAi.scanReceipt, {
      receiptId,
    });

    return { receiptId, url, status: 'ready' };
  },
});

export const insertReceiptInternal = internalMutation({
  args: {
    fileId: v.id('_storage'),
    url: v.string(),
    fileName: v.string(),
    status: ReceiptStatus,
    type: ReceiptType,
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { fileId, url, fileName, status, type, userId } = args;
    return await ctx.db.insert('receipts', {
      fileId,
      url,
      fileName,
      updatedAt: Date.now(),
      status,
      type,
      userId,
    });
  },
});

export const countUserUploadsSince = internalQuery({
  args: {
    userId: v.id('users'),
    since: v.number(),
  },
  handler: async (ctx, { userId, since }) => {
    return await ctx.db
      .query('receipts')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.gte(q.field('_creationTime'), since))
      .collect()
      .then((list) => list.length);
  },
});

export const getReceiptByIdInternal = internalQuery({
  args: {
    receiptId: v.id('receipts'),
  },
  handler: async (ctx, { receiptId }) => {
    return await ctx.db.get(receiptId);
  },
});
