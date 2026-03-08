import { useMemo } from 'react';

export type FilterLogicMap<T> = {
  [key: string]: (item: T) => boolean;
};

export function useFilter<T>(
  data: T[] | undefined,
  currentFilter: string,
  logic: FilterLogicMap<T>,
) {
  return useMemo(() => {
    if (!data) return [];

    if (currentFilter === 'all') {
      return data;
    }
    const filterFn = logic[currentFilter];

    return filterFn ? data.filter(filterFn) : data;
  }, [data, currentFilter, logic]);
}
