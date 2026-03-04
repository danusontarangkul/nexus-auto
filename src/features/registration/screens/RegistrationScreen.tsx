import React from 'react';
import { Screen } from '@/shared/components/Screen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { View } from 'react-native';
import { CustomText } from '@/shared/components/CustomText';

export function RegistrationScreen() {
  return (
    <Screen>
      <View>
        <CustomText>Registration</CustomText>
      </View>
    </Screen>
  );
}
