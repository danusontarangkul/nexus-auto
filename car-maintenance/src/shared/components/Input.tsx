import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import tw from '../../styles/tw';
import { CustomText } from './CustomText';

type Props = TextInputProps & {
  label?: string;
  errorText?: string;
};

export function Input({ label, errorText, ...props }: Props) {
  return (
    <View style={tw`w-full`}>
      {label ? <CustomText style={tw`text-ink-700 mb-1`}>{label}</CustomText> : null}
      <TextInput
        placeholderTextColor={tw.color('ink-400')}
        style={tw`w-full px-4 py-3 rounded-md bg-surface-800 border border-surface-border text-ink-900`}
        {...props}
      />
      {!!errorText && (
        <CustomText style={tw`text-[12px] text-red-400 mt-1`}>{errorText}</CustomText>
      )}
    </View>
  );
}
