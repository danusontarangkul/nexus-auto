import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { VehicleListItem } from '@convex/types';
import { Id } from '@convex/_generated/dataModel';
import { CustomText } from './CustomText';
import tw from '@/styles/tw';
import { palette } from '@/styles/theme';

type Props = {
  cars: VehicleListItem[];
  selectedId: Id<'vehicles'> | string | null;
  onSelect: (id: Id<'vehicles'>) => Promise<void> | void;
  onAddCar: () => void;
  isLoading?: boolean;
};

export function CarSwitcher({
  cars,
  selectedId,
  onSelect,
  onAddCar,
  isLoading,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const current = useMemo(
    () => cars.find((c) => c._id === selectedId) ?? cars[0],
    [cars, selectedId],
  );

  const handleCarPress = async (id: Id<'vehicles'>) => {
    setOpen(false);
    if (id === current?._id) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await onSelect(id);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={isLoading}
        style={tw`flex-row items-center gap-2 py-1`}
        accessibilityLabel="Choose a car"
        accessibilityRole="button"
      >
        <Ionicons name="car-outline" size={32} color="white" />

        <View style={tw`flex-row items-center gap-2`}>
          <CustomText variant="titleXL" color={tw.color('ink-50') as string}>
            {current
              ? `${current.year} ${current.make} ${current.model}`
              : 'Select car'}
          </CustomText>

          {/* Contextual Loading State */}
          {isLoading ? (
            <ActivityIndicator size="small" color={palette.primary[500]} />
          ) : (
            <Ionicons
              name="chevron-down"
              size={18}
              color={tw.color('ink-500') as string}
            />
          )}
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={tw`flex-1 bg-black/60`}
          onPress={() => setOpen(false)}
        >
          <View
            style={tw`absolute left-5 right-5 top-24 bg-surface-900 rounded-xl p-2 border border-surface-border shadow-2xl`}
          >
            <FlatList
              data={cars}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const isSelected = item._id === current?._id;
                return (
                  <Pressable
                    onPress={() => handleCarPress(item._id as Id<'vehicles'>)}
                    style={tw`px-4 py-4 rounded-lg ${isSelected ? 'bg-surface-800' : ''} flex-row justify-between items-center`}
                  >
                    <CustomText
                      variant="body"
                      color={
                        isSelected
                          ? (tw.color('ink-50') as string)
                          : (tw.color('ink-700') as string)
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
                    setOpen(false);
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
    </>
  );
}
