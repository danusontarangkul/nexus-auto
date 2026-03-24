import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { WARRANTIES, WarrantiesStackParamList } from '../routes';
import { WarrantiesScreen } from '@/features/warranties/screens/WarrantiesScreen';
import { AddWarrantyScreen } from '@/features/warranties/screens/AddWarranty';
import { BackHeader } from '../components/BackHeader';
import { WarrantiesDetailsScreen } from '@/features/warranties/screens/WarrantiesDetails';

const Stack = createNativeStackNavigator<WarrantiesStackParamList>();

export function WarrantiesStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={WARRANTIES.WarrantiesList}
        component={WarrantiesScreen}
      />

      <Stack.Screen
        name={WARRANTIES.AddWarranty}
        component={AddWarrantyScreen}
        options={{ header: () => <BackHeader title="Add Warranty" /> }}
      />
      <Stack.Screen
        name={WARRANTIES.WarrantyDetails}
        component={WarrantiesDetailsScreen}
        options={({ navigation }) => ({
          header: () => (
            <BackHeader
              title="Warranty Details"
              onBackPress={() => navigation.navigate(WARRANTIES.WarrantiesList)}
              skipTopInset
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
