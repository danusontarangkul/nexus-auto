import { View } from 'react-native';
import { CustomText } from '../texts/CustomText';
import tw from '@/styles/tw';

export function FormError({ message }: { message?: string | null }) {
  return (
    <View style={tw`h-6 justify-center`}>
      {message ? (
        <CustomText style={tw`text-red-500 text-sm text-center`}>
          {message}
        </CustomText>
      ) : null}
    </View>
  );
}
