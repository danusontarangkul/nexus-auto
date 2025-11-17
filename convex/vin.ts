import { action } from "./_generated/server";
import { v } from "convex/values";
import { handleActionError } from "./utils/errors";
import { DecodeVinResult } from "types";

export const decodeVin = action({
  args: { vin: v.string() },
  handler: async (ctx, { vin }): Promise<DecodeVinResult> => {
    const cleanedVin = vin.trim().toUpperCase();

    if (cleanedVin.length !== 17) {
      return {
        success: false,
        error: "VIN must be exactly 17 characters",
      };
    }

    try {
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${cleanedVin}?format=json`;

      const response = await fetch(url, {
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        return {
          success: false,
          error: "Failed to connect to VIN decoder",
        };
      }

      const responseData = await response.json();

      if (!responseData.Results || responseData.Results.length === 0) {
        return {
          success: false,
          error: "No vehicle found for this VIN",
        };
      }

      const vehicle = responseData.Results[0];

      return {
        success: true,
        data: {
          make: vehicle.Make || null,
          model: vehicle.Model || null,
          year: vehicle.ModelYear ? Number(vehicle.ModelYear) : null,
          manufacturer: vehicle.Manufacturer || null,
          plantCountry: vehicle.PlantCountry || null,
          bodyClass: vehicle.BodyClass || null,
          vehicleType: vehicle.VehicleType || null,
          trim: vehicle.Trim || null,
          series: vehicle.Series || null,
          engine: {
            displacement: vehicle.DisplacementL
              ? Number(vehicle.DisplacementL)
              : null,
            cylinders: vehicle.EngineCylinders
              ? Number(vehicle.EngineCylinders)
              : null,
            horsepower: vehicle.EngineHP ? Number(vehicle.EngineHP) : null,
            fuelType: vehicle.FuelTypePrimary || null,
          },
          gvwr: vehicle.GVWR || null,
          doors: vehicle.Doors ? Number(vehicle.Doors) : null,
          driveType: vehicle.DriveType || null,
          transmission: vehicle.TransmissionStyle || null,
        },
      };
    } catch (error) {
      return handleActionError(error, "decodeVin");
    }
  },
});
