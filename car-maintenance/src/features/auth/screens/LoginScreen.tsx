import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { Input } from '../../../shared/components/Input';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { useAppState } from '../../../state/AppState';
import tw from '../../../styles/tw';

export function LoginScreen() {
  const nav = useNavigation();
  const { login } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <Text style={tw`text-2xl font-semibold text-ink-900`}>Log in</Text>
        <Input
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <PrimaryButton
          title="Log in"
          onPress={() => {
            // TODO: call Convex auth
            login();
          }}
        />
        <PrimaryButton
          title="Create an account"
          style={tw`bg-white border border-slate-200`}
          onPress={() => nav.navigate('Register' as never)}
        />
      </View>
    </Screen>
  );
}
