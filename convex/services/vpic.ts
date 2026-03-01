import { NhtsaRawVehicle } from '../types';
import { fetchWithTimeout } from '../utils/fetch';

export async function fetchNhtsaVinData(vin: string): Promise<NhtsaRawVehicle> {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;
  const response = await fetchWithTimeout({ url });
  if (!response.ok) {
    throw new Error('NHTSA_API_DOWN');
  }

  const data = (await response.json()) as { Results: NhtsaRawVehicle[] };
  if (!data.Results?.[0]) {
    throw new Error('VEHICLE_NOT_FOUND');
  }

  return data.Results[0];
}
