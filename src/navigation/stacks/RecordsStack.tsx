import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { RECORDS, RecordsStackParamList } from '../routes';
import { RecordsScreen } from '@/features/records/screens/RecordsScreen';
import { AddRecordScreen } from '@/features/records/screens/AddRecord';
import tw from '@/styles/tw';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { BackHeader } from '../components/BackHeader';
import { RecordsDetailsScreen } from '@/features/records/screens/RecordsDetails';

const Stack = createNativeStackNavigator<RecordsStackParamList>();

export function RecordsStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={RECORDS.RecordsList}
        component={RecordsScreen}
        options={({ navigation }) => ({
          header: () => (
            <BackHeader
              title="Service Records"
              hideBack
              skipTopInset={true}
              leftElement={
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(RECORDS.AddRecord);
                  }}
                >
                  <Ionicons name="add" size={28} color={tw.color('ink-900')} />
                </TouchableOpacity>
              }
              rightElement={
                <TouchableOpacity onPress={() => console.log('Search')}>
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={tw.color('ink-900')}
                  />
                </TouchableOpacity>
              }
            />
          ),
        })}
      />
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
        options={{
          header: () => (
            <BackHeader title="Record Details" skipTopInset={true} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
