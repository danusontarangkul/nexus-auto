import { View } from 'react-native';
import tw from '@/styles/tw';
import { Avatar } from '../avatar/Avatar';
import { CustomText } from '../texts/CustomText';
import { Doc } from '@convex-dev/auth/server';
import { formatUserName, formatUserSecondaryText } from '@/utils/format';

interface UserHeaderProps {
  user: Doc<'users'>;
}

export function UserHeader({ user }: UserHeaderProps) {
  const secondaryText = formatUserSecondaryText(user?.email);
  const name = formatUserName(user?.name);

  return (
    <View
      style={tw`flex-row items-center bg-surface-800 rounded-xl px-4 py-4 mt-4 mb-2`}
    >
      <Avatar
        name={user?.name}
        image={user?.image}
        size={56}
        bgColor={tw.color('surface-700')}
      />

      <View style={tw`ml-4 flex-1`}>
        <CustomText variant="title" style={tw`text-ink-900`}>
          {name}
        </CustomText>

        <CustomText variant="body" style={tw`text-ink-700 mt-0.5`}>
          {secondaryText}
        </CustomText>
      </View>
    </View>
  );
}
