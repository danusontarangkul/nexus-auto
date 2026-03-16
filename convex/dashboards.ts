import { query } from './_generated/server';
import { getCurrentUser } from './utils/auth';
import { Dashboard } from './types';
import { formatVehicleListItem } from './utils/mappings';
import { resolveActiveVehicle } from './utils/helpers/vehicles';
import { computeMaintenanceItemsWithDue } from './utils/helpers/maintenance';

export const getDashboard = query({
  args: {},
  handler: async (ctx): Promise<Dashboard> => {
    const user = await getCurrentUser(ctx);

    const vehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('isActive'), true))
      .order('desc')
      .collect();

    if (vehicles.length === 0) {
      return {
        vehicles: [],
        active: null,
        user,
      };
    }

    const vehicleListItems = vehicles.map(formatVehicleListItem);

    const selectedVehicle = resolveActiveVehicle(user, vehicles);

    const [registration, insurance, maintenanceItems, serviceRecords] =
      await Promise.all([
        ctx.db
          .query('registrations')
          .withIndex('by_vehicle', (q) =>
            q.eq('vehicleId', selectedVehicle._id),
          )
          .unique(),

        ctx.db
          .query('insurance')
          .withIndex('by_vehicle', (q) =>
            q.eq('vehicleId', selectedVehicle._id),
          )
          .unique(),

        ctx.db
          .query('maintenanceItems')
          .withIndex('by_vehicle', (q) =>
            q.eq('vehicleId', selectedVehicle._id),
          )
          .collect(),

        ctx.db
          .query('serviceRecords')
          .withIndex('by_vehicle', (q) =>
            q.eq('vehicleId', selectedVehicle._id),
          )
          .filter((q) => q.eq(q.field('isActive'), true))
          .collect(),
      ]);

    const maintenanceItemsWithDue = computeMaintenanceItemsWithDue(
      maintenanceItems,
      serviceRecords,
    );

    return {
      vehicles: vehicleListItems,
      active: {
        vehicle: selectedVehicle,
        registration,
        insurance,
        maintenanceItems: maintenanceItemsWithDue,
      },
      user,
    };
  },
});
