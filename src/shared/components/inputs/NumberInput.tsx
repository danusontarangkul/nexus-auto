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
  const [textValue, setTextValue] = useState<string>(
    getNumberDisplayText(value, !!isCurrency),
  );

  useEffect(() => {
    const formatted = getNumberDisplayText(value, !!isCurrency);
    if (parseRawNumberInput(textValue, isCurrency) !== value.toString()) {
      setTextValue(formatted);
    }
  }, [value, isCurrency]);

  const handleChangeText = (text: string) => {
    const rawValue = parseRawNumberInput(text, isCurrency);

    const numericValue = parseFloat(rawValue);
    const finalNumericValue = isNaN(numericValue) ? 0 : numericValue;
    if (text.endsWith('.') || text.endsWith(',')) {
      setTextValue(text);
    } else {
      setTextValue(getNumberDisplayText(finalNumericValue, !!isCurrency));
    }

    onChangeNumber(finalNumericValue);
  };

  return (
    <Input
      {...props}
      isCurrency={isCurrency}
      onClear={() => {
        setTextValue('');
        onChangeNumber(0);
        onClear?.();
      }}
      keyboardType="decimal-pad"
      value={textValue}
      onChangeText={handleChangeText}
      onBlur={() => setTextValue(getNumberDisplayText(value, !!isCurrency))}
    />
  );
}
