import { View } from 'react-native';
import { Doc, Id } from '@convex/_generated/dataModel';
import { CustomText } from '../texts/CustomText';
import { ImageUploadSquare } from './ImageUploadSquare';
import tw from '@/styles/tw';
import { RemoteImageSquare } from './RemoteImageSquare';

interface DocumentGalleryProps {
  label?: string;
  existingReceipts: Doc<'receipts'>[];
  removedReceiptIds: Id<'receipts'>[];
  pendingUris: string[];
  isEditing: boolean;
  onRemoveExisting: (id: Id<'receipts'>) => void;
  onRemovePending: (index: number) => void;
  onAddPress: () => void;
}

export function DocumentGallery({
  label = 'Documents',
  existingReceipts,
  removedReceiptIds,
  pendingUris,
  isEditing,
  onRemoveExisting,
  onRemovePending,
  onAddPress,
}: DocumentGalleryProps) {
  const visibleExisting = existingReceipts.filter(
    (r) => !removedReceiptIds.includes(r._id),
  );

  const hasDocuments = visibleExisting.length > 0 || pendingUris.length > 0;

  return (
    <View style={tw``}>
      <CustomText variant="label" style={tw`mb-1`}>
        {label}
      </CustomText>

      {hasDocuments || isEditing ? (
        <View style={tw`flex-row flex-wrap gap-4`}>
          {visibleExisting.map((receipt) => (
            <RemoteImageSquare
              key={receipt._id}
              storageId={receipt.storageId}
              isEditing={isEditing}
              onRemove={() => onRemoveExisting(receipt._id)}
            />
          ))}

          {pendingUris.map((uri, index) => (
            <ImageUploadSquare
              key={`${uri}-${index}`}
              imageUri={uri}
              isEditing={isEditing}
              onRemove={() => onRemovePending(index)}
              onPress={() => {}}
            />
          ))}

          {isEditing && (
            <ImageUploadSquare
              imageUri={null}
              isEditing={true}
              onPress={onAddPress}
            />
          )}
        </View>
      ) : (
        <CustomText variant="value">No documents attached</CustomText>
      )}
    </View>
  );
}
