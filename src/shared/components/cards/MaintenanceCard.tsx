import { Pressable } from 'react-native';
import { Card } from '@/shared/components/cards/Card';
import { CustomText } from '@/shared/components/texts/CustomText';
import tw from '@/styles/tw';
import { formatMaintenanceInterval } from '@/utils/format';

interface MaintenanceCardProps {
  name: string;
  intervalMiles?: number;
  onPress?: () => void;
}

export function MaintenanceCard({
  name,
  intervalMiles,
  onPress,
}: MaintenanceCardProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card>
        <CustomText color={tw.color('ink-50')}>🛠️ {name}</CustomText>
        <CustomText color={tw.color('ink-700')} style={tw`mt-1`}>
          {formatMaintenanceInterval(intervalMiles)}
        </CustomText>
      </Card>
    </Pressable>
  );
}
