import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../styles/tw';
import { CustomText } from './CustomText';

type Props = TextInputProps & {
  label?: string;
  errorText?: string | null;
  helperText?: string | null;
  onClear?: () => void;
};

export function Input({
  label,
  errorText,
  helperText,
  style,
  onClear,
  value,
  ...props
}: Props) {
  const message = errorText || helperText;
  const isError = !!errorText;
  const showClear = onClear && value && value.length > 0;

  return (
    <View style={tw`w-full`}>
      {label && (
        <CustomText variant="detail" style={tw`text-ink-700 mb-1`}>
          {label}
        </CustomText>
      )}

      <View style={tw`relative justify-center`}>
        <TextInput
          value={value}
          placeholderTextColor={tw.color('ink-400')}
          style={[
            tw`w-full px-4 py-3 rounded-md bg-surface-800 border text-ink-900`,
            isError ? tw`border-red-400` : tw`border-surface-border`,
            showClear && tw`pr-10`,
            style,
          ]}
          {...props}
        />

        {showClear && (
          <TouchableOpacity
            onPress={onClear}
            style={tw`absolute right-3 p-1`}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={tw.color('ink-400')}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={tw`h-5 mt-1 justify-center`}>
        {message ? (
          <CustomText
            variant="detail"
            style={[
              tw`text-[12px]`,
              isError ? tw`text-red-400` : tw`text-ink-500`,
            ]}
          >
            {message}
          </CustomText>
        ) : null}
      </View>
    </View>
  );
}
