import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../../styles/tw';
import { CustomText } from '../../../shared/components/CustomText';

export function VinScanLink({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={tw`flex-row items-center`} onPress={onPress}>
      <Ionicons
        name="camera-outline"
        size={22}
        color={tw.color('ink-900') as string}
      />
      <CustomText
        variant="link"
        color={tw.color('ink-900') as string}
        style={tw`underline ml-3`}
      >
        Upload Photo of VIN Barcode
      </CustomText>
    </TouchableOpacity>
  );
}
