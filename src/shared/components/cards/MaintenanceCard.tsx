import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/shared/components/cards/Card';
import { CustomText } from '@/shared/components/texts/CustomText';
import tw from '@/styles/tw';
import { formatMaintenanceInterval } from '@/utils/format';
import { ServiceCategory } from '@convex/types/literals';
import { CATEGORY_ICONS } from '@/utils/const';

interface MaintenanceCardProps {
  name: string;
  category: typeof ServiceCategory.type;
  intervalMiles?: number;
  onPress?: () => void;
}

export function MaintenanceCard({
  name,
  category,
  intervalMiles,
  onPress,
}: MaintenanceCardProps) {
  const iconName = CATEGORY_ICONS[category] || 'build-outline';

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card>
        <View style={tw`flex-row items-center`}>
          <View style={tw`p-2  mr-3`}>
            <Ionicons name={iconName} size={20} color={tw.color('ink-900')} />
          </View>

          <View style={tw`flex-1`}>
            <CustomText color={tw.color('ink-50')} numberOfLines={1}>
              {name}
            </CustomText>
            <CustomText color={tw.color('ink-700')} style={tw`mt-0.5`}>
              {formatMaintenanceInterval(intervalMiles)}
            </CustomText>
          </View>

          {onPress && (
            <Ionicons
              name="chevron-forward"
              size={18}
              color={tw.color('ink-300')}
            />
          )}
        </View>
      </Card>
    </Pressable>
  );
}
