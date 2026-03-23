import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  showCameraPermissionNeededAlert,
  showPhotoLibraryPermissionNeededAlert,
} from '../components/alerts/permissionAccessAlerts';
import { ImagePickSource, UsePhotoAttachmentOptions } from '@convex/types';
import { PICKER_AFTER_MODAL_MS } from '@/utils/const';

export function usePhotoAttachment(options?: UsePhotoAttachmentOptions) {
  const useScannerCamera = options?.useScannerCamera ?? false;
  const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isImageSourceSheetOpen, setIsImageSourceSheetOpen] =
    useState<boolean>(false);

  const openSystemCamera = async () => {
    const { granted, canAskAgain } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      showCameraPermissionNeededAlert(canAskAgain);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImageUris((prev) => [...prev, ...newUris]);
    }
  };

  const openImageLibrary = async () => {
    const { granted, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      showPhotoLibraryPermissionNeededAlert(canAskAgain);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImageUris((prev) => [...prev, ...newUris]);
    }
  };

  const handleImagePick = async (source: ImagePickSource) => {
    if (source === 'camera') {
      if (useScannerCamera) {
        setIsTakingPhoto(true);
        return;
      }
      await openSystemCamera();
      return;
    }

    await openImageLibrary();
  };

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const addCapturedPhoto = (uri: string) => {
    setImageUris((prev) => [...prev, uri]);
    setIsTakingPhoto(false);
  };

  const openImagePicker = () => setIsImageSourceSheetOpen(true);

  const closeImageSourceSheet = () => setIsImageSourceSheetOpen(false);

  const selectImageSource = (source: ImagePickSource) => {
    setIsImageSourceSheetOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          void handleImagePick(source);
        }, PICKER_AFTER_MODAL_MS);
      });
    });
  };

  return {
    isTakingPhoto,
    setIsTakingPhoto,
    imageUris,
    setImageUris,
    removeImage,
    addCapturedPhoto,
    openImagePicker,
    isImageSourceSheetOpen,
    closeImageSourceSheet,
    selectImageSource,
  };
}
