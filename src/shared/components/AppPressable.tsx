import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  PressableProps as RNPressableProps,
  View,
  PressableStateCallbackType,
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
  spinnerColor = '#fff',
  style,
  ...rest
}: AppPressableProps) {
  const isInactive = disabled || isLoading;

  const getContent = (state: PressableStateCallbackType) => {
    if (isLoading) {
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
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        isInactive && tw`opacity-50`,
      ]}
    >
      {(state) => getContent(state)}
    </Pressable>
  );
}
