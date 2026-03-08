import { FilterLogicMap } from '@/shared/hooks/useFilter';
import { FilterType } from '@/utils/const';
import { isExpired } from '@/utils/format';
import { Doc } from '@convex/_generated/dataModel';

export const WARRANTY_FILTER_LOGIC: FilterLogicMap<Doc<'warranties'>> = {
  active: (warranty) => warranty.isActive && !isExpired(warranty.expiresAt),
  expired: (warranty) => !warranty.isActive || isExpired(warranty.expiresAt),
};

export const getEmptyMessage = (filter: FilterType) => {
  if (filter === 'active') {
    return 'No active warranties';
  }
  if (filter === 'expired') {
    return 'No expired warranties';
  }
  return 'No warranties found';
};
