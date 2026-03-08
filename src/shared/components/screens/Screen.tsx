import { View, ViewProps } from 'react-native';
import tw from '@/styles/tw';

export function Screen({ style, ...rest }: ViewProps) {
  return (
    <View style={[tw.style('flex-1 bg-surface-950 px-5'), style]} {...rest} />
  );
}
