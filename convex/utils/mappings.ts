import { NhtsaRawVehicle } from '../types';
import { VehicleData } from '../types';
import { parseNum } from './pares';

export function mapNhtsaToVehicleData(v: NhtsaRawVehicle): VehicleData {
  return {
    make: v.Make || null,
    model: v.Model || null,
    year: parseNum(v.ModelYear),
    manufacturer: v.Manufacturer || null,
    plantCountry: v.PlantCountry || null,
    bodyClass: v.BodyClass || null,
    vehicleType: v.VehicleType || null,
    trim: v.Trim || null,
    series: v.Series || null,
    fuelType: v.FuelTypePrimary || null,
    engine: {
      displacement: parseNum(v.DisplacementL),
      cylinders: parseNum(v.EngineCylinders),
      horsepower: parseNum(v.EngineHP),
      fuelType: v.FuelTypePrimary || null,
    },
    gvwr: v.GVWR || null,
    doors: parseNum(v.Doors),
    driveType: v.DriveType || null,
    transmission: v.TransmissionStyle || null,
  };
}
