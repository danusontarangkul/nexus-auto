import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { RECORDS, RecordsStackParamList } from '../routes';
import { RecordsScreen } from '@/features/records/screens/RecordsScreen';

const Stack = createNativeStackNavigator<RecordsStackParamList>();

export function RecordsStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={RECORDS.Records}
        component={RecordsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
