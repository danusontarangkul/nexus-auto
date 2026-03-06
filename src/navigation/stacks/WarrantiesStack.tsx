import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { WARRANTIES, WarrantiesStackParamList } from '../routes';
import { WarrantiesScreen } from '@/features/warranties/screens/WarrantiesScreen';

const Stack = createNativeStackNavigator<WarrantiesStackParamList>();

export function WarrantiesStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={WARRANTIES.Warranties}
        component={WarrantiesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
