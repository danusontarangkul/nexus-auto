import React, { useEffect, useState } from 'react';
import { Screen } from '@/shared/components/Screen';
import { useAppState } from '../../../state/AppState';
import { View, Text, Alert } from 'react-native';
import tw from '@/styles/tw';
import { CircleImage } from '@/shared/components/CircleImage';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import Purchases from 'react-native-purchases';

export function Subscribe() {
  const { subscribe } = useAppState();
  const nav = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current?.availablePackages.length) {
          setPackages(offerings.current.availablePackages);
        } else if (__DEV__) {
          setPackages([
            {
              identifier: 'pro_monthly',
              product: {
                identifier: 'pro_monthly',
                name: 'Pro Monthly',
                priceString: '$4.99',
                currencyCode: 'USD',
              },
            },
          ]);
        }
      } catch (e) {
        if (__DEV__) {
          setPackages([
            {
              identifier: 'pro_monthly',
              product: {
                name: 'Pro Monthly (Test)',
                priceString: '$4.99',
              },
            },
          ]);
        }
      }
    };
    loadOfferings();
  }, []);

  const handleSubscribe = async () => {
    if (packages.length === 0) {
      Alert.alert('No packages', 'Check RevenueCat dashboard');
      return;
    }

    setLoading(true);

    if (__DEV__) {
      Alert.alert(
        'Test Purchase',
        'This is a fake purchase (development mode)',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy $4.99',
            onPress: async () => {
              const { hasCar } = await subscribe();
              nav.reset({
                index: 0,
                routes: [{ name: hasCar ? 'App' : 'Onboarding' }],
              });
            },
          },
        ],
      );
      setLoading(false);
      return;
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage(packages[0]);
      const isPro = customerInfo.entitlements.active['pro'] !== undefined;

      if (isPro) {
        const { hasCar } = await subscribe();
        nav.reset({
          index: 0,
          routes: [{ name: hasCar ? 'App' : 'Onboarding' }],
        });
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Purchase Error', e.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={tw`items-center mt-10`}>
        <CircleImage
          source={require('../../../../assets/login-hero.jpg')}
          size={180}
        />
      </View>

      <View style={tw`mt-10 px-6`}>
        <PrimaryButton
          title={loading ? 'Processing...' : 'Subscribe Now'}
          onPress={handleSubscribe}
          disabled={loading || packages.length === 0}
        />
      </View>
    </Screen>
  );
}
