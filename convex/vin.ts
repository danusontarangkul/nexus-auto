import { action } from './_generated/server';
import { v } from 'convex/values';
import { mapAndHandleError, throwDomainError } from './utils/errors';
import { fetchNhtsaVinData } from './services/vpic';
import { VIN_LENGTH } from './utils/const';
import { VehicleData } from './types';
import { mapNhtsaToVehicleData } from './utils/mappings';

export const decodeVin = action({
  args: { vin: v.string() },
  handler: async (_ctx, { vin }): Promise<VehicleData> => {
    const cleanedVin = vin.trim().toUpperCase();

    if (cleanedVin.length !== VIN_LENGTH) {
      throwDomainError(
        'decodeVin',
        `VIN must be exactly ${VIN_LENGTH} characters`,
        { receivedLength: cleanedVin.length },
      );
    }
    try {
      const vehicle = await fetchNhtsaVinData(cleanedVin);

      return mapNhtsaToVehicleData(vehicle);
    } catch (error) {
      mapAndHandleError(error, 'decodeVin', { vin: cleanedVin });
    }
  },
});
