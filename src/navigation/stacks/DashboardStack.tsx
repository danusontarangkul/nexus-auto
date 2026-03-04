import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { BackHeader } from '../components/BackHeader';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import { RegistrationScreen } from '@/features/registration/screens/RegistrationScreen';
import { DASHBOARD, DashboardStackParamList } from '../routes';

const Stack = createNativeStackNavigator<DashboardStackParamList>();
export function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={DASHBOARD.DashboardMain}
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={DASHBOARD.Registration}
        component={RegistrationScreen}
        options={{
          header: () => <BackHeader title="Registration" skipTopInset />,
        }}
      />
    </Stack.Navigator>
  );
}
