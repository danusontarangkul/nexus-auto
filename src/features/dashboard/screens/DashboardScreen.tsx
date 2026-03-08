import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/shared/components/Screen';
import { CarSwitcher } from '@/features/dashboard/components/CarSwitcher';
import { useDashboardContext } from '@/providers/DashboardProvider';
import tw from '@/styles/tw';
import { ActivitySummary } from '../components/ActivitySummary';
import { DocumentSummary } from '../components/DocumentSummary';
import { MaintenanceList } from '../components/MaintenanceList';
import { Id } from '@convex/_generated/dataModel';
import { useUpdateLastSelectedVehicle } from '@/domain/users';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DASHBOARD, DashboardStackParamList } from '@/navigation/routes';
import { Avatar } from '@/shared/components/Avatar';

export default function DashboardScreen() {
  const nav =
    useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();
  const { dashboard } = useDashboardContext();
  const { updateLastSelectedVehicle, isLoading } =
    useUpdateLastSelectedVehicle();

  if (!dashboard || !dashboard.active) {
    return <Screen></Screen>;
  }

  const { vehicle, registration, insurance, maintenanceItems } =
    dashboard.active;

  const handleSelect = async (id: Id<'vehicles'>) => {
    await updateLastSelectedVehicle(id);
  };

  const handleAddCar = () => {
    nav.navigate('Onboarding' as never);
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

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        <View style={tw`flex-row items-center justify-between mb-4 mt-4 px-4`}>
          <CarSwitcher
            cars={dashboard.vehicles}
            selectedId={vehicle._id}
            onSelect={handleSelect}
            onAddCar={handleAddCar}
            isLoading={isLoading}
          />

          <Avatar
            name={dashboard.user.name}
            onPress={handleProfilePress}
            size={40}
          />
        </View>

        <SectionHeader title="Dashboard" variant="titleLg" />
        <ActivitySummary />
        <SectionHeader title="Recommended Services" />
        <MaintenanceList items={maintenanceItems} />
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
