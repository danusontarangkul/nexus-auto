import tw from '@/styles/tw';
import { resolvePressableStyle } from '@/utils/style';
import { CustomText } from '../texts/CustomText';
import { AppPressable } from './AppPressable';
import { getButtonTheme, ButtonVariant } from '@/styles/utils';

type Props = React.ComponentProps<typeof AppPressable> & {
  title: string;
  variant?: ButtonVariant;
};

export function PrimaryButton({
  title,
  style,
  isLoading,
  disabled,
  variant = 'primary',
  ...rest
}: Props) {
  const theme = getButtonTheme(variant);

  return (
    <AppPressable
      {...rest}
      isLoading={isLoading}
      disabled={disabled}
      style={(state) => [
        tw.style(
          `${theme.bgClass} rounded-xl py-3 items-center justify-center border ${theme.borderColor} border-[0.5px]`,
          disabled && 'opacity-50',
        ),
        resolvePressableStyle(state, style),
      ]}
      android_ripple={{ color: theme.rippleColor }}
      spinnerColor={theme.spinnerColor}
    >
      <CustomText style={tw`${theme.textClass} font-semibold`}>
        {title}
      </CustomText>
    </AppPressable>
  );
}
