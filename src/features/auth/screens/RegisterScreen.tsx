import React, { useState } from 'react';
import { useAppState } from '../../../state/AppState';
import { Screen } from '../../../shared/components/Screen';
import { View } from 'react-native';
import { Input } from '../../../shared/components/Input';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import tw from '../../../styles/tw';
import { CustomText } from '../../../shared/components/CustomText';

export function RegisterScreen() {
  const { register } = useAppState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>
          Create account
        </CustomText>
        <Input placeholder="Name" value={name} onChangeText={setName} />
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
          title="Create account"
          onPress={() => {
            // TODO: Convex signUp
            register();
          }}
        />
      </View>
    </Screen>
  );
}
