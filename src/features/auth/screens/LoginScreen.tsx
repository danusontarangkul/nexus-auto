import React, { useState, useEffect, useCallback } from 'react';
import { Alert, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { useAuthActions } from '@convex-dev/auth/react';
import { Screen } from '../../../shared/components/Screen';
import { Input } from '../../../shared/components/Input';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { DividerWithOr } from '../../../shared/components/DividerWithOr';
import { CircleImage } from '../../../shared/components/CircleImage';
import { GoogleButton } from '../../../shared/components/GoogleButton';
import { useAppState } from '../../../state/AppState';
import tw from '../../../styles/tw';

WebBrowser.maybeCompleteAuthSession();

export function LoginScreen() {
  const { subscribe } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigation();
  const { signIn } = useAuthActions();

  const handleAuthSuccess = useCallback(async () => {
    const { hasCar } = await subscribe();
    nav.reset({
      index: 0,
      routes: [{ name: hasCar ? ('App' as never) : ('Onboarding' as never) }],
    });
  }, [nav, subscribe]);

  // ✅ Handle the deep link after Google OAuth returns to your app
  const handleDeepLink = useCallback(
    async (event: { url: string }) => {
      const url = event.url;
      if (!url.includes('auth')) return;

      setIsLoading(true);
      try {
        const parsed = Linking.parse(url);
        const queryParams = (parsed.queryParams ?? {}) as Record<string, any>;

        // ✅ IMPORTANT: pass the query params directly (code + state)
        await signIn('google', queryParams);

        await handleAuthSuccess();
      } catch (error) {
        console.error('Auth callback error:', error);
        Alert.alert('Login Failed', 'Google sign-in failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess, signIn],
  );

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url && url.includes('auth')) {
        handleDeepLink({ url });
      }
    });

    return () => subscription.remove();
  }, [handleDeepLink]);

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const redirectTo = 'nexus-auto://auth';

      const result = await signIn('google', { redirectTo });
      const urlToOpen = result?.redirect?.toString();

      if (!urlToOpen) {
        throw new Error(
          'No redirect URL returned from Convex signIn("google")',
        );
      }

      // This will open the browser and then bounce back to nexus-auto://auth
      await WebBrowser.openAuthSessionAsync(urlToOpen, redirectTo);
      // ✅ no need to do anything here—your deep link listener finishes the flow
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  }, [signIn]);

  const handlePasswordAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      await signIn('password', {
        email,
        password,
        flow: isSignUpMode ? 'signUp' : 'signIn', // ✅ key change
      });
      await handleAuthSuccess();
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Login Failed',
        isSignUpMode
          ? 'Could not create account. Try a different email or a stronger password.'
          : 'Invalid email or password.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, password, handleAuthSuccess, isSignUpMode, signIn]);

  return (
    <Screen>
      <View style={tw`items-center mt-10`}>
        <CircleImage
          source={require('../../../../assets/login-hero.jpg')}
          size={180}
        />
      </View>

      <View style={tw`mt-8 gap-4`}>
        <Input
          label="Email"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Password"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* ✅ Primary action switches based on mode */}
        <PrimaryButton
          title={isSignUpMode ? 'Create account' : 'Log in'}
          onPress={handlePasswordAuth}
          disabled={isLoading}
        />

        {/* ✅ Simple mode toggle */}
        <PrimaryButton
          title={
            isSignUpMode
              ? 'Already have an account? Log in'
              : "Don't have an account? Sign up"
          }
          onPress={() => setIsSignUpMode((value) => !value)}
          disabled={isLoading}
        // If your PrimaryButton supports variants, you can make this secondary.
        // variant="secondary"
        />

        <DividerWithOr />

        <GoogleButton onPress={handleGoogleSignIn} disabled={isLoading} />
      </View>
    </Screen>
  );
}
