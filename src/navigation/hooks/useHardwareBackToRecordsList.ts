import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { navigateToRecordsListScreen } from '../navigateToRecordsList';

export function useHardwareBackToRecordsList(
  navigation: NavigationProp<Record<string, object | undefined>>,
) {
  useFocusEffect(
    useCallback(() => {
      const onHardwareBack = () => {
        navigateToRecordsListScreen(navigation);
        return true;
      };
      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        onHardwareBack,
      );
      return () => sub.remove();
    }, [navigation]),
  );
}
