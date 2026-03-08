import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import tw from '@/styles/tw';
import { SettingsRow } from '@/shared/components/rows/SettingsRow';
import { UserHeader } from '@/shared/components/headers/UserHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { SUPPORT_EMAIL } from '@/utils/const';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';
import { useDeleteUser } from '@/domain/users/useDeleteUser';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';

export function AccountScreen() {
  const { dashboard } = useDashboardContext();
  const user = dashboard?.user;
  const { signOut } = useAuthActions();
  const { showConfirm } = useConfirmModal();
  const { deleteUser, isLoading } = useDeleteUser();
  const handleEmailSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };
  const handleSignOut = async () => {
    await signOut();
  };
  const handleDeleteAccount = () => {
    showConfirm({
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account?',
      onConfirm: handleConfirmDeleteAccount,
    });
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
    </Screen>
  );
}
