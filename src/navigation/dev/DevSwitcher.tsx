import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/shared/components/screens/Screen';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import tw from '@/styles/tw';
import { DASHBOARD, ONBOARD, ROOT, RootStackParamList, TABS } from '../routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function DevSwitcher() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen>
      <ScrollView contentContainerStyle={tw`gap-3 mt-40`}>
        <PrimaryButton
          title="Auth → Login"
          onPress={() => nav.reset({ index: 0, routes: [{ name: 'Auth' }] })}
        />
        <PrimaryButton
          title="Onboarding → AddCarStart"
          onPress={() =>
            nav.reset({ index: 0, routes: [{ name: 'Onboarding' }] })
          }
        />
        <PrimaryButton
          title="Scan Vin Screen"
          onPress={() =>
            nav.reset({
              index: 0,
              routes: [
                { name: 'Onboarding', params: { screen: ONBOARD.VinScan } },
              ],
            })
          }
        />
        <PrimaryButton
          title="Onboarding → ConfirmCar"
          onPress={() =>
            nav.reset({
              index: 0,
              routes: [
                { name: 'Onboarding', params: { screen: 'ConfirmCar' } },
              ],
            })
          }
        />

        <PrimaryButton
          title="App → Dashboard"
          onPress={() => nav.reset({ index: 0, routes: [{ name: 'App' }] })}
        />
        <PrimaryButton
          title="Registration"
          onPress={() =>
            nav.reset({
              index: 0,
              routes: [
                {
                  name: ROOT.App,
                  params: {
                    screen: TABS.Dashboard,
                    params: {
                      screen: DASHBOARD.Registration,
                    },
                  },
                },
              ],
            })
          }
        />
      </ScrollView>
    </Screen>
  );
}
