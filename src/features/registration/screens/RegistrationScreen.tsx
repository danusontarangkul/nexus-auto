import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Screen } from '@/shared/components/Screen';
import { CustomText } from '@/shared/components/CustomText';
import { useRegistration, useUpsertRegistration } from '@/domain/registrations';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { useRegistrationRouteParams } from '../hooks/useRegistrationRouteParams';
import { useRegistrationHeader } from '../hooks/useRegistrationHeader';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import tw from '@/styles/tw';
import { toDateOrNull } from '@/utils/date';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { ActionGroup } from '@/shared/components/ActionGroup';
import { ButtonContainer } from '@/shared/components/ButtonContainer';

export function RegistrationScreen() {
  const { vehicleId } = useRegistrationRouteParams();
  const registrationData = useRegistration(vehicleId);
  const registration = registrationData?.registration;

  const [expiryDate, setExpiryDate] = React.useState<Date | null>(null);
  const { upsertRegistration, isLoading, error } = useUpsertRegistration();
  const { isEditing, setIsEditing } = useRegistrationHeader(!!registration);

  const hasChanges = useMemo(() => {
    const originalTime = registration?.expiresAt ?? null;
    const currentTime = expiryDate?.getTime() ?? null;
    return originalTime !== currentTime;
  }, [registration?.expiresAt, expiryDate]);

  const handleSave = async () => {
    if (!expiryDate || !hasChanges) return;

    const success = await upsertRegistration({
      vehicleId,
      expiresAt: expiryDate.getTime(),
      receiptIds: [],
      receiptIdsToRemove: [],
    });

    if (success) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    setExpiryDate(toDateOrNull(registration?.expiresAt));
  }, [registration]);

  if (!registrationData) return <FullScreenLoading />;

  return (
    <Screen>
      <View style={tw`flex-1 p-4`}>
        {registration || isEditing ? (
          <ControlledDatePicker
            label="Registration Expiration"
            value={expiryDate}
            isEditing={isEditing}
            onDateChange={setExpiryDate}
          />
        ) : (
          <View style={tw`items-center py-10`}>
            <CustomText>No registration found.</CustomText>
            <CustomText style={tw`text-ink-500 mt-2`}>
              Tap the + icon to add one
            </CustomText>
          </View>
        )}

        {isEditing && (
          <ButtonContainer>
            <ActionGroup error={error}>
              <PrimaryButton
                title="Save Registration"
                onPress={handleSave}
                isLoading={isLoading}
                disabled={!expiryDate || !hasChanges}
              />
            </ActionGroup>
          </ButtonContainer>
        )}
      </View>
    </Screen>
  );
}
