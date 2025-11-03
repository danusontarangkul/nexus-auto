import React from 'react';
import { View, ViewProps } from 'react-native';
import tw from '../../styles/tw';

export function Screen({ style, ...rest }: ViewProps) {
  return (
    <View
      style={tw.style(`flex-1 bg-surface-50 px-5 py-4`, style as any)}
      {...rest}
    />
  );
}
