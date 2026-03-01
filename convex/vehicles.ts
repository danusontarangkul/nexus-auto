import { v } from 'convex/values';
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { isIdentityOwnerOfVehicle, validateVehicle } from './utils/validation';
import { getCurrentUser } from './utils/auth';
import { internal } from './_generated/api';
import type { MaintenanceTemplateItem } from './helpers/openAi';

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

export const insertVehicle = action({
  args: {
    licensePlate: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vinNumber: v.optional(v.string()),
    details: v.optional(v.any()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ vehicleId: Id<'vehicles'>; itemsAdded: number }> => {
    const user = await getCurrentUser(ctx);

    const vehicleId = await ctx.runMutation(
      internal.vehicles.insertVehicleInternal,
      {
        userId: user._id,
        licensePlate: args.licensePlate.toUpperCase().trim(),
        make: args.make.trim(),
        model: args.model.trim(),
        year: args.year,
        vinNumber: args.vinNumber?.trim() ?? '',
        details: args.details,
      },
    );

    let templates: Array<{ defaultItems: MaintenanceTemplateItem[] }> =
      await ctx.runQuery(
        internal.maintenanceTemplates.getMaintenanceTemplatesByMakeModelYear,
        {
          make: args.make,
          model: args.model,
          year: args.year,
        },
      );

    if (templates.length === 0) {
      const aiItems = await ctx.runAction(
        internal.openAi.generateMaintenanceTemplate,
        {
          make: args.make,
          model: args.model,
          year: args.year,
        },
      );

      templates = [{ defaultItems: aiItems }];
    }

    let itemsAdded = 0;
    for (const template of templates) {
      for (const item of template.defaultItems) {
        await ctx.runMutation(internal.maintenanceItems.insertMaintenanceItem, {
          vehicleId,
          ...item,
        });
        itemsAdded++;
      }
    }

    return { vehicleId, itemsAdded };
  },
});
export const insertVehicleInternal = internalMutation({
  args: {
    userId: v.id('users'),
    licensePlate: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vinNumber: v.string(),
    details: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<Id<'vehicles'>> => {
    return await ctx.db.insert('vehicles', {
      userId: args.userId,
      licensePlate: args.licensePlate,
      make: args.make,
      model: args.model,
      year: args.year,
      vinNumber: args.vinNumber,
      details: args.details,
      isActive: true,
      updatedAt: Date.now(),
    });
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
