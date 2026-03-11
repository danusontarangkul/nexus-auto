import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/styles/tw';
import { CustomText } from '../texts/CustomText';

type Props = TextInputProps & {
  label?: string;
  errorText?: string | null;
  helperText?: string | null;
  onClear?: () => void;
  isCurrency?: boolean;
};

export function Input({
  label,
  errorText,
  helperText,
  style,
  onClear,
  value,
  isCurrency,
  ...props
}: Props) {
  const message = errorText || helperText;
  const isError = !!errorText;
  const showClear = onClear && value && value.length > 0;

  return (
    <View style={tw`w-full`}>
      {label && (
        <CustomText variant="label" style={tw`mb-1`}>
          {label}
        </CustomText>
      )}

      <View style={tw`relative justify-center`}>
        {isCurrency && (
          <View style={tw`absolute left-4 z-10`}>
            <CustomText style={tw`text-ink-400 text-base`}>$</CustomText>
          </View>
        )}

        <TextInput
          value={value}
          placeholderTextColor={tw.color('ink-400')}
          style={[
            tw`w-full py-3 rounded-md bg-surface-800 border text-ink-900`,
            isCurrency ? tw`pl-8 pr-4` : tw`px-4`,
            showClear && tw`pr-10`,
            isError ? tw`border-red-400` : tw`border-surface-border`,
            style,
          ]}
          {...props}
        />

        {showClear && (
          <TouchableOpacity
            onPress={onClear}
            style={tw`absolute right-3 p-1 z-10`}
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
        {message && (
          <CustomText
            variant="detail"
            style={[
              tw`text-[12px]`,
              isError ? tw`text-red-400` : tw`text-ink-500`,
            ]}
          >
            {message}
          </CustomText>
        )}
      </View>
    </View>
  );
}
