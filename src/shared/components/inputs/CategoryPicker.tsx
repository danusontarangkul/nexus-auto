import { View, TouchableOpacity } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../texts/CustomText';

interface CategoryOption {
  label: string;
  value: string;
}

interface CategoryPickerProps {
  label?: string;
  options: CategoryOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  error?: string;
}

export function CategoryPicker({
  label = 'Category',
  options,
  selectedValue,
  onSelect,
  error,
}: CategoryPickerProps) {
  return (
    <View style={tw`mb-4`}>
      <CustomText variant="detail" style={tw`text-ink-700 mb-3`}>
        {label}
      </CustomText>

      <View style={tw`flex-row flex-wrap gap-2`}>
        {options.map((option) => {
          const isActive = selectedValue === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
              style={tw.style(
                'px-4 py-3 rounded-xl bg-surface-800 min-w-[30%]',
                isActive && 'border-2 border-primary-500 bg-surface-700',
              )}
            >
              <CustomText
                variant="body"
                style={tw.style(
                  'text-center font-bold',
                  isActive ? 'text-white' : 'text-ink-300',
                )}
              >
                {option.label}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <CustomText style={tw`text-red-500 text-xs mt-1`}>{error}</CustomText>
      )}
    </View>
  );
}
