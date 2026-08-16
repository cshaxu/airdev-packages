/* "@airdev/next": "managed" */

'use client';

import HeaderBarWithHome from '@/airdev/frontend/components/shell/HeaderBarWithHome';
import DeleteDialog from '@/airdev/frontend/components/ui/DeleteDialog';
import { clientComponentConfig } from '@/config/component';
import EditUserProfileTile from './EditUserProfileTile';
import { useUserProfileSettingsController } from './useUserProfileSettingsController';

export default function SettingsView() {
  const vm = useUserProfileSettingsController();
  const { SettingsContent } = clientComponentConfig;
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <HeaderBarWithHome items={[{ label: 'Settings' }]} />
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="size-full overflow-y-auto p-6">
          <div className="space-y-6">
            <EditUserProfileTile vm={vm} />
            {SettingsContent && <SettingsContent userId={vm.currentUser.id} />}
          </div>
        </div>
      </div>
      <DeleteDialog
        title="Account"
        name={vm.currentUser.email ?? vm.currentUser.name ?? 'account'}
        isOpen={vm.deleteOpen}
        isLoading={vm.isDeleting}
        onOpenChange={vm.setDeleteOpen}
        onConfirm={vm.handleDeleteAccount}
      />
    </div>
  );
}
