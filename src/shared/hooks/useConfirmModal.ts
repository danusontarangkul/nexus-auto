import { Alert } from 'react-native';

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
}

export const useConfirmModal = () => {
  const showConfirm = ({
    title,
    message,
    onConfirm,
    confirmText = 'Delete',
  }: ConfirmOptions) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: confirmText,
          style: 'destructive',
          onPress: onConfirm,
        },
      ],
      { cancelable: true },
    );
  };

  return { showConfirm };
};
