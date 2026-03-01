import React from 'react';
import tw from '../../styles/tw';
import { CustomText } from './CustomText';
import { AppPressable } from './AppPressable';
import { resolvePressableStyle } from '@/utils/style';

type Props = React.ComponentProps<typeof AppPressable> & {
  title: string;
};

export function PrimaryButton({
  title,
  style,
  isLoading,
  disabled,
  ...rest
}: Props) {
  return (
    <AppPressable
      {...rest}
      isLoading={isLoading}
      disabled={disabled}
      style={(state) => [
        tw.style(
          'bg-primary rounded-md py-3 items-center justify-center border border-white border-[0.5px]',
        ),
        resolvePressableStyle(state, style),
      ]}
      android_ripple={{ color: '#1D4ED8' }}
      spinnerColor={tw.color('ink-700')}
    >
      <CustomText style={tw`text-ink-700 font-semibold`}>{title}</CustomText>
    </AppPressable>
  );
}
