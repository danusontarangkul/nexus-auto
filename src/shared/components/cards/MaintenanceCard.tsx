import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doc } from '@convex/_generated/dataModel';
import { Card } from '@/shared/components/cards/Card';
import { CustomText } from '@/shared/components/texts/CustomText';
import tw from '@/styles/tw';
import { formatMaintenanceInterval } from '@/utils/format';
import { CATEGORY_ICONS } from '@/utils/const';

interface MaintenanceCardProps {
  item: Doc<'maintenanceItems'>;
  onPress?: () => void;
}

export function MaintenanceCard({ item, onPress }: MaintenanceCardProps) {
  const iconName = CATEGORY_ICONS[item.category] || 'build-outline';

  const intervalText = `Every ${formatMaintenanceInterval(item.intervalMiles)}`;

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card>
        <View style={tw`flex-row items-center`}>
          <View style={tw`p-2 mr-3`}>
            <Ionicons name={iconName} size={22} color={tw.color('ink-900')} />
          </View>

          <View style={tw`flex-1`}>
            <CustomText
              color={tw.color('ink-50')}
              variant="body"
              numberOfLines={1}
            >
              {item.serviceName}
            </CustomText>

            {item.nextDueMileage && (
              <CustomText
                color={tw.color('blue-400')}
                style={tw`mt-0.5`}
                variant="body"
              >
                Next due at {item.nextDueMileage.toLocaleString()} mi
              </CustomText>
            )}

            <CustomText
              color={tw.color('ink-700')}
              style={tw`mt-0.5`}
              variant="body"
            >
              {intervalText}
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
