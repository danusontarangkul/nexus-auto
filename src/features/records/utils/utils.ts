import { FilterLogicMap } from '@/shared/hooks/useFilter';
import {
  ROUTINE_DEFAULT_SERVICE_LABEL,
  SERVICE_CATEGORIES,
  SERVICES_BY_CATEGORY,
} from '@/utils/const';
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

const STATIC_SPECIFIC_SERVICE_VALUES = new Set(
  Object.values(SERVICES_BY_CATEGORY)
    .flat()
    .map((o) => o.value),
);

export function getDefaultRoutinePerformedService(
  maintenanceItems: MaintenanceItemWithDue[] | undefined,
): PerformedService {
  const options = getServiceOptionsForCategory(maintenanceItems, 'routine');
  const oil = options.find(
    (option) => option.label === ROUTINE_DEFAULT_SERVICE_LABEL,
  );

  if (!oil) {
    return {
      category: 'routine',
      serviceName: ROUTINE_DEFAULT_SERVICE_LABEL,
      notes: '',
    };
  }

  if (STATIC_SPECIFIC_SERVICE_VALUES.has(String(oil.value))) {
    return {
      category: 'routine',
      serviceName: oil.label,
      notes: '',
    };
  }

  return {
    category: 'routine',
    serviceName: oil.label,
    notes: '',
    maintenanceItemId: oil.value as Id<'maintenanceItems'>,
  };
}

export const STATIC_SPECIFIC_VALUES = new Set(
  Object.values(SERVICES_BY_CATEGORY)
    .flat()
    .map((o) => o.value),
);

export type SpecificServiceOption = { label: string; value: string };
export const CUSTOM_OPTION = { label: 'Custom', value: 'other' } as const;

export function getServiceItemDerivedState(
  service: PerformedService,
  specificServiceOptions?: SpecificServiceOption[],
) {
  const baseOptions: SpecificServiceOption[] =
    specificServiceOptions ?? SERVICES_BY_CATEGORY[service.category] ?? [];

  const hasOtherOption = baseOptions.some(
    (option) => option.value === CUSTOM_OPTION.value,
  );

  const specificOptions: SpecificServiceOption[] =
    specificServiceOptions && !hasOtherOption
      ? [...baseOptions, CUSTOM_OPTION]
      : baseOptions;

  const foundOption = specificOptions.find(
    (option) => option.label === service.serviceName,
  );

  const specificValue =
    service.maintenanceItemId ?? foundOption?.value ?? CUSTOM_OPTION.value;

  return {
    specificOptions,
    specificValue,
    isOtherSelected: specificValue === CUSTOM_OPTION.value,
  };
}
