import { FilterLogicMap } from '@/shared/hooks/useFilter';
import { SERVICE_CATEGORIES, SERVICES_BY_CATEGORY } from '@/utils/const';
import { Doc } from '@convex/_generated/dataModel';
import { PerformedService } from '@convex/types';

export type RecordFilterType =
  | 'all'
  | (typeof SERVICE_CATEGORIES)[number]['value'];

export const RECORD_FILTER_OPTIONS: {
  value: RecordFilterType;
  label: string;
}[] = [{ value: 'all', label: 'All' }, ...SERVICE_CATEGORIES];

export const RECORD_FILTER_LOGIC: FilterLogicMap<Doc<'serviceRecords'>> =
  SERVICE_CATEGORIES.reduce(
    (acc, { value }) => ({
      ...acc,
      [value]: (record) => record.performed[0]?.category === value,
    }),
    {} as FilterLogicMap<Doc<'serviceRecords'>>,
  );

export const getEmptyMessage = (filter: RecordFilterType): string => {
  if (filter === 'all') {
    return 'No service records found';
  }
  const option = SERVICE_CATEGORIES.find((c) => c.value === filter);
  return option ? `No ${option.label} records` : 'No records found';
};

export const getServiceDisplayName = (
  currentName: string,
  category: string,
  templateValue: string,
): string => {
  if (currentName.trim().length > 0) {
    return currentName;
  }

  const options = SERVICES_BY_CATEGORY[category] || [];
  const selectedOption = options.find(
    (option) => option.value === templateValue,
  );

  return selectedOption?.label || '';
};

export const getServiceRecordLabels = (
  performed: PerformedService[],
): string[] => {
  if (!performed || performed.length === 0) return [];

  const uniqueCategoryLabels = Array.from(
    new Set(performed.map((p) => p.category)),
  ).map((catValue) => {
    return (
      SERVICE_CATEGORIES.find((c) => c.value === catValue)?.label || catValue
    );
  });

  const serviceNames = performed.map((p) => p.serviceName);

  return [...uniqueCategoryLabels, ...serviceNames].filter(Boolean);
};

export const getCategoryDisplayName = (category: string): string => {
  return (
    SERVICE_CATEGORIES.find((c) => c.value === category)?.label || category
  );
};
