import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../styles/tw';
import { CustomText } from '../../shared/components/CustomText';

type Props = {
  title?: string;
  hideBack?: boolean;
  onBackPress?: () => void;
  /** Set to true when used as a stack header (navigator already applies top safe area) */
  skipTopInset?: boolean;
};

export function BackHeader({
  title,
  hideBack,
  onBackPress,
  skipTopInset,
}: Props) {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={tw.style('bg-surface-950 border-b border-surface-border', {
        paddingTop: skipTopInset ? 12 : insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 16,
        marginBottom: 30,
      })}
    >
      <View style={tw`flex-row items-center`}>
        {!hideBack && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onBackPress ?? (() => nav.goBack())}
            style={tw`w-10 h-10 items-center justify-center -ml-2`}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={tw.color('ink-900') as string}
            />
          </TouchableOpacity>
        )}

        <View style={tw`flex-1 items-center`}>
          {!!title && (
            <CustomText variant="titleLg" color={tw.color('ink-900') as string}>
              {title}
            </CustomText>
          )}
        </View>

        {/* right spacer to balance back button */}
        <View style={tw`w-10`} />
      </View>
    </View>
  );
}
