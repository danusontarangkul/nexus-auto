import { PerformedService } from '../../types';

export const formatPerformedItems = (items: PerformedService[]) => {
  return items.map((item) => ({
    category: item.category,
    serviceName: item.serviceName,
    notes: item.notes ?? undefined,
    warrantyId: item.warrantyId ?? undefined,
    maintenanceItemId: item.maintenanceItemId ?? undefined,
  }));
};
