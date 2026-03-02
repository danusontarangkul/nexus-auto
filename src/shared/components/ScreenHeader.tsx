import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { CustomText } from './CustomText';
import tw from '@/styles/tw';

interface Props {
  title: string;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({ title, style }: Props) {
  return (
    <View style={[tw`mb-6`, style]}>
      <CustomText variant="titleXL" color={tw.color('ink-900')}>
        {title}
      </CustomText>
    </View>
  );
}
