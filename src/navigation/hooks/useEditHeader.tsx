import { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { EditHeader } from '@/shared/components/headers/EditHeader';

export function useEditHeader(title: string, hasData: boolean) {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <EditHeader
          title={title}
          isEditing={isEditing}
          hasData={hasData}
          onPress={() => setIsEditing(!isEditing)}
        />
      ),
    });
  }, [navigation, title, hasData, isEditing]);

  return { isEditing, setIsEditing };
}
