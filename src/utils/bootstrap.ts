import * as SplashScreen from 'expo-splash-screen';
import { validateEnv } from './env';

export function bootstrap() {
  SplashScreen.preventAutoHideAsync().catch((e) =>
    console.warn('[Bootstrap] Splash lock failed:', e.message),
  );

  validateEnv();
}
