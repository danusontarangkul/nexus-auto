import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import tw from '@/styles/tw';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-end`}>
        <Pressable style={tw`absolute inset-0 bg-black/70`} onPress={onClose} />

        <View
          style={tw`bg-surface-900 rounded-t-3xl border-t border-surface-border pb-10 max-h-[80%]`}
        >
          <View style={tw`items-center py-3`}>
            <View style={tw`w-12 h-1.5 bg-surface-700 rounded-full`} />
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
}
