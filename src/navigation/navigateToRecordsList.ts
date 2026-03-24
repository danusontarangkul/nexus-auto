import { NavigationProp, StackActions } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabsParamList, DASHBOARD, RECORDS, TABS } from './routes';

export function navigateToRecordsListScreen(
  navigation: NavigationProp<Record<string, object | undefined>>,
) {
  const tabNav =
    navigation.getParent<BottomTabNavigationProp<AppTabsParamList>>();
  if (tabNav) {
    tabNav.navigate(TABS.Records, {
      screen: RECORDS.RecordsList,
    });
  } else {
    navigation.navigate(RECORDS.RecordsList);
  }

  const state = navigation.getState();
  const currentRoute = state.routes[state.index];
  if (currentRoute.name === DASHBOARD.ServiceRecordDetails) {
    navigation.dispatch(StackActions.pop());
  }
}
