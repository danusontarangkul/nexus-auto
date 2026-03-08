import tw from '@/styles/tw';
import { View, ViewProps } from 'react-native';

export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      style={[
        tw.style('bg-surface-800 rounded-xl p-4 border border-surface-border'),
        style,
      ]}
      {...rest}
    />
  );
}
