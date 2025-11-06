import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { CarSwitcher, CarLite } from '../../../shared/components/CarSwitcher';
import { AvatarButton } from '../../../shared/components/AvatarButton';
import { CustomText } from '../../../shared/components/CustomText';
import { Card } from '../../../shared/components/Card'; // you said this exists
import tw from '../../../styles/tw';
import { useNavigation } from '@react-navigation/native';

const MOCK_CARS: CarLite[] = [
  { id: 't3', year: 2021, make: 'Tesla', model: 'Model 3' },
  { id: 'r4', year: 2021, make: 'Toyota', model: 'RAV4' },
  { id: 'civ', year: 2019, make: 'Honda', model: 'Civic' },
  { id: 'cam', year: 2022, make: 'Toyota', model: 'Camry' },
];

export default function DashboardScreen() {
  const nav = useNavigation<any>();
  const [selectedId, setSelectedId] = useState<string>(MOCK_CARS[0].id);

  return (
    <Screen>
      <View style={tw`flex-row items-center justify-between mb-4 mt-4`}>
        <CarSwitcher
          cars={MOCK_CARS}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCar={() => nav.navigate('Onboarding' as never)}
        />
        <AvatarButton
          source={require('../../../../assets/pup-icon.jpg')}
          onPress={() => {
            /* profile later */
          }}
        />
      </View>

      <CustomText
        variant="titleLg"
        color={tw.color('ink-50') as string}
        style={tw`mt-1 mb-3`}
      >
        Dashboard
      </CustomText>

      <View style={tw`flex-row gap-3`}>
        <Card style={tw`flex-1`}>
          <CustomText color={tw.color('ink-700') as string}>
            Recent Activity
          </CustomText>
          <CustomText
            variant="title"
            color={tw.color('ink-50') as string}
            style={tw`mt-1`}
          >
            Oil Change
          </CustomText>
          <CustomText color={tw.color('ink-700') as string}>
            30,124 mi{'\n'}March 5, 2024
          </CustomText>
        </Card>

        <Card style={tw`flex-1`}>
          <CustomText color={tw.color('ink-700') as string}>
            Next Activity
          </CustomText>
          <CustomText
            variant="title"
            color={tw.color('ink-50') as string}
            style={tw`mt-1`}
          >
            Oil Change
          </CustomText>
          <CustomText color={tw.color('ink-700') as string}>
            40,124 mi{'\n'}June 5, 2024
          </CustomText>
        </Card>
      </View>

      <CustomText
        variant="title"
        color={tw.color('ink-50') as string}
        style={tw`mt-6 mb-2`}
      >
        Recommended Services
      </CustomText>

      <View style={tw`gap-3`}>
        <Card>
          <CustomText color={tw.color('ink-50') as string}>
            🛠️ Oil Change
          </CustomText>
          <CustomText color={tw.color('ink-700') as string}>
            Every 5,000 mi. Last done 3 months ago
          </CustomText>
        </Card>
        <Card>
          <CustomText color={tw.color('ink-50') as string}>
            📄 Air Filter
          </CustomText>
          <CustomText color={tw.color('ink-700') as string}>
            Every 5,000 mi. Last done 3 months ago
          </CustomText>
        </Card>
        <Card>
          <CustomText color={tw.color('ink-50') as string}>
            ⚙️ Tire Rotation
          </CustomText>
          <CustomText color={tw.color('ink-700') as string}>
            Every 5,000 mi. Last done 3 months ago
          </CustomText>
        </Card>
      </View>

      <CustomText
        variant="title"
        color={tw.color('ink-50') as string}
        style={tw`mt-6 mb-2`}
      >
        Vehicle Documents
      </CustomText>

      <View style={tw`flex-row gap-3`}>
        <Card style={tw`flex-1`}>
          <CustomText color={tw.color('ink-50') as string}>
            Registration
          </CustomText>
          <CustomText color={tw.color('ink-700') as string}>
            Exp. March 5, 2024
          </CustomText>
        </Card>
        <Card style={tw`flex-1`}>
          <CustomText color={tw.color('ink-50') as string}>
            Insurance
          </CustomText>
          <CustomText color={tw.color('ink-700') as string}>
            Exp. June 5, 2024
          </CustomText>
        </Card>
      </View>
    </Screen>
  );
}
