import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabsParamList, TABS } from '../routes';
import { tabDark } from '../options';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';

const Tab = createBottomTabNavigator<AppTabsParamList>();
export function AppTabs() {
  return (
    <Tab.Navigator screenOptions={tabDark}>
      <Tab.Screen name={TABS.Dashboard} component={DashboardScreen} />
    </Tab.Navigator>
  );
}
