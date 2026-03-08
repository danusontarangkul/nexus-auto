import { Image } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../texts/CustomText';
import { resolvePressableStyle } from '@/utils/style';
import { AppPressable } from './AppPressable';

type Props = React.ComponentProps<typeof AppPressable> & {
  title?: string;
};

export function GoogleButton({
  title = 'Log in with Google',
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
        tw`rounded-md py-3 px-4 border border-surface-border flex-row items-center justify-center`,
        resolvePressableStyle(state, style),
      ]}
    >
      {(state) => (
        <>
          <Image
            source={require('@assets/google-icon.png')}
            style={[
              { width: 18, height: 18, marginRight: 10 },
              state.pressed && tw`opacity-70`,
            ]}
          />
          <CustomText
            style={[
              tw`text-ink-700 font-medium`,
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
