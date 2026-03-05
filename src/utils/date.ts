import { isValid } from 'date-fns';

export const formatExpiryDate = (
  timestamp: number | string | undefined | null,
): string => {
  if (!timestamp) {
    return 'Not set';
  }

  const dateInstance = new Date(timestamp);

  if (isNaN(dateInstance.getTime())) {
    return 'Not set';
  }

  return `Exp. ${dateInstance.toLocaleDateString()}`;
};

export const toDateOrNull = (
  value: number | string | Date | null | undefined,
): Date | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const date = new Date(value);
  return isValid(date) ? date : null;
};
