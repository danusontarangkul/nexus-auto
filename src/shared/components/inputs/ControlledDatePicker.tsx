import tw from '@/styles/tw';
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Modal } from 'react-native';
import { CustomText } from '../CustomText';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { getDisplayDate, getSafePickerDate } from '@/utils/format';

type Props = {
  label: string;
  value: Date | null;
  isEditing: boolean;
  onDateChange: (date: Date) => void;
};

export function ControlledDatePicker({
  label,
  value,
  isEditing,
  onDateChange,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const displayText = getDisplayDate(value, isEditing);

  const openPicker = () => isEditing && setShowPicker(true);
  const closePicker = () => setShowPicker(false);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      onDateChange(selectedDate);
    }
    if (Platform.OS !== 'ios') {
      closePicker();
    }
  };

  return (
    <View style={tw`mb-4`}>
      <CustomText color={tw.color('ink-500') as string}>{label}</CustomText>

      <TouchableOpacity
        disabled={!isEditing}
        onPress={openPicker}
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

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={tw`flex-1 justify-end bg-black/40`}>
          <View style={tw`bg-surface rounded-t-3xl pb-10`}>
            <View
              style={tw`flex-row justify-between p-4 border-b border-surface-border`}
            >
              <TouchableOpacity onPress={closePicker}>
                <CustomText color={tw.color('ink-500') as string}>
                  Cancel
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity onPress={closePicker}>
                <CustomText
                  color={tw.color('primary-500') as string}
                  variant="body"
                  style={tw`font-semibold`}
                >
                  Done
                </CustomText>
              </TouchableOpacity>
            </View>
            <View style={tw`p-2`}>
              <DateTimePicker
                value={getSafePickerDate(value)}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleChange}
                themeVariant="light"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
