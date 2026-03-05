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
