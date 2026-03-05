import React from 'react';
import { View } from 'react-native';
import { CustomText } from '../components/CustomText';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';
import { Screen } from '../components/Screen';
import tw from '@/styles/tw';
import { getErrorMessage } from '@/utils/error/errorHelper';
import { navRef } from '@/navigation/NavRef';
import { ROOT } from '@/navigation/routes';

interface Props {
  error: unknown;
  resetErrorBoundary: () => void;
  title?: string;
}

export function ErrorFallback({ error, resetErrorBoundary, title }: Props) {
  const errorMessage = getErrorMessage(error);

  const handleReturnHome = () => {
    resetErrorBoundary();
    if (navRef.isReady()) {
      navRef.reset({
        index: 0,
        routes: [{ name: ROOT.App as any }],
      });
    }
  };

  return (
    <Screen>
      <View style={tw`flex-1 justify-center items-center p-6`}>
        <View style={tw`mb-6 bg-red-500/10 p-4 rounded-full`}>
          {/* Icon would go here */}
        </View>

        <CustomText style={tw`text-2xl font-bold mb-2 text-center text-white`}>
          {title || 'Oops!'}
        </CustomText>

        <CustomText style={tw`text-center text-surface-400 mb-10 leading-6`}>
          {errorMessage}
        </CustomText>

        <View style={tw`w-full gap-3`}>
          <PrimaryButton title="Try Again" onPress={resetErrorBoundary} />
          <OutlineButton
            title="Return to Dashboard"
            onPress={handleReturnHome}
          />
        </View>
      </View>
    </Screen>
  );
}
