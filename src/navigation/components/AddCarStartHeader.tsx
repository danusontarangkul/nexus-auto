import { useNavigation } from '@react-navigation/native';
import { BackHeader } from './BackHeader';

export function AddCarStartHeader() {
  const nav = useNavigation();
  const parent = nav.getParent();
  const canReturnToApp = parent?.canGoBack() ?? false;

  return (
    <BackHeader
      title="New Car"
      hideBack={!canReturnToApp}
      onBackPress={canReturnToApp ? () => parent?.goBack() : undefined}
    />
  );
}
