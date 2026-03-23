import { Alert } from 'react-native';

export function showCameraPermissionNeededAlert(canAskAgain: boolean) {
  Alert.alert(
    'Camera access needed',
    canAskAgain
      ? 'Allow camera access to take a photo of your document.'
      : 'Enable camera access for this app in Settings to take a photo.',
  );
}

export function showPhotoLibraryPermissionNeededAlert(canAskAgain: boolean) {
  Alert.alert(
    'Photo library access needed',
    canAskAgain
      ? 'Allow photo library access to choose images from your gallery.'
      : 'Enable photo library access for this app in Settings to choose images.',
  );
}
