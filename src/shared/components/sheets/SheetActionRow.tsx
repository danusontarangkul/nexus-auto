import type { ComponentProps } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/styles/tw';
import { palette } from '@/styles/theme';
import { CustomText } from '@/shared/components/texts/CustomText';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

type SheetActionRowProps = {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SheetActionRow({
  icon,
  label,
  onPress,
  style,
}: SheetActionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        tw`flex-row items-center gap-3 px-4 py-3 rounded-2xl bg-surface-800`,
        style,
      ]}
    >
      <View
        style={tw`w-10 h-10 rounded-full bg-primary-500/10 items-center justify-center`}
      >
        <Ionicons name={icon} size={22} color={palette.primary[500]} />
      </View>
      <CustomText variant="body" style={tw`text-white font-semibold`}>
        {label}
      </CustomText>
    </Pressable>
  );
}
