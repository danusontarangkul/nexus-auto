import { FilterLogicMap } from '@/shared/hooks/useFilter';
import { SERVICE_CATEGORIES, SERVICES_BY_CATEGORY } from '@/utils/const';
import { Doc, Id } from '@convex/_generated/dataModel';
import { PerformedService, MaintenanceItemWithDue } from '@convex/types';
import { ServiceCategoryType } from '@convex/types/literals';

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
    new Set(performed.map((service) => service.category)),
  ).map((categoryValue) => {
    const matchingCategory = SERVICE_CATEGORIES.find(
      (categoryOption) => categoryOption.value === categoryValue,
    );
    return matchingCategory?.label || categoryValue;
  });

  const serviceNames = performed.map((service) => service.serviceName);

  return [...uniqueCategoryLabels, ...serviceNames].filter(Boolean);
};

export const getCategoryDisplayName = (category: string): string => {
  return (
    SERVICE_CATEGORIES.find((c) => c.value === category)?.label || category
  );
};

export type ServiceOption = {
  label: string;
  value: string | Id<'maintenanceItems'>;
};

export const getServiceOptionsForCategory = (
  maintenanceItems: MaintenanceItemWithDue[] | undefined,
  category: ServiceCategoryType,
): ServiceOption[] => {
  let maintenanceItemOptions: ServiceOption[] = [];

  if (maintenanceItems && maintenanceItems.length > 0) {
    // For Routine Maintenance, surface key scheduled tasks (oil change, tire rotation, etc.)
    // even if their underlying maintenance items live in more specific categories
    if (category === 'routine') {
      const routineStaticOptions = SERVICES_BY_CATEGORY['routine'] ?? [];
      const routineLabels = new Set(
        routineStaticOptions.map((option) => option.label),
      );

      maintenanceItemOptions = maintenanceItems
        .filter((item) => routineLabels.has(item.serviceName))
        .map((item) => ({ label: item.serviceName, value: item._id }));
    } else {
      maintenanceItemOptions = maintenanceItems
        .filter((item) => item.category === category)
        .map((item) => ({ label: item.serviceName, value: item._id }));
    }
  }

  const staticOptions: ServiceOption[] = SERVICES_BY_CATEGORY[category] ?? [];

  const optionsByLabel = new Map<string, ServiceOption>();

  for (const maintenanceItemOption of maintenanceItemOptions) {
    optionsByLabel.set(maintenanceItemOption.label, maintenanceItemOption);
  }

  for (const staticOption of staticOptions) {
    if (!optionsByLabel.has(staticOption.label)) {
      optionsByLabel.set(staticOption.label, staticOption);
    }
  }

  return Array.from(optionsByLabel.values());
};
