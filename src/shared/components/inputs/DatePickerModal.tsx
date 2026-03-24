import { View, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import tw from '@/styles/tw';
import { CustomText } from '../texts/CustomText';
import { getSafePickerDate } from '@/utils/format';

type DatePickerModalProps = {
  isVisible: boolean;
  value: Date | null;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  label?: string;
};

export function DatePickerModal({
  isVisible,
  value,
  onClose,
  onConfirm,
  label,
}: DatePickerModalProps) {
  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      onClose();
    }
    if (selectedDate) {
      onConfirm(selectedDate);
    }
  };

  if (Platform.OS !== 'ios') {
    return isVisible ? (
      <DateTimePicker
        value={getSafePickerDate(value)}
        mode="date"
        display="default"
        onChange={handleChange}
      />
    ) : null;
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={tw`flex-1 justify-end bg-black/40`}>
        <View style={tw`bg-surface rounded-t-3xl pb-10`}>
          <View
            style={tw`flex-row items-center justify-between p-4 border-b border-surface-border`}
          >
            <TouchableOpacity onPress={onClose} style={tw`flex-1`}>
              <CustomText color={tw.color('ink-500')}>Cancel</CustomText>
            </TouchableOpacity>

            {label && (
              <View style={tw`flex-2 items-center`}>
                <CustomText variant="body" style={tw`font-bold text-ink-900`}>
                  {label}
                </CustomText>
              </View>
            )}

            <TouchableOpacity onPress={onClose} style={tw`flex-1 items-end`}>
              <CustomText
                color={tw.color('primary-500')}
                variant="body"
                style={tw`font-semibold`}
              >
                Done
              </CustomText>
            </TouchableOpacity>
          </View>

          <View style={tw`w-full items-center`}>
            <DateTimePicker
              value={getSafePickerDate(value)}
              mode="date"
              display="inline"
              onChange={handleChange}
              themeVariant="light"
              style={tw`w-full`}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
