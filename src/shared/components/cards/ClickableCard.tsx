import { ReactNode } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import tw from '@/styles/tw';

interface ClickableCardProps extends TouchableOpacityProps {
  children: ReactNode;
  onPress: () => void;
}

export function ClickableCard({
  children,
  onPress,
  activeOpacity = 0.7,
  style,
  ...props
}: ClickableCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[
        tw`bg-surface-800 border border-surface-border rounded-xl p-4 mb-3 flex-row items-center justify-between`,
        style,
      ]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}
