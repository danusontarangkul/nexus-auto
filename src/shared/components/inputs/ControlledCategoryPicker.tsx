import { View } from 'react-native';
import tw from '@/styles/tw';
import { StaticField } from '../texts/StaticField';
import { CategoryPicker } from './CategoryPicker';
import { CategoryOption } from '@convex/types';

interface ControlledCategoryPickerProps {
  label: string;
  value: string;
  options: CategoryOption[];
  isEditing: boolean;
  onSelect: (value: string) => void;
  errorText?: string | null;
}

export function ControlledCategoryPicker({
  label,
  value,
  options,
  isEditing,
  onSelect,
  errorText,
}: ControlledCategoryPickerProps) {
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : value;

  if (!isEditing) {
    return <StaticField label={label} value={displayValue} />;
  }

  return (
    <View style={tw`mb-4`}>
      <CategoryPicker
        label={label}
        options={options}
        selectedValue={value}
        onSelect={onSelect}
        error={errorText ?? undefined}
      />
    </View>
  );
}
