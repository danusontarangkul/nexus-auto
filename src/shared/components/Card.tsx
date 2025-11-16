import React from 'react';
import { View, ViewProps } from 'react-native';
import tw from '../../styles/tw';

export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      style={tw.style(
        'bg-surface-800 rounded-xl p-4 border border-surface-border',
        style as any,
      )}
      {...rest}
    />
  );
}
