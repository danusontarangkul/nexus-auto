import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { BottomSheet } from './BottomSheet';

type ActionMenuProps = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  label: string;
};

export function ActionMenu({
  visible,
  onClose,
  onEdit,
  onDelete,
  label,
}: ActionMenuProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={tw`px-4 pt-2 pb-6`}>
        <Pressable
          onPress={() => {
            onEdit();
            onClose();
          }}
          style={tw`flex-row items-center p-4 rounded-2xl bg-surface-800 mb-3`}
        >
          <Ionicons
            name="create-outline"
            size={22}
            color={tw.color('ink-300')}
          />
          <CustomText
            variant="body"
            style={tw`ml-3 text-ink-100 font-semibold`}
          >
            Edit {label}
          </CustomText>
        </Pressable>

        <Pressable
          onPress={() => {
            onDelete();
            onClose();
          }}
          style={tw`flex-row items-center p-4 rounded-2xl bg-red-500/10`}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={tw.color('red-400')}
          />
          <CustomText
            variant="body"
            style={tw`ml-3 text-red-400 font-semibold`}
          >
            Delete {label}
          </CustomText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
