import React from 'react';
import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../CustomText';
import { Input } from '../Input';
import { TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label: string;
  value: string;
  isEditing: boolean;
  errorText?: string | null;
  onClear?: () => void;
};

export function ControlledInput({
  label,
  value,
  isEditing,
  errorText,
  onClear,
  ...props
}: Props) {
  if (!isEditing) {
    return (
      <View style={tw`mb-4`}>
        <CustomText variant="detail" style={tw`text-ink-700 mb-1`}>
          {label}
        </CustomText>
        <View style={tw`py-2 border-b border-transparent`}>
          <CustomText
            variant="body"
            style={tw.style('text-ink-900', !value && 'text-ink-400 italic')}
          >
            {value || `No ${label.toLowerCase()} provided`}
          </CustomText>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`mb-4`}>
      <Input
        label={label}
        value={value}
        errorText={errorText}
        onClear={onClear}
        {...props}
      />
    </View>
  );
}
