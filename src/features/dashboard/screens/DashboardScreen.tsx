import { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Screen } from '@/shared/components/screens/Screen';
import { CarSwitcher } from '@/features/dashboard/components/CarSwitcher';
import { useDashboardContext } from '@/providers/DashboardProvider';
import tw from '@/styles/tw';
import { ActivitySummary } from '../components/ActivitySummary';
import { DocumentSummary } from '../components/DocumentSummary';
import { MaintenanceList } from '../components/MaintenanceList';
import { Id } from '@convex/_generated/dataModel';
import { useUpdateLastSelectedVehicle } from '@/domain/users';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import {
  DASHBOARD,
  ROOT,
  TABS,
  RECORDS,
  DashboardStackParamList,
  RootStackParamList,
  AppTabsParamList,
} from '@/navigation/routes';
import { Avatar } from '@/shared/components/avatar/Avatar';

type DashboardNav = CompositeNavigationProp<
  NativeStackNavigationProp<DashboardStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function DashboardScreen() {
  const nav = useNavigation<DashboardNav>();
  const { dashboard } = useDashboardContext();
  const { updateLastSelectedVehicle, isLoading } =
    useUpdateLastSelectedVehicle();

  useEffect(() => {
    if (!dashboard || !dashboard.active) {
      nav.navigate(ROOT.Onboarding);
    }
  }, [dashboard, nav]);

  if (!dashboard || !dashboard.active) {
    return <Screen />;
  }

  const { vehicle, registration, insurance, maintenanceItems } =
    dashboard.active;

  const handleSelect = async (id: Id<'vehicles'>) => {
    await updateLastSelectedVehicle(id);
  };

  const handleAddCar = () => {
    nav.navigate(ROOT.Onboarding);
  };
  const handleNavRegistration = () => {
    nav.navigate(DASHBOARD.Registration, {
      vehicleId: vehicle._id,
    });
  };
  const handleNavInsurance = () => {
    nav.navigate(DASHBOARD.Insurance, {
      vehicleId: vehicle._id,
    });
  };

  const handleProfilePress = () => {
    nav.navigate(DASHBOARD.Account);
  };

  const handleMaintenanceItemPress = (
    item: (typeof maintenanceItems)[number],
  ) => {
    const parentNavigator =
      nav.getParent<BottomTabNavigationProp<AppTabsParamList>>();
    if (!parentNavigator) {
      return;
    }
    if (item.lastDoneRecordId) {
      parentNavigator.navigate(TABS.Records, {
        screen: RECORDS.RecordDetails,
        params: { recordId: item.lastDoneRecordId },
      });
      return;
    }
    parentNavigator.navigate(TABS.Records, {
      screen: RECORDS.AddRecord,
      params: { initialMaintenanceItemId: item._id },
    });
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        <View style={tw`flex-row items-center justify-between  mt-4 `}>
          <View style={tw`flex-1 mr-3`}>
            <CarSwitcher
              cars={dashboard.vehicles}
              selectedId={vehicle._id}
              onSelect={handleSelect}
              onAddCar={handleAddCar}
              isLoading={isLoading}
            />
          </View>

          <Avatar
            image={dashboard.user.image}
            name={dashboard.user.name}
            onPress={handleProfilePress}
            size={36}
          />
        </View>

        <SectionHeader title="Dashboard" variant="titleLg" />
        <ActivitySummary />
        <SectionHeader title="Recommended Services" />
        <MaintenanceList
          items={maintenanceItems}
          onItemPress={handleMaintenanceItemPress}
        />
        <SectionHeader title="Vehicle Documents" />
        <DocumentSummary
          registration={registration}
          insurance={insurance}
          onPressRegistration={handleNavRegistration}
          onPressInsurance={handleNavInsurance}
        />
      </ScrollView>
    </Screen>
  );
}
