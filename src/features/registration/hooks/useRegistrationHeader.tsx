import React, { useLayoutEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '@/navigation/components/BackHeader';
import tw from '@/styles/tw';

export function useRegistrationHeader(hasData: boolean) {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          title="Registration"
          skipTopInset
          rightElement={
            <TouchableOpacity onPress={() => setIsEditing((prev) => !prev)}>
              <Ionicons
                name={
                  isEditing
                    ? 'close-outline'
                    : hasData
                      ? 'create-outline'
                      : 'add-outline'
                }
                size={24}
                color={tw.color('ink-900') as string}
              />
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation, hasData, isEditing]);

  return { isEditing, setIsEditing };
}
