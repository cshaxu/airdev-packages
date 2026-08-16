/* "@airdev/next": "managed" */

'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/airdev/frontend/components/ui/Avatar';
import { Button } from '@/airdev/frontend/components/ui/Button';
import { Input } from '@/airdev/frontend/components/ui/Input';
import { Pencil, Trash2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { UserProfileSettingsViewModel } from './useUserProfileSettingsController';

export default function EditUserProfileTile({
  vm,
}: {
  vm: UserProfileSettingsViewModel;
}) {
  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    vm.setDraftName(event.target.value);
  }

  return (
    <section className="bg-background min-w-[220px] rounded-2xl border p-5 shadow-sm">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="size-16 border">
            <AvatarImage
              src={vm.currentUser.imageUrl ?? undefined}
              alt={vm.displayName}
            />
            <AvatarFallback className="text-lg font-semibold">
              {vm.nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            {vm.isEditingName ? (
              <Input
                ref={vm.nameInputRef}
                value={vm.draftName}
                onChange={handleNameChange}
                onKeyDown={vm.handleNameKeyDown}
                disabled={vm.isUpdatingUser}
                className="h-11 max-w-md text-base font-semibold"
                aria-label="Name"
              />
            ) : (
              <p className="truncate text-lg font-semibold">{vm.displayName}</p>
            )}
            <p className="text-muted-foreground truncate text-sm">
              {vm.currentUser.email}
            </p>
            {vm.isEditingName && (
              <p className="text-muted-foreground mt-2 text-xs">
                Press Enter to save. Press Escape to cancel.
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            aria-label={vm.isEditingName ? 'Cancel editing' : 'Edit profile'}
            variant={vm.isEditingName ? 'ghost' : 'outline'}
            className="size-9 min-w-9 gap-0 px-0 min-[500px]:h-9 min-[500px]:w-auto min-[500px]:min-w-[96px] min-[500px]:gap-2 min-[500px]:px-4"
            onClick={
              vm.isEditingName
                ? vm.handleCancelEditingName
                : vm.handleStartEditingName
            }
            disabled={vm.isUpdatingUser}
          >
            <Pencil className="size-4" />
            <span className="hidden min-[500px]:inline">
              {vm.isEditingName ? 'Cancel' : 'Edit'}
            </span>
          </Button>
          <Button
            aria-label="Delete account"
            variant="outline"
            className="size-9 min-w-9 gap-0 border-[var(--destructive-outline-border)] px-0 text-[var(--destructive-outline-foreground)] hover:bg-[var(--destructive-outline-hover)] hover:text-[var(--destructive-outline-hover-foreground)] min-[500px]:h-9 min-[500px]:w-auto min-[500px]:min-w-[96px] min-[500px]:gap-2 min-[500px]:px-4"
            onClick={() => vm.setDeleteOpen(true)}
            disabled={vm.isDeleting || vm.isEditingName}
          >
            <Trash2 className="size-4" />
            <span className="hidden min-[500px]:inline">Delete</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
