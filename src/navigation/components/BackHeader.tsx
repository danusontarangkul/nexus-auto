import { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';

type Props = {
  title?: string;
  hideBack?: boolean;
  onBackPress?: () => void;
  skipTopInset?: boolean;
  rightElement?: ReactNode;
  leftElement?: ReactNode;
};

export function BackHeader({
  title,
  hideBack,
  onBackPress,
  skipTopInset,
  rightElement,
  leftElement,
}: Props) {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={tw.style('bg-surface-950 border-b border-surface-border', {
        paddingTop: skipTopInset ? 12 : insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 16,
      })}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`w-10`}>
          {leftElement ? (
            <View style={tw`w-10 h-10 items-center justify-center -ml-2`}>
              {leftElement}
            </View>
          ) : !hideBack ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onBackPress ?? (() => nav.goBack())}
              style={tw`w-10 h-10 items-center justify-center -ml-2`}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={tw.color('ink-900')}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={tw`flex-1 items-center`}>
          {!!title && (
            <CustomText variant="titleLg" color={tw.color('ink-900')}>
              {title}
            </CustomText>
          )}
        </View>

        <View style={tw`w-10 items-center justify-center`}>
          {rightElement ? (
            <View style={tw`w-10 h-10 items-center justify-center -mr-2`}>
              {rightElement}
            </View>
          ) : (
            <View style={tw`w-10`} />
          )}
        </View>
      </View>
    </View>
  );
}
