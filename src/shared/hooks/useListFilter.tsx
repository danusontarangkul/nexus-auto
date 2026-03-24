import { useState, useMemo, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterLogicMap, useFilter } from './useFilter';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { BackHeader } from '@/navigation/components/BackHeader';
import { SearchHeader } from '../components/headers/SearchHeader';
import tw from '@/styles/tw';

interface UseListFilterOptions<T> {
  data: T[] | undefined;
  filterLogic: FilterLogicMap<T>;
  searchFields: (item: T) => string[];
  headerTitle: string;
  onAddPress: () => void;
}

export function useListFilter<T>({
  data,
  filterLogic,
  searchFields,
  headerTitle,
  onAddPress,
}: UseListFilterOptions<T>) {
  const navigation = useNavigation();

  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 250);

  const categoryFiltered = useFilter(data, filter, filterLogic);

  const handleCloseSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const finalData = useMemo(() => {
    if (!debouncedSearchQuery) {
      return categoryFiltered;
    }

    const query = debouncedSearchQuery.toLowerCase();

    return categoryFiltered.filter((item) =>
      searchFields(item).some((field) => field?.toLowerCase().includes(query)),
    );
  }, [categoryFiltered, debouncedSearchQuery, searchFields]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () =>
        isSearching ? (
          <SearchHeader
            value={searchQuery}
            onChangeText={setSearchQuery}
            onBack={handleCloseSearch}
          />
        ) : (
          <BackHeader
            title={headerTitle}
            hideBack
            leftElement={
              <TouchableOpacity onPress={onAddPress}>
                <Ionicons name="add" size={28} color={tw.color('ink-900')} />
              </TouchableOpacity>
            }
            rightElement={
              <TouchableOpacity onPress={() => setIsSearching(true)}>
                <Ionicons
                  name="search-outline"
                  size={24}
                  color={tw.color('ink-900')}
                />
              </TouchableOpacity>
            }
          />
        ),
    });
  }, [navigation, isSearching, headerTitle, onAddPress]);

  return {
    filter,
    setFilter,
    searchQuery,
    isSearching,
    finalData,
    isEmpty: !data || data.length === 0,
    isSearchingEmpty: searchQuery.length > 0 && finalData.length === 0,
  };
}
