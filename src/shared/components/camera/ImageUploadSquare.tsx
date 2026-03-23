import { Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/styles/tw';

interface ImageUploadSquareProps {
  imageUri: string | null;
  isEditing: boolean;
  onRemove?: () => void;
  onPress: () => void;
}

export function ImageUploadSquare({
  imageUri,
  isEditing,
  onRemove,
  onPress,
}: ImageUploadSquareProps) {
  if (!imageUri) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={tw`w-24 h-24 bg-surface-800 rounded-xl items-center justify-center border border-dashed border-surface-border`}
      >
        <Ionicons name="add" size={32} color={tw.color('ink-500')} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={tw`w-24 h-24 relative`}>
      <Image
        source={{ uri: imageUri }}
        style={tw`w-full h-full rounded-xl bg-surface-900`}
      />

      {isEditing && onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={tw`absolute -top-2 -right-2 bg-error-500 rounded-full p-1 shadow-lg`}
        >
          <Ionicons name="close" size={16} color="white" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
