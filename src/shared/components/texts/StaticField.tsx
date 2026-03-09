import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from './CustomText';

interface StaticFieldProps {
  label: string;
  value?: string | number | null;
}

export function StaticField({ label, value }: StaticFieldProps) {
  return (
    <View style={tw`mb-4`}>
      <CustomText variant="label" style={tw`text-ink-700 mb-1`}>
        {label}
      </CustomText>
      <View style={tw` `}>
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
