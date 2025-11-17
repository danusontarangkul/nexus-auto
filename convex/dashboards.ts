import { v } from "convex/values";
import { query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { isIdentityOwnerOfVehicle, validateVehicle } from "./utils/validation";
import { internal } from "./_generated/api";
import { getCurrentUser } from "./utils/auth";

type Dashboard = {
  registrations: Doc<"registrations"> | null;
  insurance: Doc<"insurance"> | null;
  maintenanceItems: Doc<"maintenanceItems">[];
};
export const getDashboard = query({
  args: {
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, { vehicleId }): Promise<Dashboard> => {
    const user = await getCurrentUser(ctx);
    const vehicle = validateVehicle(await ctx.db.get(vehicleId));

    isIdentityOwnerOfVehicle(user._id, vehicle._id);

    const registrations = await ctx.runQuery(
      internal.registrations.getRegistrationByVehicleIdInternal,
      { vehicleId }
    );

    const insurance = await ctx.runQuery(
      internal.insurance.getInsuranceByVehicleIdInternal,
      { vehicleId }
    );

    const maintenanceItems = await ctx.runQuery(
      internal.maintenanceItems.getMaintenanceItemsByVehicleId,
      { vehicleId }
    );

    return { registrations, insurance, maintenanceItems };
  },
});
