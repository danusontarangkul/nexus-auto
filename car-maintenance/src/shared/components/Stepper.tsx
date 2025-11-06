import React from 'react';
import { View } from 'react-native';
import tw from '../../styles/tw';

type Props = { total: number; current: number }; // 1-based index

export function Stepper({ total, current }: Props) {
  return (
    <View style={tw`flex-row gap-2 mt-3 justify-center`}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i + 1 === current;
        return (
          <View
            key={i}
            style={tw.style('rounded-full', {
              width: active ? 22 : 8,
              height: 8,
              backgroundColor: active
                ? tw.color('ink-900')
                : tw.color('surface-700'),
            })}
          />
        );
      })}
    </View>
  );
}
