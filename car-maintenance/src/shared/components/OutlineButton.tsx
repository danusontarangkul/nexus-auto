import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import tw from '../../styles/tw';
import { CustomText } from './CustomText';

type Props = PressableProps & { title: string };

export function OutlineButton({ title, style, ...rest }: Props) {
  return (
    <Pressable
      style={tw.style(
        'bg-transparent rounded-xl py-3 items-center justify-center border border-surface-border',
        style as any,
      )}
      {...rest}
    >
      <CustomText style={tw`text-ink-500 font-medium`}>{title}</CustomText>
    </Pressable>
  );
}
