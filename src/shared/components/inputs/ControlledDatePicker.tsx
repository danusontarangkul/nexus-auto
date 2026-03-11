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
    <View style={tw`mb-4`}>
      <CustomText variant="label">{label}</CustomText>
      <TouchableOpacity
        disabled={!isEditing}
        onPress={() => setShowPicker(true)}
        style={tw.style('py-2 border-b', {
          'border-surface-border': isEditing,
          'border-transparent': !isEditing,
        })}
      >
        <CustomText variant="value">{displayText}</CustomText>
      </TouchableOpacity>

      <DatePickerModal
        isVisible={showPicker}
        value={value}
        onClose={() => setShowPicker(false)}
        onConfirm={onDateChange}
      />
    </View>
  );
}
