import { Modal, View, Pressable } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { OutlineButton } from '@/shared/components/buttons/OutlineButton';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Delete anyway',
  cancelText = 'Keep my account',
  loading,
  error,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={tw`flex-1 items-center justify-center bg-black/60 px-6`}>
        <Pressable
          style={tw`absolute inset-0`}
          onPress={loading ? undefined : onCancel}
        />

        <View
          style={tw`w-full rounded-3xl bg-surface-900 border border-surface-border px-5 py-6`}
        >
          <View style={tw`flex-row justify-between items-start mb-3`}>
            <CustomText variant="titleLg" style={tw`text-ink-50 flex-1 mr-4`}>
              {title}
            </CustomText>
          </View>

          <CustomText variant="body" style={tw`text-ink-300 `}>
            {message}
          </CustomText>

          <ButtonContainer style={tw`mt-0`}>
            <ActionGroup error={error}>
              <OutlineButton
                title={cancelText}
                onPress={onCancel}
                disabled={loading}
              />
              <PrimaryButton
                title={confirmText}
                onPress={onConfirm}
                isLoading={loading}
                variant="danger"
              />
            </ActionGroup>
          </ButtonContainer>
        </View>
      </View>
    </Modal>
  );
}
