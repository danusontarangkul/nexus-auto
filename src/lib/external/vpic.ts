export async function decodeVIN(vin: string) {
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`,
    );
    const json = await res.json();
    return json?.Results?.[0] ?? null;
  } catch (e) {
    console.error('vPIC decode error', e);
    return null;
  }
}
