import { Image } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../texts/CustomText';
import { resolvePressableStyle } from '@/utils/style';
import { AppPressable } from './AppPressable';

type Props = React.ComponentProps<typeof AppPressable> & {
  title?: string;
};

export function GoogleButton({
  title = 'Sign in with Google',
  isLoading,
  style,
  ...rest
}: Props) {
  return (
    <AppPressable
      {...rest}
      isLoading={isLoading}
      accessibilityRole="button"
      style={(state) => [
        tw`rounded-sm py-3 px-4 border border-surface-border flex-row items-center justify-center`,
        resolvePressableStyle(state, style),
      ]}
    >
      {(state) => (
        <>
          <Image
            source={require('@assets/google-icon.png')}
            style={[
              { width: 14, height: 14, marginRight: 6 },
              state.pressed && tw`opacity-70`,
            ]}
          />
          <CustomText
            style={[
              tw`text-ink-700 font-semibold text-xl`,
              state.pressed && tw`text-ink-500`,
            ]}
          >
            {title}
          </CustomText>
        </>
      )}
    </AppPressable>
  );
}
