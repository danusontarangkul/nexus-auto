import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  PressableProps as RNPressableProps,
  View,
} from 'react-native';
import tw from '@/styles/tw';

interface AppPressableProps extends RNPressableProps {
  isLoading?: boolean;
  spinnerColor?: string;
  style?: RNPressableProps['style'];
}

export function AppPressable({
  children,
  isLoading,
  disabled,
  spinnerColor = '#fff', // Changed default to white
  style,
  ...rest
}: AppPressableProps) {
  const isInactive = disabled || isLoading;

  const getContent = (state: { pressed: boolean }) => {
    if (isLoading) {
      // Placing the spinner in a View helps maintain button structure
      // if the parent has specific padding/alignment.
      return (
        <View style={tw`flex-row items-center justify-center`}>
          <ActivityIndicator size="small" color={spinnerColor} />
        </View>
      );
    }

    if (typeof children === 'function') {
      return children(state);
    }

    return children;
  };

  return (
    <Pressable
      {...rest}
      disabled={isInactive}
      // style is an array, ensuring the original button borders/colors remain
      style={[style as any, isInactive && tw`opacity-50`]}
    >
      {(state) => getContent(state)}
    </Pressable>
  );
}
