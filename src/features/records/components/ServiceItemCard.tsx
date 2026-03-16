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

/** Values from static category options (not maintenance item ids). Used to avoid setting maintenanceItemId for static choices. */
const STATIC_SPECIFIC_VALUES = new Set(
  Object.values(SERVICES_BY_CATEGORY)
    .flat()
    .map((o) => o.value),
);

export type SpecificServiceOption = { label: string; value: string };

interface ServiceItemCardProps {
  index: number;
  service: PerformedService;
  isEditing: boolean;
  onUpdate: (updates: Partial<PerformedService>) => void;
  onRemove?: () => void;
  specificServiceOptions?: SpecificServiceOption[];
}

const CUSTOM_OPTION = { label: 'Custom', value: 'other' } as const;

export function ServiceItemCard({
  index,
  service,
  isEditing,
  onUpdate,
  onRemove,
  specificServiceOptions,
}: ServiceItemCardProps) {
  const baseOptions =
    specificServiceOptions ?? SERVICES_BY_CATEGORY[service.category] ?? [];
  const hasOther = baseOptions.some((o) => o.value === 'other');
  const specificOptions =
    specificServiceOptions && !hasOther
      ? [...baseOptions, CUSTOM_OPTION]
      : baseOptions;

  const specificValue =
    service.maintenanceItemId ??
    specificOptions.find((o) => o.label === service.serviceName)?.value ??
    'other';
  const isOtherSelected = specificValue === 'other';

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
              value={specificValue}
              options={specificOptions}
              onSelect={(val) => {
                if (val === 'other') {
                  onUpdate({ maintenanceItemId: undefined, serviceName: '' });
                  return;
                }
                const option = specificOptions.find((o) => o.value === val);
                const serviceName = option?.label ?? service.serviceName;
                if (STATIC_SPECIFIC_VALUES.has(val)) {
                  onUpdate({ maintenanceItemId: undefined, serviceName });
                  return;
                }
                onUpdate({
                  maintenanceItemId: val as Id<'maintenanceItems'>,
                  serviceName,
                });
              }}
              isEditing
            />

            {isOtherSelected && (
              <ControlledInput
                label="Service Name"
                value={service.serviceName}
                onChangeText={(val) => onUpdate({ serviceName: val })}
                isEditing
                placeholder="What was serviced?"
              />
            )}

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
