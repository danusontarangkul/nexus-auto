import { ActivityIndicator, View } from 'react-native';
import tw from '@/styles/tw';
import { ImageUploadSquare } from './ImageUploadSquare';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';

interface RemoteImageSquareProps {
  storageId?: Id<'_storage'>;
  isEditing: boolean;
  onRemove: () => void;
}

export function RemoteImageSquare({
  storageId,
  isEditing,
  onRemove,
}: RemoteImageSquareProps) {
  const imageUrl = useQuery(
    api.image.getImageUrl,
    storageId ? { storageId } : 'skip',
  );

  if (storageId && imageUrl === undefined) {
    return (
      <View
        style={tw`w-28 h-28 bg-surface-800 rounded-2xl items-center justify-center border border-surface-border`}
      >
        <ActivityIndicator size="small" color={tw.color('ink-500')} />
      </View>
    );
  }

  return (
    <ImageUploadSquare
      imageUri={imageUrl ?? null}
      isEditing={isEditing}
      onRemove={onRemove}
      onPress={() => {}}
    />
  );
}
