import { View } from 'react-native';
import { StaticField } from '../texts/StaticField';
import { NumberInput } from './NumberInput';
import { TextInputProps } from 'react-native';
import { formatCurrency, formatNumberForDisplay } from '@/utils/format';

type Props = Omit<TextInputProps, 'onChangeText' | 'value'> & {
  label: string;
  value: number;
  isEditing: boolean;
  onChangeNumber: (value: number) => void;
  errorText?: string | null;
  onClear?: () => void;
  isCurrency?: boolean;
};

export function ControlledNumberInput({
  label,
  value,
  isEditing,
  onChangeNumber,
  errorText,
  onClear,
  isCurrency,
  ...props
}: Props) {
  if (!isEditing) {
    const displayValue = isCurrency
      ? formatCurrency(value)
      : formatNumberForDisplay(value);
    return <StaticField label={label} value={displayValue} />;
  }

  return (
    <View>
      <NumberInput
        label={label}
        value={value}
        onChangeNumber={onChangeNumber}
        errorText={errorText}
        onClear={onClear}
        isCurrency={isCurrency}
        {...props}
      />
    </View>
  );
}
