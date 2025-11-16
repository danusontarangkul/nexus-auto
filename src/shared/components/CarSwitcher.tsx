import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, View } from 'react-native';
import tw from '../../styles/tw';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from './CustomText';

export type CarLite = { id: string; year: number; make: string; model: string };

type Props = {
  cars: CarLite[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddCar?: () => void;
};

export function CarSwitcher({ cars, selectedId, onSelect, onAddCar }: Props) {
  const [open, setOpen] = useState(false);

  const current = useMemo(
    () => cars.find((c) => c.id === selectedId) ?? cars[0],
    [cars, selectedId],
  );

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={tw`flex-row items-center gap-2`}
        accessibilityLabel="Choose a car"
        accessibilityRole="button"
      >
        <Ionicons name="car-outline" size={34} color="white" />
        <CustomText variant="titleXL" color={tw.color('ink-50') as string}>
          {current
            ? `${current.year} ${current.make} ${current.model}`
            : 'Select car'}
        </CustomText>
        <Ionicons name="chevron-down" size={18} color="white" />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={tw`flex-1 bg-black/50`}
          onPress={() => setOpen(false)}
        >
          <View
            style={tw`absolute left-5 right-5 top-24 bg-surface-900 rounded-xl p-2 border border-surface-border`}
          >
            <FlatList
              data={cars}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                  style={tw`px-3 py-3 rounded-lg ${item.id === current?.id ? 'bg-surface-800' : ''}`}
                >
                  <CustomText color={tw.color('ink-900') as string}>
                    {item.year} {item.make} {item.model}
                  </CustomText>
                </Pressable>
              )}
              ItemSeparatorComponent={() => (
                <View style={tw`h-[1px] bg-surface-border/60 mx-2`} />
              )}
              ListFooterComponent={
                onAddCar ? (
                  <Pressable
                    onPress={() => {
                      setOpen(false);
                      onAddCar?.();
                    }}
                    style={tw`flex-row items-center gap-2 px-3 py-3`}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={18}
                      color={tw.color('ink-900') as string}
                    />
                    <CustomText color={tw.color('ink-900') as string}>
                      Add Car
                    </CustomText>
                  </Pressable>
                ) : null
              }
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
