import { Doc } from '../../_generated/dataModel';
import { PerformedService, ServiceRecordUpdateFields } from '../../types';

export const formatPerformedItems = (items: PerformedService[]) => {
  return items.map((item) => ({
    category: item.category,
    serviceName: item.serviceName,
    notes: item.notes ?? undefined,
    warrantyId: item.warrantyId ?? undefined,
    maintenanceItemId: item.maintenanceItemId ?? undefined,
  }));
};

export const buildServiceRecordPatchPayload = (
  updates: ServiceRecordUpdateFields,
  now: number,
): Partial<Doc<'serviceRecords'>> => {
  const payload: Partial<Doc<'serviceRecords'>> = {
    updatedAt: now,
  };
  if (updates.performed !== undefined) {
    payload.performed = formatPerformedItems(updates.performed);
  }
  if (updates.serviceCenter !== undefined) {
    payload.serviceCenter = updates.serviceCenter ?? null;
  }
  if (updates.serviceDate !== undefined) {
    payload.serviceDate = updates.serviceDate;
  }
  if (updates.mileage !== undefined) {
    payload.mileage = updates.mileage;
  }
  return payload;
};
