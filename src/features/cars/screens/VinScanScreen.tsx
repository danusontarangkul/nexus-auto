// src/features/cars/screens/VinScanScreen.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Alert,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { CustomText } from '../../../shared/components/CustomText';
import tw from '../../../styles/tw';

import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';
import type { BarcodeType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

import { isValidVIN, extractVINFromText, decodeVIN } from '../../../lib';
import { recognizeTextFromImage } from '../../../lib'; // from src/lib/ocr.ts

// Optional: If you use a custom overlay component, you can remove this inline frame.
export default function VinScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [mode, setMode] = useState<'barcode' | 'ocr' | null>('barcode');
  const [busy, setBusy] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [vin, setVin] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<any | null>(null);
  const [torchOn, setTorchOn] = useState(false);

  // VIN quick filter (format-level check)
  const VIN_REGEX = /^(?!.*[IOQ])[A-HJ-NPR-Z0-9]{17}$/;
  const looksLikeVIN = (s: string) =>
    VIN_REGEX.test((s || '').trim().toUpperCase());

  // 1D formats commonly used for VIN labels
  const barcodeTypes = useMemo<BarcodeType[]>(
    () => ['code39', 'code128', 'pdf417'],
    [],
  );

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission, requestPermission]);

  // BARCODE HANDLER
  const onBarcodeScanned = useCallback(
    async (result: BarcodeScanningResult) => {
      // Dev visibility:
      console.log('SCAN:', result?.type, result?.data);

      if (mode !== 'barcode' || busy) return;

      const candidate = (result?.data ?? '').trim().toUpperCase();
      if (!looksLikeVIN(candidate)) return;

      setBusy(true);
      try {
        if (!isValidVIN(candidate)) {
          console.log('❌ VIN failed check digit:', candidate);
          return;
        }

        console.log('✅ VIN (barcode):', candidate);
        setVin(candidate);
        setMode(null);

        const d = await decodeVIN(candidate);
        setDecoded(d);
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setBusy(false), 600);
      }
    },
    [busy, mode],
  );

  // PHOTO OCR FLOW
  const takePhotoAndOCR = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setMode('ocr');

    try {
      // @ts-ignore CameraView ref typing difference across platforms
      const photo = await cameraRef.current?.takePictureAsync?.({
        quality: 0.85,
        skipProcessing: Platform.OS === 'android',
      });
      if (!photo?.uri) throw new Error('Failed to capture photo');

      // Normalize for OCR (larger width helps)
      const manip = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 2000 } }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG },
      );
      setPhotoUri(manip.uri);

      const text = await recognizeTextFromImage(manip.uri); // returns a single uppercased string
      const found = extractVINFromText(text || '');
      if (found && isValidVIN(found)) {
        console.log('✅ VIN (OCR):', found);
        setVin(found);
        setMode(null);
        const d = await decodeVIN(found);
        setDecoded(d);
      } else {
        console.log(
          'No VIN in OCR text (first 120):',
          (text || '').slice(0, 120),
        );
        Alert.alert(
          'VIN not found',
          'Try closer framing, better lighting, and make the VIN fill most of the box.',
        );
        setMode('barcode');
      }
    } catch (e) {
      console.error('OCR error', e);
      Alert.alert(
        'OCR failed',
        'Please try again with better lighting and alignment.',
      );
      setMode('barcode');
    } finally {
      setBusy(false);
    }
  }, [busy]);

  if (!permission?.granted) {
    return (
      <Screen>
        <View style={tw`flex-1 items-center justify-center p-6`}>
          <CustomText
            variant="title"
            color={tw.color('ink-50') as string}
            style={tw`mb-3`}
          >
            Camera permission required
          </CustomText>
          <TouchableOpacity
            onPress={() => requestPermission()}
            style={tw`bg-blue-600 px-4 py-3 rounded-xl`}
          >
            <CustomText color="#fff" style={tw`font-semibold`}>
              Enable Camera
            </CustomText>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={tw`flex-1 bg-black relative`}>
        {/* CAMERA (no children) */}
        <CameraView
          ref={cameraRef}
          style={tw`flex-1`}
          facing="back"
          enableTorch={torchOn}
          barcodeScannerSettings={{ barcodeTypes }}
          onBarcodeScanned={mode === 'barcode' ? onBarcodeScanned : undefined}
        />

        {/* CENTER OVERLAY FRAME */}
        <View
          pointerEvents="none"
          style={tw`absolute inset-0 items-center justify-center`}
        >
          <View
            style={tw`w-4/5 h-1/5 rounded-2xl border-2 border-cyan-400 bg-black/10`}
          />
          <CustomText
            color={tw.color('ink-50') as string}
            style={tw`absolute bottom-28 font-semibold`}
          >
            {busy ? 'Processing…' : mode === 'ocr' ? 'Photo OCR' : 'Aim at VIN'}
          </CustomText>
        </View>

        {/* TOP RIGHT: FLASH TOGGLE */}
        <View style={tw`absolute top-4 right-4`} pointerEvents="box-none">
          <TouchableOpacity
            onPress={() => setTorchOn((t) => !t)}
            style={tw`bg-ink-900/70 px-3 py-2 rounded-xl`}
            disabled={busy}
          >
            <CustomText color="#fff">
              {torchOn ? 'Flash: On' : 'Flash: Off'}
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* BOTTOM CONTROLS */}
        <View
          style={tw`absolute bottom-8 left-0 right-0 items-center`}
          pointerEvents="box-none"
        >
          {mode === 'barcode' && (
            <TouchableOpacity
              onPress={takePhotoAndOCR}
              disabled={busy}
              style={tw`bg-ink-900/70 px-4 py-2 rounded-xl`}
            >
              <CustomText color="#fff" style={tw`font-semibold`}>
                Try Photo OCR
              </CustomText>
            </TouchableOpacity>
          )}
          {mode === 'ocr' && (
            <TouchableOpacity
              onPress={() => setMode('barcode')}
              disabled={busy}
              style={tw`bg-ink-900/70 px-4 py-2 rounded-xl mt-2`}
            >
              <CustomText color="#fff" style={tw`font-semibold`}>
                Back to Barcode
              </CustomText>
            </TouchableOpacity>
          )}
          {busy && <ActivityIndicator style={tw`mt-3`} />}
        </View>

        {/* THUMB OF LAST PHOTO + VIN */}
        {!!photoUri && (
          <View
            style={tw`absolute left-4 right-4 bottom-24 flex-row items-center gap-3 p-2 bg-ink-900/80 rounded-xl`}
          >
            <Image
              source={{ uri: photoUri }}
              style={tw`w-20 h-14 rounded-lg`}
            />
            <View style={tw`flex-1`}>
              <CustomText
                color={tw.color('ink-700') as string}
                style={tw`text-2xs`}
              >
                Last photo
              </CustomText>
              {vin && (
                <CustomText
                  color={tw.color('ink-50') as string}
                  style={tw`font-semibold`}
                >
                  VIN: {vin}
                </CustomText>
              )}
            </View>
          </View>
        )}

        {/* VIN + DECODE PANEL */}
        {!!vin && (
          <View
            style={tw`absolute top-10 left-4 right-4 bg-ink-900/80 rounded-2xl p-3`}
          >
            <CustomText
              color={tw.color('ink-300') as string}
              style={tw`font-semibold mb-1`}
            >
              VIN Detected
            </CustomText>
            <CustomText
              color={tw.color('yellow-200') as string}
              style={tw`font-bold`}
            >
              {vin}
            </CustomText>
            {decoded && (
              <View style={tw`mt-2`}>
                <CustomText
                  color={tw.color('ink-500') as string}
                  style={tw`text-2xs mb-1`}
                >
                  Decoded (vPIC)
                </CustomText>
                <CustomText
                  color={tw.color('ink-50') as string}
                  style={tw`text-2xs`}
                >
                  {JSON.stringify(decoded, null, 2)}
                </CustomText>
              </View>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}
