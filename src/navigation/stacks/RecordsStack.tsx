import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { RECORDS, RecordsStackParamList } from '../routes';
import { RecordsScreen } from '@/features/records/screens/RecordsScreen';
import { AddRecordScreen } from '@/features/records/screens/AddRecord';
import { BackHeader } from '../components/BackHeader';
import { RecordsDetailsScreen } from '@/features/records/screens/RecordsDetails';

const Stack = createNativeStackNavigator<RecordsStackParamList>();

export function RecordsStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen name={RECORDS.RecordsList} component={RecordsScreen} />
      <Stack.Screen
        name={RECORDS.AddRecord}
        component={AddRecordScreen}
        options={{
          header: () => <BackHeader title="Add Record" skipTopInset={true} />,
        }}
      />
      <Stack.Screen
        name={RECORDS.RecordDetails}
        component={RecordsDetailsScreen}
        options={({ navigation }) => ({
          header: () => (
            <BackHeader
              title="Record Details"
              skipTopInset={true}
              onBackPress={() => navigation.navigate(RECORDS.RecordsList)}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
