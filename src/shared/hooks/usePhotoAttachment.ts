import { useState } from 'react';
import { ActionSheetIOS, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export function usePhotoAttachment() {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [imageUris, setImageUris] = useState<string[]>([]);

  const handleImagePick = async (source: 'camera' | 'library') => {
    if (source === 'camera') {
      setIsTakingPhoto(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      // Fixed: Disabled allowsEditing because allowsMultipleSelection is enabled
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImageUris((prev) => [...prev, ...newUris]);
    }
  };

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const addCapturedPhoto = (uri: string) => {
    setImageUris((prev) => [...prev, uri]);
    setIsTakingPhoto(false);
  };

  const openImagePicker = () => {
    const options = ['Cancel', 'Take Photo', 'Choose from Library'];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (index) => {
          if (index === 1) handleImagePick('camera');
          if (index === 2) handleImagePick('library');
        },
      );
    } else {
      Alert.alert('Upload Document', 'Select a source', [
        { text: 'Take Photo', onPress: () => handleImagePick('camera') },
        {
          text: 'Choose from Library',
          onPress: () => handleImagePick('library'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  return {
    isTakingPhoto,
    setIsTakingPhoto,
    imageUris,
    setImageUris,
    removeImage,
    addCapturedPhoto,
    openImagePicker,
  };
}
