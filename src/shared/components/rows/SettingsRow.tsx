import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '../texts/CustomText';
import tw from '@/styles/tw';

export interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  destructive?: boolean;
  onPress?: () => void;
}

export function SettingsRow({
  icon,
  label,
  destructive,
  onPress,
}: SettingsRowProps) {
  const textColor = destructive ? tw.color('error-500') : tw.color('ink-900');
  const iconColor = destructive ? tw.color('error-500') : tw.color('ink-900');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={tw`flex-row items-center bg-surface-800 rounded-xl px-4 py-3.5 mb-2`}
    >
      <Ionicons name={icon} size={22} color={iconColor} style={tw`mr-3`} />
      <CustomText variant="body" style={[tw`flex-1`, { color: textColor }]}>
        {label}
      </CustomText>
      <Ionicons name="chevron-forward" size={20} color={tw.color('ink-500')} />
    </TouchableOpacity>
  );
}
