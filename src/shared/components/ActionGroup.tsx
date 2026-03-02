import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import tw from '@/styles/tw';
import { FormError } from './FormError';

interface ActionGroupProps {
  children: React.ReactNode;
  error?: string | null;
  style?: StyleProp<ViewStyle>;
}

export function ActionGroup({ children, error, style }: ActionGroupProps) {
  return (
    <View style={[tw`gap-1.5`, style]}>
      <FormError message={error} />
      {children}
    </View>
  );
}
