import * as AppleAuthentication from 'expo-apple-authentication';
import tw from '@/styles/tw';
import { View } from 'react-native';

interface Props {
  onPress: () => void;
  isLoading?: boolean;
}

export function AppleButton({ onPress, isLoading }: Props) {
  return (
    <View style={tw`w-full h-13 ${isLoading ? 'opacity-50' : ''}`}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={tw`w-full h-full`}
        onPress={onPress}
      />
    </View>
  );
}
