import { RouteProp, useRoute } from '@react-navigation/native';
import { RecordsStackParamList, RECORDS } from '@/navigation/routes';

export const useRecordsRouteParams = () => {
  const route =
    useRoute<RouteProp<RecordsStackParamList, typeof RECORDS.RecordDetails>>();
  return route.params;
};
