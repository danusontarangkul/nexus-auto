import { PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';

export function resolvePressableStyle(
  state: PressableStateCallbackType,
  style:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    | undefined,
): StyleProp<ViewStyle> {
  return typeof style === 'function' ? style(state) : style;
}
