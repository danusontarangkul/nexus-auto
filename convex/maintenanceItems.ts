import { v } from 'convex/values';
import { internalMutation } from './_generated/server';
import {
  calculateNextDueMileage,
  calculateNextDueDate,
} from './utils/helpers/maintenance';

export const updateFromServiceRecord = internalMutation({
  args: {
    serviceRecordId: v.id('serviceRecords'),
    mileage: v.number(),
    serviceDate: v.number(),
    performedItems: v.array(
      v.object({
        maintenanceItemId: v.optional(v.id('maintenanceItems')),
      }),
    ),
  },
  handler: async (
    ctx,
    { serviceRecordId, mileage, serviceDate, performedItems },
  ) => {
    const now = Date.now();
    console.log(
      'updateFromServiceRecord',
      serviceRecordId,
      mileage,
      serviceDate,
      performedItems,
    );

    for (const item of performedItems) {
      if (item.maintenanceItemId) {
        const mItem = await ctx.db.get(item.maintenanceItemId);

        if (mItem) {
          await ctx.db.patch(item.maintenanceItemId, {
            lastDoneAtMileage: mileage,
            lastDoneAtDate: serviceDate,
            lastDoneRecordId: serviceRecordId,
            nextDueMileage: calculateNextDueMileage(
              mileage,
              mItem.intervalMiles,
            ),
            nextDueDate: calculateNextDueDate(
              serviceDate,
              mItem.intervalMonths,
            ),
            updatedAt: now,
          });
        }
      }
    }
  },
});
