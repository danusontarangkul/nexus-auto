import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator'; // Ensure this is @expo/image-manipulator in newer versions
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '../CustomText';
import tw from '@/styles/tw';

type Props = {
  onCapture: (uri: string) => Promise<void>;
  isLoading?: boolean;
  instructionText?: string;
};

export function ScannerCamera({
  onCapture,
  isLoading,
  instructionText,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleTakePhoto = async () => {
    if (isLoading || !cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: Platform.OS === 'android',
      });

      if (photo?.uri) {
        // If the object-style failed, go back to the 3-argument style
        // but ensure types are explicitly handled.
        const manip = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 2000 } }], // Argument 2: Actions array
          {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
          }, // Argument 3: SaveOptions
        );

        await onCapture(manip.uri);
      }
    } catch (e) {
      console.error('Capture Error:', e);
    }
  };

  if (!permission?.granted) return null;

  return (
    <View style={tw`flex-1 bg-black`}>
      <CameraView ref={cameraRef} style={tw`flex-1`} enableTorch={torchOn} />

      {/* Visual Guide Overlay */}
      <View
        pointerEvents="none"
        style={tw`absolute inset-0 items-center justify-center`}
      >
        <View
          style={tw`w-5/6 h-60 rounded-3xl border-2 border-white/50 bg-black/10`}
        />
        <CustomText
          style={tw`text-white mt-6 bg-black/60 px-6 py-2 rounded-full overflow-hidden`}
        >
          {instructionText || 'Position document in the frame'}
        </CustomText>
      </View>

      <TouchableOpacity
        onPress={() => setTorchOn(!torchOn)}
        style={tw`absolute top-14 right-6 p-4 bg-black/40 rounded-full`}
      >
        <Ionicons
          name={torchOn ? 'flash' : 'flash-off'}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <View style={tw`absolute bottom-16 w-full items-center`}>
        <TouchableOpacity
          onPress={handleTakePhoto}
          disabled={isLoading}
          style={tw`h-20 w-20 rounded-full border-4 border-white items-center justify-center`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="large" />
          ) : (
            <View style={tw`h-15 w-15 rounded-full bg-white`} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
