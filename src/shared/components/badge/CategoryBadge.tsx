import { View, ViewStyle } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../texts/CustomText';

interface CategoryBadgeProps {
  label: string;
  style?: ViewStyle;
}

export function CategoryBadge({ label, style }: CategoryBadgeProps) {
  return (
    <View style={[tw`px-3 py-1.5 rounded-full bg-surface-200`, style]}>
      <CustomText variant="detail" style={tw`text-ink-900`}>
        {label}
      </CustomText>
    </View>
  );
}
