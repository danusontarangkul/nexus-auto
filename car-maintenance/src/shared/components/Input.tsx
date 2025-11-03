import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import tw from '../../styles/tw';

export function Input(props: TextInputProps) {
  return (
    <View style={tw`w-full`}>
      <TextInput
        placeholderTextColor="#94a3b8"
        style={tw`w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-ink-900`}
        {...props}
      />
    </View>
  );
}
