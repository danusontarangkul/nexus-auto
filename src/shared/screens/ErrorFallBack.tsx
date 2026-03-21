import { View, Pressable, Text } from 'react-native';
import { CustomText } from '@/shared/components/texts/CustomText';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { OutlineButton } from '@/shared/components/buttons/OutlineButton';
import { Screen } from '@/shared/components/screens/Screen';
import tw from '@/styles/tw';
import {
  getErrorMessage,
  getErrorFallbackHeadline,
  getErrorFallbackHomeButtonTitle,
  isAuthRequiredError,
} from '@/utils/error/errorHelper';
import { navRef } from '@/navigation/NavRef';
import { ROOT } from '@/navigation/routes';

interface Props {
  error: unknown;
  resetErrorBoundary: () => void;
  title?: string;
}

export function ErrorFallback({ error, resetErrorBoundary, title }: Props) {
  const errorMessage = getErrorMessage(error);
  const authRequired = isAuthRequiredError(error);

  const handleReturnHome = () => {
    resetErrorBoundary();
    if (!navRef.isReady()) {
      return;
    }
    navRef.reset({
      index: 0,
      routes: [{ name: authRequired ? ROOT.Auth : ROOT.App }],
    });
  };

  const handleDevPress = () => {
    resetErrorBoundary();
    setTimeout(() => {
      if (navRef.isReady()) {
        navRef.navigate(ROOT.Dev);
      }
    }, 50);
  };

  return (
    <Screen>
      {__DEV__ && (
        <Pressable
          onPress={handleDevPress}
          style={[
            tw`absolute rounded-lg px-2.5 py-1.5`,
            {
              top: 60,
              right: 10,
              backgroundColor: 'rgba(60,60,60,0.7)',
              zIndex: 10,
            },
          ]}
        >
          <Text style={tw`text-white font-semibold`}>DEV</Text>
        </Pressable>
      )}
      <View style={tw`flex-1 justify-center items-center p-6`}>
        <CustomText style={tw`text-2xl font-bold mb-2 text-center text-white`}>
          {getErrorFallbackHeadline(title)}
        </CustomText>

        <CustomText style={tw`text-center text-surface-400 mb-10 leading-6`}>
          {errorMessage}
        </CustomText>

        <View style={tw`w-full gap-3`}>
          <PrimaryButton title="Try Again" onPress={resetErrorBoundary} />
          <OutlineButton
            title={getErrorFallbackHomeButtonTitle(error)}
            onPress={handleReturnHome}
          />
        </View>
      </View>
    </Screen>
  );
}
