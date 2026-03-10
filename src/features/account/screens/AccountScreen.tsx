import { Linking, ScrollView } from 'react-native';
import { Screen } from '@/shared/components/screens/Screen';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import tw from '@/styles/tw';
import { SettingsRow } from '@/shared/components/rows/SettingsRow';
import { UserHeader } from '@/shared/components/headers/UserHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { SUPPORT_EMAIL } from '@/utils/const';
import { useAuthActions } from '@convex-dev/auth/react';
import { useDeleteUser } from '@/domain/users/useDeleteUser';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import { useState } from 'react';

export function AccountScreen() {
  const { dashboard } = useDashboardContext();
  const user = dashboard?.user;
  const { signOut } = useAuthActions();
  const { deleteUser, isLoading, error } = useDeleteUser();
  const [visible, setVisible] = useState<boolean>(false);
  const handleEmailSupport = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Support Request')}`;

    await Linking.openURL(url);
  };
  const handleSignOut = async () => {
    await signOut();
  };
  const handleDeleteAccount = () => {
    setVisible(true);
  };

  const handleConfirmDeleteAccount = async () => {
    const success = await deleteUser();
    if (success) {
      await signOut();
    }
  };
  if (isLoading) {
    return <FullScreenLoading />;
  }
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        <UserHeader user={user} />

        <SectionHeader title="Account Settings" />
        <SettingsRow
          icon="log-out-outline"
          label="Sign Out"
          onPress={handleSignOut}
        />
        <SettingsRow
          icon="trash-outline"
          label="Delete Account"
          destructive
          onPress={handleDeleteAccount}
        />

        <SectionHeader title="Help Support" />
        <SettingsRow
          icon="mail-outline"
          label="Email Us"
          onPress={handleEmailSupport}
        />
      </ScrollView>
      <ConfirmModal
        visible={visible}
        title="Delete Account"
        message="Are you sure you want to delete your account?"
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setVisible(false)}
      />
    </Screen>
  );
}
