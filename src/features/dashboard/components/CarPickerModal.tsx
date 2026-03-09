import { FlatList, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VehicleListItem } from '@convex/types';
import { Id } from '@convex/_generated/dataModel';
import tw from '@/styles/tw';
import { palette } from '@/styles/theme';
import { CustomText } from '@/shared/components/texts/CustomText';
import { BottomSheet } from '@/shared/components/sheets/BottomSheet';

type Props = {
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
}: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <FlatList
        data={cars}
        keyExtractor={(item) => item._id}
        contentContainerStyle={tw`px-2`}
        renderItem={({ item }) => {
          const isSelected = item._id === selectedId;
          return (
            <Pressable
              onPress={() => {
                onSelect(item._id as Id<'vehicles'>);
                onClose();
              }}
              style={tw.style(
                'px-4 py-5 rounded-2xl flex-row justify-between items-center mb-1',
                isSelected && 'bg-surface-800',
              )}
            >
              <View style={tw`flex-1 mr-4`}>
                <CustomText
                  variant="body"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={tw.style(
                    'font-semibold',
                    isSelected ? 'text-white' : 'text-ink-300',
                  )}
                >
                  {item.year} {item.make} {item.model}
                </CustomText>
              </View>

              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={palette.primary[500]}
                />
              )}
            </Pressable>
          );
        }}
        ListFooterComponent={
          <Pressable
            onPress={() => {
              onClose();
              onAddCar();
            }}
            style={tw`flex-row items-center gap-3 px-4 py-6 mt-2 border-t border-surface-border/30`}
          >
            <View
              style={tw`w-10 h-10 rounded-full bg-primary-500/10 items-center justify-center`}
            >
              <Ionicons name="add" size={24} color={palette.primary[500]} />
            </View>
            <CustomText variant="body" style={tw`text-primary-500 font-bold`}>
              Add New Vehicle
            </CustomText>
          </Pressable>
        }
      />
    </BottomSheet>
  );
}
