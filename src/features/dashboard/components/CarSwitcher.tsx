import React, { useState, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { VehicleListItem } from '@convex/types';
import { Id } from '@convex/_generated/dataModel';
import { CarSelectorTrigger } from './CarSelectorTrigger';
import { CarPickerModal } from './CarPickerModal';

interface CarSwitcherProps {
  cars: VehicleListItem[];
  selectedId: Id<'vehicles'> | string | null;
  onSelect: (id: Id<'vehicles'>) => Promise<void> | void;
  onAddCar: () => void;
  isLoading?: boolean;
}

export function CarSwitcher({
  cars,
  selectedId,
  onSelect,
  onAddCar,
  isLoading,
}: CarSwitcherProps) {
  const [open, setOpen] = useState<boolean>(false);

  const current = useMemo(
    () => cars.find((car) => car._id === selectedId) ?? cars[0],
    [cars, selectedId],
  );

  const handleSelect = async (id: Id<'vehicles'>) => {
    setOpen(false);

    if (id !== current?._id) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await onSelect(id);
    }
  };

  return (
    <>
      <CarSelectorTrigger
        currentCar={current}
        onPress={() => setOpen(true)}
        isLoading={isLoading}
      />

      <CarPickerModal
        visible={open}
        onClose={() => setOpen(false)}
        cars={cars}
        selectedId={current?._id}
        onSelect={handleSelect}
        onAddCar={onAddCar}
      />
    </>
  );
}
