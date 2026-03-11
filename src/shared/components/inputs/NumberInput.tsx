import { useState, useEffect } from 'react';
import { Input } from './Input';
import { TextInputProps } from 'react-native';
import { getNumberDisplayText, parseRawNumberInput } from '@/utils/format';

type NumberInputProps = Omit<TextInputProps, 'onChangeText' | 'value'> & {
  label?: string;
  value: number;
  onChangeNumber: (value: number) => void;
  errorText?: string | null;
  onClear?: () => void;
  isCurrency?: boolean;
};

export function NumberInput({
  value,
  onChangeNumber,
  onClear,
  isCurrency,
  ...props
}: NumberInputProps) {
  const [textValue, setTextValue] = useState<string>('');

  useEffect(() => {
    const display = getNumberDisplayText(value, !!isCurrency);
    if (parseFloat(textValue) !== value) {
      setTextValue(display);
    }
  }, [value, isCurrency]);

  const handleChangeText = (text: string) => {
    const cleanText = parseRawNumberInput(text, isCurrency);
    setTextValue(cleanText);

    const numericValue = parseFloat(cleanText);
    onChangeNumber(isNaN(numericValue) ? 0 : numericValue);
  };

  return (
    <Input
      {...props}
      isCurrency={isCurrency}
      onClear={() => {
        setTextValue('');
        onClear?.();
      }}
      keyboardType="decimal-pad"
      value={textValue}
      onChangeText={handleChangeText}
      onBlur={() => setTextValue(getNumberDisplayText(value, !!isCurrency))}
    />
  );
}
