import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';
import tw from '../../styles/tw';

type Props = PressableProps & {
  title: string;
};

export function PrimaryButton({ title, style, ...rest }: Props) {
  return (
    <Pressable
      style={tw.style(`px-4 py-3 rounded-2xl bg-primary-600`, style as any)}
      {...rest}
    >
      <Text style={tw`text-white font-semibold text-base text-center`}>
        {title}
      </Text>
    </Pressable>
  );
}
