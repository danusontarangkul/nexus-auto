import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { StackActions } from '@react-navigation/native';
import { AppTabsParamList, TABS } from '../routes';
import { getTabBarIcon, tabDark } from '../options';
import { DashboardStack } from '../stacks/DashboardStack';
import { RecordsStack } from '../stacks/RecordsStack';
import { WarrantiesStack } from '../stacks/WarrantiesStack';
import { AboutScreen } from '@/features/about/screens/AboutScreen';

const Tab = createBottomTabNavigator<AppTabsParamList>();

function clearCurrentTabStackIfNeeded(
  navigation: BottomTabNavigationProp<AppTabsParamList>,
) {
  const state = navigation.getState();
  const currentTab = state.routes[state.index];
  const currentTabState = currentTab.state;

  if (
    currentTabState &&
    currentTabState.type === 'stack' &&
    typeof currentTabState.index === 'number' &&
    currentTabState.index > 0
  ) {
    navigation.dispatch({
      ...StackActions.popToTop(),
      target: currentTabState.key,
    });
  }
}

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabDark,
        tabBarIcon: (props) =>
          getTabBarIcon(route, props.focused, props.color, props.size),
      })}
      screenListeners={({ navigation }) => ({
        tabPress: () => {
          clearCurrentTabStackIfNeeded(navigation);
        },
      })}
    >
      <Tab.Screen name={TABS.Dashboard} component={DashboardStack} />
      <Tab.Screen name={TABS.Records} component={RecordsStack} />
      <Tab.Screen name={TABS.Warranties} component={WarrantiesStack} />
      <Tab.Screen name={TABS.About} component={AboutScreen} />
    </Tab.Navigator>
  );
}
