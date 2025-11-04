import React from 'react';
import { Text, TextProps } from 'react-native';

export function CustomText({ style, ...props }: TextProps) {
  return (
    <Text
      style={[{ fontFamily: 'SourceSansPro_400Regular', color: '#F8FAFC' }, style]}
      {...props}
    />
  );
}