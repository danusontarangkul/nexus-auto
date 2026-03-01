import React from 'react';
import { View, ViewProps } from 'react-native';
import tw from '@/styles/tw';

type Props = ViewProps & {
  gap?: number;
};

export function InputGroup({ children, style, gap = 1, ...props }: Props) {
  return (
    <View style={[tw`gap-${gap}`, style]} {...props}>
      {children}
    </View>
  );
}
