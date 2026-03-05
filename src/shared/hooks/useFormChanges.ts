import { useMemo } from 'react';

export function useFormChanges<T extends Record<string, any>>(
  initial: T | undefined | null,
  current: T,
  extraConditions: boolean[] = [],
) {
  return useMemo(() => {
    const hasExtraChanges = extraConditions.some(
      (condition) => condition === true,
    );

    if (hasExtraChanges) {
      return true;
    }
    if (!initial) {
      return false;
    }

    return Object.keys(current).some((key) => {
      const initialValue = initial[key as keyof T];
      const currentValue = current[key as keyof T];

      if ((currentValue as unknown) instanceof Date) {
        const initialTime =
          typeof initialValue === 'number'
            ? initialValue
            : (initialValue as unknown) instanceof Date
              ? (initialValue as Date).getTime()
              : null;

        return initialTime !== (currentValue as Date).getTime();
      }

      if (Array.isArray(currentValue)) {
        if (
          !Array.isArray(initialValue) ||
          currentValue.length !== initialValue.length
        ) {
          return true;
        }
        return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
      }

      return initialValue !== currentValue;
    });
  }, [initial, current, extraConditions]);
}
