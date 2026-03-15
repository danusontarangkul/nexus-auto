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

export const formatMaintenanceIntervalDisplay = (
  intervalMiles: number | undefined | null,
  intervalMonths: number | undefined | null,
): string => {
  const milesStr =
    intervalMiles != null ? `Every ${intervalMiles.toLocaleString()} mi` : '';
  const monthsStr = intervalMonths != null ? `Every ${intervalMonths} mo` : '';
  if (milesStr && monthsStr) {
    return `${milesStr} / ${monthsStr}`;
  }
  if (milesStr) {
    return milesStr;
  }
  if (monthsStr) {
    return monthsStr;
  }
  return 'No interval set';
};

export interface MaintenanceItemForDisplay {
  serviceName: string;
  lastDoneAtDate?: number | null;
  lastDoneAtMileage?: number | null;
  nextDueDate?: number | null;
  nextDueMileage?: number | null;
  intervalMiles?: number | null;
  intervalMonths?: number | null;
}

export function getMostRecentCompletedMaintenanceItem<
  T extends MaintenanceItemForDisplay,
>(items: T[]): T | null {
  const completed = items.filter((item) => item.lastDoneAtDate != null);
  if (completed.length === 0) return null;
  return completed.sort(
    (a, b) => (b.lastDoneAtDate ?? 0) - (a.lastDoneAtDate ?? 0),
  )[0];
}

export function getNextDueMaintenanceItem<T extends MaintenanceItemForDisplay>(
  items: T[],
): T | null {
  const withNextDue = items.filter(
    (item) =>
      item.lastDoneAtDate != null &&
      (item.nextDueDate != null || item.nextDueMileage != null),
  );
  const neverDone = items.filter((item) => item.lastDoneAtDate == null);

  if (withNextDue.length > 0) {
    const sorted = [...withNextDue].sort((a, b) => {
      const aDate = a.nextDueDate ?? Number.POSITIVE_INFINITY;
      const bDate = b.nextDueDate ?? Number.POSITIVE_INFINITY;
      if (aDate !== bDate) {
        return aDate - bDate;
      }
      const aMiles = a.nextDueMileage ?? Number.POSITIVE_INFINITY;
      const bMiles = b.nextDueMileage ?? Number.POSITIVE_INFINITY;
      return aMiles - bMiles;
    });
    return sorted[0];
  }
  return neverDone.length > 0 ? neverDone[0] : null;
}

export function formatRecentActivitySubtitle(
  item: MaintenanceItemForDisplay | null,
): string {
  if (!item) return 'No recent activity';
  const parts = [
    item.lastDoneAtMileage != null
      ? `${item.lastDoneAtMileage.toLocaleString()} mi`
      : '',
    formatDateFull(item.lastDoneAtDate),
  ].filter(Boolean);
  return parts.join('\n');
}

export function formatNextActivitySubtitle(
  item: MaintenanceItemForDisplay | null,
): string {
  if (!item) return 'No upcoming maintenance';
  const hasBeenDone = item.lastDoneAtDate != null;
  if (!hasBeenDone) {
    return formatMaintenanceIntervalDisplay(
      item.intervalMiles ?? undefined,
      item.intervalMonths ?? undefined,
    );
  }
  if (item.nextDueMileage != null) {
    return `${item.nextDueMileage.toLocaleString()} mi`;
  }
  return 'No interval set';
}

export function formatRecentActivityDescription(
  item: MaintenanceItemForDisplay | null,
): string | undefined {
  if (!item?.lastDoneAtMileage) return undefined;
  return `${item.lastDoneAtMileage.toLocaleString()} mi`;
}

export function formatRecentActivityFooter(
  item: MaintenanceItemForDisplay | null,
): string | undefined {
  if (!item?.lastDoneAtDate) return undefined;
  return formatDateFull(item.lastDoneAtDate, 'MMM d, yyyy', '');
}

export function formatNextActivityDescription(
  item: MaintenanceItemForDisplay | null,
): string | undefined {
  if (!item?.nextDueMileage) return undefined;
  return `Due at ${item.nextDueMileage.toLocaleString()} mi`;
}

export function formatNextActivityFooter(
  item: MaintenanceItemForDisplay | null,
): string | undefined {
  if (!item) return undefined;
  return formatMaintenanceInterval(item.intervalMiles);
}

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

export const isEmptyNumber = (value: number | null | undefined): boolean => {
  return !value || value === 0;
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

export const formatNumberForDisplay = (
  value: number | undefined | null,
): string => {
  if (!value || value === 0) {
    return '';
  }

  return value.toLocaleString();
};

export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || value === 0) {
    return '';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

/** Formats a number for display in a currency input: thousands separators and 2 decimals (no $). */
export const formatCurrencyForInput = (
  value: number | undefined | null,
): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getInitials = (fullName: string | null | undefined) => {
  if (!fullName) {
    return '?';
  }
  const names = fullName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const formatUserSecondaryText = (email?: string | null): string => {
  return email || 'No contact info';
};

export const formatUserName = (name?: string | null): string => {
  return name ?? 'Guest User';
};

export const getDisplayValue = (
  value: string | number | null | undefined,
  label: string,
): string => {
  if (value && String(value).trim() !== '') {
    return String(value);
  }

  return `No ${label.toLowerCase()} provided`;
};

export const parseRawNumberInput = (
  text: string,
  isCurrency = false,
): string => {
  let cleanText = text.replace(/,/g, '').replace(/[^0-9.]/g, '');

  const parts = cleanText.split('.');
  if (parts.length > 2) {
    cleanText = parts[0] + '.' + parts.slice(1).join('');
  }

  if (isCurrency && parts.length > 1) {
    cleanText = parts[0] + '.' + parts[1].slice(0, 2);
  }

  return cleanText;
};

export const getNumberDisplayText = (
  value: number,
  isCurrency: boolean,
): string => {
  if (value === 0) return '';
  return isCurrency
    ? value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : value.toLocaleString('en-US');
};
