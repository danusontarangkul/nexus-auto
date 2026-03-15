import { Id } from '@convex/_generated/dataModel';
import { PerformedService } from '@convex/types';
import { ServiceCategoryType } from '@convex/types/literals';
import { InputGroup } from '@/shared/components/inputs/InputGroup';
import { ControlledCategoryPicker } from '@/shared/components/inputs/ControlledCategoryPicker';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { StaticField } from '@/shared/components/texts/StaticField';
import { FormCard } from '@/shared/components/cards/FormCard';
import { SERVICE_CATEGORIES, SERVICES_BY_CATEGORY } from '@/utils/const';
import { getCategoryDisplayName } from '../utils/utils';
import { isEmptyString } from '@/utils/format';

export type SpecificServiceOption = { label: string; value: string };

interface ServiceItemCardProps {
  index: number;
  service: PerformedService;
  isEditing: boolean;
  onUpdate: (updates: Partial<PerformedService>) => void;
  onRemove?: () => void;
  /** When provided, "Specific Service" uses these (e.g. vehicle maintenance items); value is Id<'maintenanceItems'> */
  specificServiceOptions?: SpecificServiceOption[];
}

export function ServiceItemCard({
  index,
  service,
  isEditing,
  onUpdate,
  onRemove,
  specificServiceOptions,
}: ServiceItemCardProps) {
  const specificOptions =
    specificServiceOptions ?? SERVICES_BY_CATEGORY[service.category] ?? [];

  return (
    <FormCard title={`Service #${index + 1}`} onRemove={onRemove}>
      <InputGroup gap={4}>
        {isEditing ? (
          <>
            <ControlledCategoryPicker
              label="Category"
              value={service.category}
              options={SERVICE_CATEGORIES}
              onSelect={(val) =>
                onUpdate({
                  category: val as ServiceCategoryType,
                })
              }
              isEditing
            />

            <ControlledCategoryPicker
              label="Specific Service"
              value={service.maintenanceItemId || ''}
              options={specificOptions}
              onSelect={(val) =>
                onUpdate({
                  maintenanceItemId: val as Id<'maintenanceItems'>,
                })
              }
              isEditing
            />

            <ControlledInput
              label="Service Name"
              value={service.serviceName}
              onChangeText={(val) => onUpdate({ serviceName: val })}
              isEditing
              placeholder="What was serviced?"
            />

            <ControlledInput
              label="Notes"
              value={service.notes || ''}
              onChangeText={(val) => onUpdate({ notes: val })}
              isEditing
              multiline
              placeholder="Add any notes about the service"
            />
          </>
        ) : (
          <>
            <StaticField
              label="Category"
              value={getCategoryDisplayName(service.category)}
            />
            <StaticField label="Service Name" value={service.serviceName} />
            {!isEmptyString(service.notes) && (
              <StaticField label="Notes" value={service.notes} />
            )}
          </>
        )}
      </InputGroup>
    </FormCard>
  );
}
