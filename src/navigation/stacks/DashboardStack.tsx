import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import { RegistrationScreen } from '@/features/registration/screens/RegistrationScreen';
import { DASHBOARD, DashboardStackParamList } from '../routes';
import { withErrorBoundary } from '@/shared/hocs/withErrorBoundary';
import { InsuranceScreen } from '@/features/insurance/screens/InsuranceScreen';

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
        component={withErrorBoundary(RegistrationScreen, 'Registration Access')}
      />
      <Stack.Screen
        name={DASHBOARD.Insurance}
        component={withErrorBoundary(InsuranceScreen, 'Insurance Access')}
      />
    </Stack.Navigator>
  );
}
