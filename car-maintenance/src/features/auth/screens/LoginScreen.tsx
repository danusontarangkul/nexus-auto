import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { Input } from '../../../shared/components/Input';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { DividerWithOr } from '../../../shared/components/DividerWithOr';
import { CircleImage } from '../../../shared/components/CircleImage';
import { GoogleButton } from '../../../shared/components/GoogleButton';
import { useAppState } from '../../../state/AppState';
import tw from '../../../styles/tw';
import { useNavigation } from '@react-navigation/native';

export function LoginScreen() {
  const { login } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigation<any>();

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
          label="Username"
          placeholder="Username"
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

        <PrimaryButton
          title="Log in"
          onPress={async () => {
            const { hasCar } = await login();
            nav.reset({
              index: 0,
              routes: [{ name: hasCar ? 'App' : 'Onboarding' }],
            });
          }}
        />

        <DividerWithOr />

        <GoogleButton
          onPress={() => {
            /* TODO: google auth */
          }}
        />
      </View>
    </Screen>
  );
}
