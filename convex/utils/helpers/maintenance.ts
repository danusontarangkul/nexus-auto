import type { Doc, Id } from '../../_generated/dataModel';

export function calculateNextDueMileage(
  currentMileage: number,
  intervalMiles?: number,
): number | undefined {
  if (!intervalMiles) {
    return undefined;
  }
  return currentMileage + intervalMiles;
}

export function calculateNextDueDate(
  serviceDate: number,
  intervalMonths?: number,
): number | undefined {
  if (!intervalMonths) {
    return undefined;
  }

  const date = new Date(serviceDate);
  date.setMonth(date.getMonth() + intervalMonths);
  return date.getTime();
}

export type MaintenanceItemWithDue = Doc<'maintenanceItems'> & {
  lastDoneAtMileage?: number;
  lastDoneAtDate?: number;
  lastDoneRecordId?: Id<'serviceRecords'>;
  nextDueMileage?: number;
  nextDueDate?: number;
};

function recordMatchesItem(
  record: Doc<'serviceRecords'>,
  item: Doc<'maintenanceItems'>,
): boolean {
  return record.performed.some(
    (performed) =>
      performed.maintenanceItemId === item._id ||
      (performed.serviceName === item.serviceName &&
        performed.category === item.category),
  );
}

export function computeMaintenanceItemsWithDue(
  items: Doc<'maintenanceItems'>[],
  records: Doc<'serviceRecords'>[],
): MaintenanceItemWithDue[] {
  const activeRecords = records
    .filter((record) => record.isActive)
    .sort((a, b) => b.serviceDate - a.serviceDate);

  return items.map((item) => {
    const lastRecord = activeRecords.find((record) =>
      recordMatchesItem(record, item),
    );
    const lastDoneAtMileage = lastRecord?.mileage;
    const lastDoneAtDate = lastRecord?.serviceDate;
    const lastDoneRecordId = lastRecord?._id;

    const nextDueMileage =
      lastDoneAtMileage != null
        ? calculateNextDueMileage(lastDoneAtMileage, item.intervalMiles)
        : undefined;
    const nextDueDate =
      lastDoneAtDate != null
        ? calculateNextDueDate(lastDoneAtDate, item.intervalMonths)
        : undefined;

    return {
      ...item,
      lastDoneAtMileage,
      lastDoneAtDate,
      lastDoneRecordId,
      nextDueMileage,
      nextDueDate,
    };
  });
}
