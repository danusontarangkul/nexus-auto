import { FilterLogicMap } from '@/shared/hooks/useFilter';
import { SERVICE_CATEGORIES } from '@/utils/const';
import { Doc } from '@convex/_generated/dataModel';

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
