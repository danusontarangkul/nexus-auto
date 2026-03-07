import { format, isValid } from 'date-fns';

export const formatMaintenanceInterval = (
  miles: number | undefined | null,
): string => {
  if (!miles) {
    return 'No interval set';
  }

  const formattedMiles = miles.toLocaleString();

  return `Every ${formattedMiles} mi.`;
};

export const getDisplayDate = (
  value: Date | null | string,
  isEditing = false,
): string => {
  const date = value ? new Date(value) : null;

  if (!date || !isValid(date)) {
    return isEditing ? 'Select Date' : 'Not set';
  }

  return format(date, 'MMMM dd, yyyy');
};

export const getSafePickerDate = (
  value: Date | number | null | undefined,
): Date => {
  const date = value ? new Date(value) : null;
  return date && isValid(date) ? date : new Date();
};

export const isEmptyString = (value: string | null | undefined): boolean => {
  return !value || value.trim() === '';
};

export const isEmptyDate = (value: Date | null | undefined): boolean => {
  if (!value) {
    return true;
  }

  return isNaN(value.getTime());
};

export const isExpired = (date: Date | number | undefined | null): boolean => {
  if (!date) {
    return false;
  }

  const timestamp = typeof date === 'number' ? date : date.getTime();
  return timestamp < Date.now();
};

export const formatDateFull = (
  date: Date | number | undefined | null,
  dateFormat = 'MMMM d, yyyy',
  fallback = 'N/A',
): string => {
  if (!date) {
    return fallback;
  }

  const dateObj = typeof date === 'number' ? new Date(date) : date;

  return isValid(dateObj) ? format(dateObj, dateFormat) : fallback;
};
