import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import tw from '@/styles/tw';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ButtonContainer({ children, style }: Props) {
  return <View style={[tw`mt-6 gap-4`, style]}>{children}</View>;
}
