import { VehicleData } from '@convex/types';

export const getVehicleWithFallbacks = (
  car?: Partial<VehicleData>,
  plate?: string,
  vinNumber?: string,
) => {
  const carData: VehicleData = {
    bodyClass: car?.bodyClass ?? null,
    doors: car?.doors ?? null,
    driveType: car?.driveType ?? null,
    engine: {
      cylinders: car?.engine?.cylinders ?? null,
      displacement: car?.engine?.displacement ?? null,
      fuelType: car?.engine?.fuelType ?? null,
      horsepower: car?.engine?.horsepower ?? null,
    },
    fuelType: car?.fuelType ?? null,
    gvwr: car?.gvwr ?? null,
    make: car?.make ?? 'Unknown Make',
    manufacturer: car?.manufacturer ?? 'Unknown Manufacturer',
    model: car?.model ?? 'Unknown Model',
    plantCountry: car?.plantCountry ?? null,
    series: car?.series ?? null,
    transmission: car?.transmission ?? null,
    trim: car?.trim ?? null,
    vehicleType: car?.vehicleType ?? null,
    year: car?.year ?? null,
  };

  return {
    car: carData,
    hasData: Boolean(car),
    plate: plate ?? 'No Plate Provided',
    vinNumber: vinNumber ?? 'No VIN Provided',
  };
};
