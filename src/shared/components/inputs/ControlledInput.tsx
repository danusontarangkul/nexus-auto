import React from 'react';
import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../CustomText';
import { Input } from '../Input';
import { TextInputProps } from 'react-native';
import { StaticField } from '../texts/StaticField';

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
    return <StaticField label={label} value={value} />;
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
