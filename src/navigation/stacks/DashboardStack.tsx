import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import { RegistrationScreen } from '@/features/registration/screens/RegistrationScreen';
import { DASHBOARD, DashboardStackParamList } from '../routes';
import { withErrorBoundary } from '@/shared/hocs/withErrorBoundary';
import { InsuranceScreen } from '@/features/insurance/screens/InsuranceScreen';
import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { BackHeader } from '../components/BackHeader';
import { RecordsDetailsScreen } from '@/features/records/screens/RecordsDetails';
import { navigateToRecordsListScreen } from '../navigateToRecordsList';

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
      <Stack.Screen
        name={DASHBOARD.Account}
        component={withErrorBoundary(AccountScreen, 'Account Access')}
        options={{ header: () => <BackHeader title="Account" /> }}
      />
      <Stack.Screen
        name={DASHBOARD.ServiceRecordDetails}
        component={RecordsDetailsScreen}
        options={({ navigation }) => ({
          header: () => (
            <BackHeader
              title="Service Record Details"
              onBackPress={() => navigateToRecordsListScreen(navigation)}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
