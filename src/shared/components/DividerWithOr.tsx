import React from 'react';
import { View } from 'react-native';
import tw from '../../styles/tw';
import { CustomText } from './CustomText';

export function DividerWithOr() {
  return (
    <View style={tw`flex-row items-center my-4`}>
      <View style={tw`h-[1px] flex-1 bg-surface-border`} />
      <CustomText style={tw`mx-3 text-ink-500`}>Or</CustomText>
      <View style={tw`h-[1px] flex-1 bg-surface-border`} />
    </View>
  );
}
