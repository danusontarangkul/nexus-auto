import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getMaintenanceItemsByVehicleId = internalQuery({
  args: {
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, { vehicleId }): Promise<Doc<"maintenanceItems">[]> => {
    return await ctx.db
      .query("maintenanceItems")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", vehicleId))
      .collect();
  },
});

export const insertMaintenanceItem = internalMutation({
  args: {
    vehicleId: v.id("vehicles"),
    name: v.string(),
    category: v.string(),
    intervalMiles: v.optional(v.number()),
    intervalMonths: v.optional(v.number()),
  },
  handler: async (
    ctx,
    { vehicleId, name, category, intervalMiles, intervalMonths }
  ): Promise<Id<"maintenanceItems">> => {
    const maintenanceItemId = await ctx.db.insert("maintenanceItems", {
      vehicleId,
      name,
      category,
      intervalMiles,
      intervalMonths,
      updatedAt: Date.now(),
    });
    return maintenanceItemId;
  },
});

export const updateFromServiceRecord = internalMutation({
  args: {
    vehicleId: v.id("vehicles"),
    serviceRecordId: v.id("serviceRecords"),
    serviceDate: v.number(),
    performedItems: v.array(
      v.object({
        templateItemId: v.optional(v.id("maintenanceItems")),
      })
    ),
  },
  handler: async (
    ctx,
    { vehicleId, serviceRecordId, serviceDate, performedItems }
  ) => {
    const updates: Promise<void>[] = [];

    for (const item of performedItems) {
      if (!item.templateItemId) continue;

      const maintItem = await ctx.db.get(item.templateItemId);
      if (!maintItem || maintItem.vehicleId !== vehicleId) continue;

      const nextDueDate = maintItem.intervalMonths
        ? serviceDate + maintItem.intervalMonths * 30 * 24 * 60 * 60 * 1000
        : undefined;

      updates.push(
        ctx.db.patch(item.templateItemId, {
          lastDoneAtDate: serviceDate,
          lastDoneRecordId: serviceRecordId,
          nextDueDate,
          updatedAt: Date.now(),
        })
      );
    }

    await Promise.all(updates);
  },
});
