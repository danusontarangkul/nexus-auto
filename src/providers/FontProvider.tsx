import { useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
  SourceSansPro_700Bold,
} from '@expo-google-fonts/source-sans-pro';

/** Avoid infinite splash if fonts fail or hang (common in release/TestFlight). */
const SPLASH_MAX_WAIT_MS = 10_000;

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, fontError] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
    SourceSansPro_700Bold,
  });

  const didHideSplash = useRef(false);
  const hideSplash = () => {
    if (didHideSplash.current) return;
    didHideSplash.current = true;
    SplashScreen.hideAsync().catch(() => {});
  };

  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (fontError && __DEV__) {
        console.warn('[FontProvider] Font load error, continuing:', fontError);
      }
      hideSplash();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const t = setTimeout(() => hideSplash(), SPLASH_MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;
  return <>{children}</>;
}
