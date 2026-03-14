import tw from '@/styles/tw';
import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from '../texts/CustomText';
import { getDisplayDate } from '@/utils/format';
import { DatePickerModal } from './DatePickerModal';
import { StaticField } from '../texts/StaticField';

type Props = {
  label: string;
  value: Date | null;
  isEditing: boolean;
  onDateChange: (date: Date) => void;
};

export function ControlledDatePicker({
  label,
  value,
  isEditing = true,
  onDateChange,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const displayText = getDisplayDate(value, isEditing);

  if (!isEditing) {
    return <StaticField label={label} value={displayText} />;
  }

  return (
    <View>
      <CustomText variant="label" style={tw`mb-1`}>
        {label}
      </CustomText>

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={tw`w-full px-4 py-2 rounded-md bg-surface-800 border border-surface-border`}
        activeOpacity={0.7}
      >
        <CustomText
          style={tw.style(
            'text-base',
            displayText === 'Select Date' ? 'text-ink-400' : 'text-ink-900',
          )}
        >
          {displayText}
        </CustomText>
      </TouchableOpacity>

      <View style={tw`h-5 mt-1`} />

      <DatePickerModal
        isVisible={showPicker}
        value={value}
        onClose={() => setShowPicker(false)}
        onConfirm={onDateChange}
      />
    </View>
  );
}
