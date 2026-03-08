import { Modal, Pressable, View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VehicleListItem } from '@convex/types';
import { Id } from '@convex/_generated/dataModel';
import tw from '@/styles/tw';
import { palette } from '@/styles/theme';
import { CustomText } from '@/shared/components/texts/CustomText';

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  cars: VehicleListItem[];
  selectedId?: string | null;
  onSelect: (id: Id<'vehicles'>) => void;
  onAddCar: () => void;
};

export function CarPickerModal({
  visible,
  onClose,
  cars,
  selectedId,
  onSelect,
  onAddCar,
}: ModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={tw`flex-1 bg-black/60`} onPress={onClose}>
        <View
          style={tw`absolute left-5 right-5 top-24 bg-surface-900 rounded-xl p-2 border border-surface-border shadow-2xl`}
        >
          <FlatList
            data={cars}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const isSelected = item._id === selectedId;
              return (
                <Pressable
                  onPress={() => onSelect(item._id)}
                  style={tw`px-4 py-4 rounded-lg ${isSelected ? 'bg-surface-800' : ''} flex-row justify-between items-center`}
                >
                  <CustomText
                    variant="body"
                    color={
                      isSelected ? tw.color('ink-50') : tw.color('ink-700')
                    }
                  >
                    {item.year} {item.make} {item.model}
                  </CustomText>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={palette.primary[500]}
                    />
                  )}
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={tw`h-[1px] bg-surface-border/40 mx-2`} />
            )}
            ListFooterComponent={
              <Pressable
                onPress={() => {
                  onClose();
                  onAddCar();
                }}
                style={tw`flex-row items-center gap-3 px-4 py-5 border-t border-surface-border/40 mt-1`}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color={palette.primary[500]}
                />
                <CustomText variant="body" color={palette.primary[500]}>
                  Add New Vehicle
                </CustomText>
              </Pressable>
            }
          />
        </View>
      </Pressable>
    </Modal>
  );
}
