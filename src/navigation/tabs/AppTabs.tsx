import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabsParamList, TABS } from '../routes';
import { getTabBarIcon, tabDark } from '../options';
import { DashboardStack } from '../stacks/DashboardStack';
import { RecordsStack } from '../stacks/RecordsStack';
import { WarrantiesStack } from '../stacks/WarrantiesStack';
import { AboutStack } from '../stacks/AboutStack';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabDark,
        tabBarIcon: (props) =>
          getTabBarIcon(route, props.focused, props.color, props.size),
      })}
    >
      <Tab.Screen name={TABS.Dashboard} component={DashboardStack} />
      <Tab.Screen name={TABS.Records} component={RecordsStack} />
      <Tab.Screen name={TABS.Warranties} component={WarrantiesStack} />
      <Tab.Screen name={TABS.About} component={AboutStack} />
    </Tab.Navigator>
  );
}
