// src/navigation/stacks/OnboardingStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ONBOARD, OnboardingStackParamList } from '../routes';
import { stackDark } from '../options';
import { BackHeader } from '../components/BackHeader';
import { AddCarStartScreen } from '../../features/cars/screens/AddCarStartScreen';
import { EnterVinScreen } from '../../features/cars/screens/EnterVinScreen';
import { EnterManualScreen } from '../../features/cars/screens/EnterManualScreen';
import { UploadVinPhotoScreen } from '../../features/cars/screens/UploadVinPhotoScreen';
import { ConfirmCarScreen } from '../../features/cars/screens/ConfirmCarScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();
export function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={ONBOARD.AddCarStart}
        component={AddCarStartScreen}
        options={{ header: () => <BackHeader title="New Car" hideBack /> }}
      />
      <Stack.Screen
        name={ONBOARD.EnterVIN}
        component={EnterVinScreen}
        options={{ header: () => <BackHeader title="Enter VIN" /> }}
      />
      <Stack.Screen
        name={ONBOARD.EnterManual}
        component={EnterManualScreen}
        options={{
          header: () => <BackHeader title="Enter Details Manually" />,
        }}
      />
      <Stack.Screen
        name={ONBOARD.UploadVINPhoto}
        component={UploadVinPhotoScreen}
        options={{ header: () => <BackHeader title="Scan VIN Barcode" /> }}
      />
      <Stack.Screen
        name={ONBOARD.ConfirmCar}
        component={ConfirmCarScreen}
        options={{ header: () => <BackHeader title="Confirm Vehicle" /> }}
      />
    </Stack.Navigator>
  );
}
