import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import tw from '../../styles/tw';
import { CustomText } from './CustomText';

type Props = PressableProps & { title: string };

export function PrimaryButton({ title, style, ...rest }: Props) {
  return (
    <Pressable
      style={tw.style(
        'bg-primary rounded-md py-3 items-center justify-center border border-white border-[0.5px]',
        style as any,
      )}
      android_ripple={{ color: '#1D4ED8' }}
      {...rest}
    >
      <CustomText style={tw`text-ink-700 font-semibold`}>{title}</CustomText>
    </Pressable>
  );
}
