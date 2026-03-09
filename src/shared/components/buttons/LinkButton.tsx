import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { AppPressable } from './AppPressable';

type LinkButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  isLoading?: boolean;
};

export function LinkButton({
  title,
  onPress,
  color = 'text-ink-300',
  style,
  disabled,
  isLoading,
}: LinkButtonProps) {
  const spinnerHex =
    tw.color(color.replace('text-', '')) || tw.color('ink-300');

  return (
    <AppPressable
      onPress={onPress}
      disabled={disabled}
      isLoading={isLoading}
      spinnerColor={spinnerHex}
      style={(state) => [
        tw`py-2 px-4 items-center justify-center`,
        state.pressed && tw`opacity-70`,
        style,
      ]}
    >
      <CustomText
        variant="body"
        style={[
          tw`${color} font-semibold underline`,
          disabled && tw`text-ink-500`,
        ]}
      >
        {title}
      </CustomText>
    </AppPressable>
  );
}
