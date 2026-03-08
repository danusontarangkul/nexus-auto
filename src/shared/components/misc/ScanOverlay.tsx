import { View } from 'react-native';
import { CustomText } from '../texts/CustomText';
import tw from '@/styles/tw';

export function ScanOverlay({
  mode,
  busy,
}: {
  mode: 'Barcode' | 'OCR' | 'Done';
  busy: boolean;
}) {
  return (
    <View pointerEvents="none" style={tw`flex-1 items-center justify-center`}>
      <View
        style={tw`w-4/5 h-1/5 rounded-2xl border-2 border-cyan-400 bg-black/10`}
      />
      <CustomText
        style={tw`absolute bottom-24 font-semibold text-ink-50`}
        color={tw.color('ink-50')}
      >
        {busy ? 'Processing…' : `Mode: ${mode}`}
      </CustomText>
    </View>
  );
}
