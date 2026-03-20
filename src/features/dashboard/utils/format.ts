import { CarForDisplay } from '@convex/types';

export const formatCarDisplayName = (
  car: CarForDisplay | null | undefined,
): string => {
  if (!car) {
    return 'Select car';
  }

  const { year, make, model } = car;

  const parts = [year, make, model].filter((part) => {
    if (part == null || String(part).trim() === '') {
      return false;
    }
    if (String(part).toLowerCase().includes('unknown')) {
      return false;
    }

    return true;
  });

  return parts.length > 0 ? parts.join(' ') : 'Vehicle';
};
