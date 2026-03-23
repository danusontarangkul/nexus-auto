import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { BottomSheet } from '@/shared/components/sheets/BottomSheet';
import { SheetActionRow } from '@/shared/components/sheets/SheetActionRow';

type ImageSourcePickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectLibrary: () => void;
};

export function ImageSourcePickerSheet({
  visible,
  onClose,
  onSelectCamera,
  onSelectLibrary,
}: ImageSourcePickerSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={tw`px-4 pb-2`}>
        <CustomText variant="title" style={tw`mb-4 text-white`}>
          Add photo
        </CustomText>
        <View style={tw`gap-2`}>
          <SheetActionRow
            icon="camera-outline"
            label="Take Photo"
            onPress={onSelectCamera}
          />
          <SheetActionRow
            icon="images-outline"
            label="Choose from Library"
            onPress={onSelectLibrary}
          />
        </View>
      </View>
    </BottomSheet>
  );
}
