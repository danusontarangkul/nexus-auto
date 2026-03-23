import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { BackHeader } from '../components/BackHeader';
import { AddCarStartScreen } from '../../features/carOnboarding/screens/AddCarStartScreen';
import { EnterVinScreen } from '../../features/carOnboarding/screens/EnterVinScreen';
import { EnterManualScreen } from '../../features/carOnboarding/screens/EnterManualScreen';
import { UploadVinPhotoScreen } from '../../features/carOnboarding/screens/UploadVinPhotoScreen';
import { ConfirmCarScreen } from '../../features/carOnboarding/screens/ConfirmCarScreen';
import VinScanScreen from '../../features/carOnboarding/screens/VinScanScreen';
import { OnboardingStackParamList, ONBOARD } from '../routes';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={ONBOARD.AddCarStart}
        component={AddCarStartScreen}
        options={
          __DEV__
            ? { header: () => <BackHeader title="New Car" hideBack /> }
            : { headerShown: false }
        }
      />
      <Stack.Screen
        name={ONBOARD.EnterVin}
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
        options={{ header: () => <BackHeader title="Upload VIN Photo" /> }}
      />
      <Stack.Screen
        name={ONBOARD.VinScan}
        component={VinScanScreen}
        options={{ header: () => <BackHeader title="Scan VIN" /> }}
      />
      <Stack.Screen
        name={ONBOARD.ConfirmCar}
        component={ConfirmCarScreen}
        options={
          __DEV__
            ? { header: () => <BackHeader title="Confirm Vehicle" /> }
            : { headerShown: false }
        }
      />
    </Stack.Navigator>
  );
}
