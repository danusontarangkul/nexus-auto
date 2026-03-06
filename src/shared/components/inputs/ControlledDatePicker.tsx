import tw from '@/styles/tw';
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from '../CustomText';
import { getDisplayDate } from '@/utils/format';
import { DatePickerModal } from './DatePickerModal';

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
        <CustomText
          variant="body"
          color={
            !value && isEditing ? tw.color('primary-500') : tw.color('ink-900')
          }
        >
          {displayText}
        </CustomText>
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
