import { View, TouchableOpacity, ScrollView } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../texts/CustomText';

export interface FilterOption<T> {
  value: T;
  label: string;
}

interface SegmentedFilterProps<T> {
  options: FilterOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  containerStyle?: string;
}

export function SegmentedFilter<T extends string>({
  options,
  selected,
  onChange,
  containerStyle,
}: SegmentedFilterProps<T>) {
  return (
    <View style={tw.style('mb-4', containerStyle)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`flex-row gap-6 px-4`}
      >
        {options.map(({ value, label }) => {
          const isSelected = selected === value;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => onChange(value)}
              activeOpacity={0.7}
              style={tw`pb-2`} // Increased padding slightly for the underline
            >
              <CustomText
                variant="body"
                style={tw.style(
                  isSelected ? 'font-bold text-ink-900' : 'text-ink-400',
                )}
              >
                {label}
              </CustomText>
              {isSelected && (
                <View
                  style={tw`absolute bottom-0 left-0 right-0 h-0.5 bg-ink-900 rounded-full`}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
