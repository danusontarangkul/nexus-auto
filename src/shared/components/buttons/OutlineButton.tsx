import { Pressable, PressableProps } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../texts/CustomText';

const baseStyle = tw.style(
  'bg-transparent rounded-xl py-3 items-center justify-center border border-surface-border',
);

type Props = PressableProps & { title: string };

export function OutlineButton({ title, style, ...rest }: Props) {
  return (
    <Pressable
      style={
        typeof style === 'function'
          ? (state) => [baseStyle, style(state)]
          : [baseStyle, style]
      }
      {...rest}
    >
      <CustomText style={tw`text-ink-500 font-medium`}>{title}</CustomText>
    </Pressable>
  );
}
