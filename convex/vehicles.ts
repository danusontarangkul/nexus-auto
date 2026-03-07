import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import {
  isIdentityOwnerOfVehicle,
  isUserOwnerOfVehicle,
  validateVehicle,
} from './utils/validation';
import { getCurrentUser } from './utils/auth';
import { internal } from './_generated/api';
import { vehicleDataValidator } from './utils/schemaUtils';
import { sanitizeCapitalizeString } from './utils/sanatize';

export const getVehicleById = query({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<'vehicles'>> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    return vehicle;
  },
});

export const getVehicleByIdInternal = internalQuery({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<'vehicles'> | null> => {
    return await ctx.db.get(vehicleId);
  },
});

export const getVehiclesByUserId = query({
  args: {},
  handler: async (ctx): Promise<Doc<'vehicles'>[]> => {
    const user = await getCurrentUser(ctx);

    const vehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('isActive'), true))
      .order('desc')
      .collect();

    return vehicles;
  },
});

export const insertVehicle = mutation({
  args: {
    licensePlate: v.string(),
    vehicleData: vehicleDataValidator,
    vinNumber: v.string(),
  },
  handler: async (ctx, args): Promise<Id<'vehicles'>> => {
    const { licensePlate, vehicleData, vinNumber } = args;
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const vehicleId = await ctx.db.insert('vehicles', {
      isActive: true,
      licensePlate: sanitizeCapitalizeString(licensePlate),
      updatedAt: now,
      userId: user._id,
      vehicleData,
      vinNumber: sanitizeCapitalizeString(vinNumber),
    });

    const template = await ctx.runQuery(
      internal.maintenanceTemplates.getMaintenanceTemplatesByMakeModelYear,
      {
        make: vehicleData.make ?? '',
        model: vehicleData.model ?? '',
        year: vehicleData.year ?? 0,
      },
    );

    if (template && template.length > 0) {
      for (const item of template[0].defaultItems) {
        await ctx.db.insert('maintenanceItems', {
          vehicleId,
          name: item.name,
          category: item.category,
          intervalMiles: item.intervalMiles ?? undefined,
          intervalMonths: item.intervalMonths ?? undefined,
          updatedAt: now,
        });
      }
    }
    await ctx.db.patch(user._id, {
      lastSelectedVehicleId: vehicleId,
      updatedAt: now,
    });
    return vehicleId;
  },
});

export const updateVehicle = mutation({
  args: {
    vehicleId: v.id('vehicles'),
    updates: v.object({
      isActive: v.optional(v.boolean()),
      licensePlate: v.optional(v.string()),
      make: v.optional(v.string()),
      model: v.optional(v.string()),
      year: v.optional(v.number()),
      vinNumber: v.optional(v.string()),
      details: v.optional(
        v.object({
          bodyClass: v.optional(v.string()),
          driveType: v.optional(v.string()),
          engineDisplacement: v.optional(v.string()),
          gvwr: v.optional(v.string()),
          manufacturer: v.optional(v.string()),
          plantCity: v.optional(v.string()),
          plantCountry: v.optional(v.string()),
          fuelType: v.optional(v.string()),
          transmission: v.optional(v.string()),
          safetyFeatures: v.optional(
            v.object({
              airbagsFront: v.optional(v.string()),
              airbagsSide: v.optional(v.string()),
              abs: v.optional(v.string()),
              seatBelts: v.optional(v.string()),
              tractionControl: v.optional(v.string()),
            }),
          ),
        }),
      ),
    }),
  },
  handler: async (ctx, { vehicleId, updates }): Promise<boolean> => {
    const user = await getCurrentUser(ctx);

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    await ctx.db.patch(vehicleId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return true;
  },
});

export const deleteVehicle = mutation({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }): Promise<boolean> => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();

    const vehicle = validateVehicle(await ctx.db.get(vehicleId));
    isUserOwnerOfVehicle(user._id, vehicle);

    await ctx.db.patch(vehicleId, {
      isActive: false,
      updatedAt: now,
    });

    const otherVehicle = await ctx.db
      .query('vehicles')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field('isActive'), true),
          q.neq(q.field('_id'), vehicleId),
        ),
      )
      .first();

    await ctx.db.patch(user._id, {
      lastSelectedVehicleId: otherVehicle ? otherVehicle._id : null,
      updatedAt: now,
    });

    return true;
  },
});
