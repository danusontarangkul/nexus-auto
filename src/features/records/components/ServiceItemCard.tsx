import { Id } from '@convex/_generated/dataModel';
import { MaintenanceItemWithDue, PerformedService } from '@convex/types';
import { ServiceCategoryType } from '@convex/types/literals';
import { InputGroup } from '@/shared/components/inputs/InputGroup';
import { ControlledCategoryPicker } from '@/shared/components/inputs/ControlledCategoryPicker';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { StaticField } from '@/shared/components/texts/StaticField';
import { FormCard } from '@/shared/components/cards/FormCard';
import { SERVICE_CATEGORIES } from '@/utils/const';
import {
  getCategoryDisplayName,
  getDefaultRoutinePerformedService,
  getServiceItemDerivedState,
  SpecificServiceOption,
  STATIC_SPECIFIC_VALUES,
} from '../utils/utils';
import { isEmptyString } from '@/utils/format';

interface ServiceItemCardProps {
  index: number;
  service: PerformedService;
  isEditing: boolean;
  onUpdate: (updates: Partial<PerformedService>) => void;
  onRemove?: () => void;
  specificServiceOptions?: SpecificServiceOption[];
  maintenanceItems?: MaintenanceItemWithDue[];
}

export function ServiceItemCard({
  index,
  service,
  isEditing,
  onUpdate,
  onRemove,
  specificServiceOptions,
  maintenanceItems,
}: ServiceItemCardProps) {
  const { specificOptions, specificValue, isOtherSelected } =
    getServiceItemDerivedState(service, specificServiceOptions);

  const handleCategorySelect = (val: string) => {
    const next = val as ServiceCategoryType;
    if (next === 'routine') {
      onUpdate(getDefaultRoutinePerformedService(maintenanceItems));
      return;
    }
    onUpdate({ category: next });
  };

  const handleServiceSelect = (val: string) => {
    if (val === 'other') {
      onUpdate({ maintenanceItemId: undefined, serviceName: '' });
      return;
    }

    const option = specificOptions.find((opt) => opt.value === val);
    const serviceName = option?.label ?? service.serviceName;

    if (STATIC_SPECIFIC_VALUES.has(val)) {
      onUpdate({ maintenanceItemId: undefined, serviceName });
      return;
    }

    onUpdate({
      maintenanceItemId: val as Id<'maintenanceItems'>,
      serviceName,
    });
  };

  return (
    <FormCard title={`Service #${index + 1}`} onRemove={onRemove}>
      <InputGroup gap={4}>
        {isEditing ? (
          <>
            <ControlledCategoryPicker
              label="Category"
              value={service.category}
              options={SERVICE_CATEGORIES}
              onSelect={handleCategorySelect}
              isEditing
            />

            <ControlledCategoryPicker
              label="Specific Service"
              value={specificValue}
              options={specificOptions}
              onSelect={handleServiceSelect}
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
