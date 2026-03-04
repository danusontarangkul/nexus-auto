import React from 'react';
import { Screen } from '@/shared/components/Screen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { View } from 'react-native';
import { CustomText } from '@/shared/components/CustomText';
import { RouteProp, useRoute } from '@react-navigation/native';
import { DashboardStackParamList, DASHBOARD } from '@/navigation/routes';
import { useRegistration } from '@/domain/registrations';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';

export function RegistrationScreen() {
  const route =
    useRoute<
      RouteProp<DashboardStackParamList, typeof DASHBOARD.Registration>
    >();
  const { vehicleId } = route.params;

  const registration = useRegistration(vehicleId);

  if (!registration) {
    return <FullScreenLoading />;
  }
  console.log(registration);

  return (
    <Screen>
      <View>
        <CustomText>Registration</CustomText>
      </View>
    </Screen>
  );
}
