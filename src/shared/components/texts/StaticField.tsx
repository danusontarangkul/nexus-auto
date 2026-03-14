import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from './CustomText';
import { getDisplayValue } from '@/utils/format';

interface StaticFieldProps {
  label: string;
  value?: string | number | null;
}

export function StaticField({ label, value }: StaticFieldProps) {
  return (
    <View>
      <CustomText variant="label" style={tw`mb-1`}>
        {label}
      </CustomText>
      <View style={tw` `}>
        <CustomText variant="value">{getDisplayValue(value, label)}</CustomText>
      </View>
    </View>
  );
}
