import { View, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/styles/tw';

interface SearchHeaderProps {
  value: string;
  onChangeText: (text: string) => void;
  onBack: () => void;
  placeholder?: string;
}

export function SearchHeader({
  value,
  onChangeText,
  onBack,
  placeholder = 'Search...',
}: SearchHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={tw.style(
        'flex-row items-center bg-surface-950 px-4 border-b border-surface-800',
        {
          paddingTop: insets.top + 4,
          paddingBottom: 12,
        },
      )}
    >
      <TouchableOpacity onPress={onBack} style={tw`mr-3`}>
        <Ionicons name="arrow-back" size={24} color={tw.color('ink-400')} />
      </TouchableOpacity>

      <View
        style={tw`flex-1 flex-row items-center bg-surface-800 rounded-lg px-3 h-11`}
      >
        <Ionicons name="search" size={20} color={tw.color('ink-400')} />

        <TextInput
          autoFocus
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tw.color('ink-400')}
          style={[
            tw`flex-1 ml-2 text-ink-900 text-base`,
            {
              height: '100%',
              paddingVertical: 0,
              lineHeight: 20,
              textAlignVertical: 'center',
            },
          ]}
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons
              name="close-circle"
              size={18}
              color={tw.color('ink-400')}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
