import { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActionHeader } from '@/navigation/components/ActionHeader';

export function useEditableHeader(title: string, hasData: boolean) {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <ActionHeader
          title={title}
          isEditing={isEditing}
          hasData={hasData}
          onActionPress={() => setIsEditing((prev) => !prev)}
        />
      ),
    });
  }, [navigation, title, hasData, isEditing]);

  return { isEditing, setIsEditing };
}
