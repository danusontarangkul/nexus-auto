import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/styles/tw';

interface SearchHeaderProps {
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

export function SearchHeader({
  value,
  onChangeText,
  onCancel,
  placeholder = 'Search records...',
}: SearchHeaderProps) {
  return (
    <View
      style={tw`flex-row items-center bg-surface-950 px-4 py-3 border-b border-surface-800`}
    >
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
          style={tw`flex-1 ml-2 text-ink-900 text-base`}
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
      <TouchableOpacity onPress={onCancel} style={tw`ml-4`}>
        <Ionicons name="close" size={28} color={tw.color('ink-900')} />
      </TouchableOpacity>
    </View>
  );
}
