import React from 'react';
import { Input } from '../Input';
import { TextInputProps } from 'react-native';

type NumberInputProps = Omit<TextInputProps, 'onChangeText' | 'value'> & {
  label?: string;
  value: number;
  onChangeNumber: (value: number) => void;
  errorText?: string | null;
};

export function NumberInput({
  value,
  onChangeNumber,
  ...props
}: NumberInputProps) {
  const handleChangeText = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, '');
    const numberValue = parseFloat(cleanText);
    onChangeNumber(isNaN(numberValue) ? 0 : numberValue);
  };

  return (
    <Input
      {...props}
      keyboardType="decimal-pad"
      value={value === 0 ? '' : value.toString()}
      onChangeText={handleChangeText}
    />
  );
}
