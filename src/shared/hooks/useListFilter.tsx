import { useState, useMemo, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FilterLogicMap, useFilter } from './useFilter';
import { BackHeader } from '@/navigation/components/BackHeader';
import tw from '@/styles/tw';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { SearchHeader } from '../components/headers/SearchHeader';

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

  const categoryFiltered = useFilter(data, filter, filterLogic);

  const finalData = useMemo(() => {
    if (!searchQuery) {
      return categoryFiltered;
    }
    const query = searchQuery.toLowerCase();

    return categoryFiltered.filter((item) => {
      return searchFields(item).some((field) =>
        field?.toLowerCase().includes(query),
      );
    });
  }, [categoryFiltered, searchQuery, searchFields]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () =>
        isSearching ? (
          <SearchHeader
            value={searchQuery}
            onChangeText={setSearchQuery}
            onCancel={() => {
              setIsSearching(false);
              setSearchQuery('');
            }}
          />
        ) : (
          <BackHeader
            title={headerTitle}
            hideBack
            skipTopInset
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
  }, [navigation, isSearching, searchQuery, headerTitle, onAddPress]);

  return {
    filter,
    setFilter,
    searchQuery,
    isSearching,
    finalData,
    isEmpty: !data || data.length === 0,
    isSearchingEmpty: searchQuery && finalData.length === 0,
  };
}
