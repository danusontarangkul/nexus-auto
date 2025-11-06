import React from 'react';
import { Pressable, Image, PressableProps } from 'react-native';
import tw from '../../styles/tw';
import { CustomText } from './CustomText';

type Props = PressableProps & { title?: string };

export function GoogleButton({
  title = 'Log in with Google',
  style,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={tw.style(
        'rounded-md py-3 px-4 border border-surface-border bg-transparent flex-row items-center justify-center',
        style as any,
      )}
      {...rest}
    >
      <Image
        source={require('../../../assets/google-icon.png')}
        style={{ width: 18, height: 18, marginRight: 10 }}
      />
      <CustomText style={tw`text-ink-700 font-medium`}>{title}</CustomText>
    </Pressable>
  );
}
