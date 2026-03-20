import { ActivityIndicator, Image, View } from 'react-native';
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
        tw`rounded-sm py-3 px-4 border border-surface-border flex-row items-center justify-center relative`,
        resolvePressableStyle(state, style),
      ]}
    >
      {(state) => (
        <>
          {isLoading && (
            <View style={tw`absolute inset-0 items-center justify-center z-10`}>
              <ActivityIndicator size="small" color={tw.color('ink-700')} />
            </View>
          )}

          <View
            style={[
              tw`flex-row items-center justify-center`,
              isLoading && tw`opacity-0`,
            ]}
          >
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
          </View>
        </>
      )}
    </AppPressable>
  );
}
