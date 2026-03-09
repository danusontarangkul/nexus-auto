import { VehicleListItem } from '@convex/types';

export const formatVehicleName = (
  car?: Partial<Pick<VehicleListItem, 'year' | 'make' | 'model'>> | null,
): string => {
  if (!car) {
    return 'Unknown Vehicle';
  }

  const year = car.year ?? '';
  const make = car.make ?? 'Unknown';
  const model = car.model ?? '';

  return `${year} ${make} ${model}`.trim();
};

export const formatBodyClass = (bodyClass?: string | null): string => {
  if (!bodyClass || bodyClass.trim() === '') {
    return 'N/A';
  }
  return bodyClass;
};
